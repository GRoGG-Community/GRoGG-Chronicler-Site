/**
 * MessageBusinessService
 * Business layer service for message operations.
 * Handles business logic, validation, and orchestration.
 * Delegates data operations to MessageDataService.
 */

import { Message } from '../../data/models/Message';
import { MessageDataService } from '../../data/services/MessageDataService';
import { MessageCache } from '../../data/cache/EntityCacheManager';
import { AppError, ErrorCode } from '../../infrastructure/errors/AppError';

export class MessageBusinessService {
    /**
     * Business validation: Validate message content
     */
    static validateMessage(message: Omit<Message, 'id'>): string | null {
        if (!message.text?.trim()) {
            return 'Message text is required';
        }
        if (message.text.length > 1000) {
            return 'Message text must be less than 1000 characters';
        }
        if (!message.board?.trim()) {
            return 'Board name is required';
        }
        if (!message.author?.trim()) {
            return 'Author is required';
        }
        return null;
    }

    /**
     * Business logic: Check if user can edit a message
     */
    static canEditMessage(message: Message, userAccount?: string): boolean {
        if (!message || !userAccount) return false;
        return message.author === userAccount || userAccount === 'GameMaster';
    }

    /**
     * Business logic: Check if user can delete a message
     */
    static canDeleteMessage(message: Message, userAccount?: string): boolean {
        return this.canEditMessage(message, userAccount);
    }

    /**
     * Business operation: Get messages for a specific board with caching
     */
    static async getMessagesForBoard(boardName: string): Promise<Message[]> {
        try {
            if (!boardName?.trim()) {
                throw new AppError('Board name is required', ErrorCode.VALIDATION_ERROR);
            }

            // Check cache first for quick responses
            const cached = MessageCache.get(boardName);
            if (cached) {
                return cached;
            }

            // Fetch from API via data service
            const messages = await MessageDataService.getMessagesForBoard(boardName);
            
            // Cache with short TTL for real-time updates
            MessageCache.set(boardName, messages, 30000); // 30 seconds
            
            return messages;
        } catch (error) {
            console.error('Failed to fetch messages for board:', boardName, error);
            throw error;
        }
    }

    /**
     * Business operation: Create a new message with validation and cache management
     */
    static async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
        try {
            // Business validation
            const validationError = this.validateMessage(message);
            if (validationError) {
                throw new AppError(validationError, ErrorCode.VALIDATION_ERROR);
            }

            const newMessage = await MessageDataService.createMessage(message);
            
            // Business logic: Invalidate cache for this board to force refresh
            this.invalidateBoardCache(message.board);
            
            return newMessage;
        } catch (error) {
            console.error('Failed to create message:', error);
            throw error;
        }
    }

    /**
     * Business operation: Update an existing message with validation and cache management
     */
    static async updateMessage(board: string, index: number, newText: string, editor: string, editOriginal?: boolean): Promise<void> {
        try {
            // Business validation
            if (!board?.trim()) {
                throw new AppError('Board name is required', ErrorCode.VALIDATION_ERROR);
            }
            if (index < 0) {
                throw new AppError('Invalid message index', ErrorCode.VALIDATION_ERROR);
            }
            if (!newText?.trim()) {
                throw new AppError('Message text is required', ErrorCode.VALIDATION_ERROR);
            }
            if (!editor?.trim()) {
                throw new AppError('Editor name is required', ErrorCode.VALIDATION_ERROR);
            }

            await MessageDataService.updateMessage({ board, index, newText, editor, editOriginal });
            
            // Business logic: Invalidate cache for this board
            this.invalidateBoardCache(board);
        } catch (error) {
            console.error('Failed to update message:', error);
            throw error;
        }
    }

    /**
     * Business operation: Delete a message with validation and cache management
     */
    static async deleteMessage(board: string, index: number): Promise<void> {
        try {
            // Business validation
            if (!board?.trim()) {
                throw new AppError('Board name is required', ErrorCode.VALIDATION_ERROR);
            }
            if (index < 0) {
                throw new AppError('Invalid message index', ErrorCode.VALIDATION_ERROR);
            }

            await MessageDataService.deleteMessage({ board, index });
            
            // Business logic: Invalidate cache for this board
            this.invalidateBoardCache(board);
        } catch (error) {
            console.error('Failed to delete message:', error);
            throw error;
        }
    }

    /**
     * Business operation: Invalidate cache for a specific board
     */
    static invalidateBoardCache(boardName: string): void {
        MessageCache.invalidate(boardName);
    }

    /**
     * Business operation: Clear all message caches
     */
    static clearAllCaches(): void {
        MessageCache.invalidate();
    }
}
