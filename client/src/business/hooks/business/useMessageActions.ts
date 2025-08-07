/**
 * Custom hook for Message business actions (create, update, delete)
 * Business Layer: Handles message CRUD operations with proper error handling
 * Manages message board operations with cache invalidation
 */

import { useCallback } from 'react';
import { Message } from '../../../data/models/Message';
import { MessageDataService } from '../../../data/services/MessageDataService';
import { MessageCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

export function useMessageActions(onSuccess?: () => void, onError?: (error: string) => void) {
    const entityState = useEntityState();

    const createMessage = useCallback(async (messageData: Omit<Message, 'id'>) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await MessageDataService.createMessage(messageData);
            
            // Invalidate cache for the specific board
            MessageCache.invalidate(`messages_${messageData.board}`);
            
            entityState.setSuccess('Message created successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to create message';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const updateMessage = useCallback(async (board: string, index: number, newText: string, editor: string, editOriginal?: boolean) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await MessageDataService.updateMessage({
                board,
                index,
                newText,
                editor,
                editOriginal
            });
            
            // Invalidate cache for the board
            MessageCache.invalidate(`messages_${board}`);
            
            entityState.setSuccess('Message updated successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to update message';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const deleteMessage = useCallback(async (board: string, index: number) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await MessageDataService.deleteMessage({ board, index });
            
            // Invalidate cache for the board
            MessageCache.invalidate(`messages_${board}`);
            
            entityState.setSuccess('Message deleted successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to delete message';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    return {
        createMessage,
        updateMessage,
        deleteMessage,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success
    };
}
