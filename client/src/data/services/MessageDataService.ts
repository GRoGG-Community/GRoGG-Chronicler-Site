/**
 * MessageDataService
 * Data layer service for message HTTP operations and data persistence.
 * Handles all API communication for message entities.
 */

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

export class MessageDataService {
    /**
     * Fetch messages for a specific board
     */
    static async getMessagesForBoard(boardName: string): Promise<Message[]> {
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
    }

    /**
     * Create a new message
     */
    static async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
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
    }

    /**
     * Update an existing message
     */
    static async updateMessage(messageData: { board: string; index: number; newText: string; editor: string; editOriginal?: boolean }): Promise<void> {
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
    }

    /**
     * Delete a message
     */
    static async deleteMessage(messageData: { board: string; index: number }): Promise<void> {
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
}
