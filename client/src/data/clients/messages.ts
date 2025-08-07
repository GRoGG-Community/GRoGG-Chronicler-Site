import { Message, assertMessageArray } from '../models/Message';
import { ApiConfig } from '../../infrastructure/config/api.config';
import { AppError, ErrorCode, ErrorHandler } from '../../infrastructure/errors/AppError';

const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
            errorData.message || `HTTP ${response.status}`,
            ErrorCode.NETWORK_ERROR,
            response.status
        );
    }
    return response.json();
};

export const messageApiClient = {
    async getMessagesForBoard(boardName: string): Promise<Message[]> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/messages?board=${encodeURIComponent(boardName)}&ts=${Date.now()}`, {
                headers: ApiConfig.headers,
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            const data = await handleApiResponse(response);
            return assertMessageArray(data);
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    },

    async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/messages`, {
                method: 'POST',
                headers: ApiConfig.headers,
                body: JSON.stringify(message),
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            const data = await handleApiResponse(response);
            return data;
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    },

    async updateMessage(messageData: { board: string; index: number; newText: string; editor: string; editOriginal?: boolean }): Promise<void> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/messages/edit`, {
                method: 'POST',
                headers: ApiConfig.headers,
                body: JSON.stringify(messageData),
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            await handleApiResponse(response);
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    },

    async deleteMessage(messageData: { board: string; index: number }): Promise<void> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/messages/delete`, {
                method: 'POST',
                headers: ApiConfig.headers,
                body: JSON.stringify(messageData),
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            await handleApiResponse(response);
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    }
};

// Convenience functions for backward compatibility
export async function fetchMessagesForBoard(boardName: string): Promise<Message[]> {
    return messageApiClient.getMessagesForBoard(boardName);
}

export async function createMessage(message: Omit<Message, 'id'>): Promise<Response> {
    await messageApiClient.createMessage(message);
    return new Response();
}

export async function updateMessage(messageData: { board: string; index: number; newText: string; editor: string; editOriginal?: boolean }): Promise<Response> {
    await messageApiClient.updateMessage(messageData);
    return new Response();
}

export async function deleteMessage(messageData: { board: string; index: number }): Promise<Response> {
    await messageApiClient.deleteMessage(messageData);
    return new Response();
}
