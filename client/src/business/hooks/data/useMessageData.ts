/**
 * Custom hook for Message data management
 * Data Layer: Handles message fetching, filtering, and state management
 * Manages board-specific message data with caching
 */

import { useState, useEffect, useCallback } from 'react';
import { Message } from '../../../data/models/Message';
import { MessageDataService } from '../../../data/services/MessageDataService';
import { MessageCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

export function useMessageData(boardName?: string, autoFetch: boolean = true) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [lastFetch, setLastFetch] = useState<Date | null>(null);
    const entityState = useEntityState();

    const fetchMessages = useCallback(async (board?: string) => {
        const targetBoard = board || boardName;
        if (!targetBoard) return [];

        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            // Try cache first
            const cacheKey = `messages_${targetBoard}`;
            const cached = MessageCache.get(cacheKey);
            if (cached) {
                setMessages(cached);
                setLastFetch(new Date());
                entityState.setLoading(false);
                return cached;
            }
            
            const data = await MessageDataService.getMessagesForBoard(targetBoard);
            setMessages(data);
            setLastFetch(new Date());
            
            // Cache the results
            MessageCache.set(cacheKey, data);
            
            return data;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to fetch messages';
            entityState.setError(error);
            setMessages([]);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [boardName, entityState]);

    const getMessagesByBoard = useCallback((board: string): Message[] => {
        return messages.filter(message => message.board === board);
    }, [messages]);

    const getMessageById = useCallback((id: string | number): Message | undefined => {
        return messages.find(message => message.id === id);
    }, [messages]);

    const searchMessages = useCallback((searchTerm: string, board?: string): Message[] => {
        const term = searchTerm.toLowerCase().trim();
        let filteredMessages = board ? getMessagesByBoard(board) : messages;
        
        if (!term) return filteredMessages;
        
        return filteredMessages.filter(message => 
            message.text?.toLowerCase().includes(term) ||
            message.author?.toLowerCase().includes(term)
        );
    }, [messages, getMessagesByBoard]);

    const refreshMessages = useCallback(async (board?: string) => {
        const targetBoard = board || boardName;
        if (targetBoard) {
            MessageCache.invalidate(`messages_${targetBoard}`);
        }
        return fetchMessages(board);
    }, [fetchMessages, boardName]);

    useEffect(() => {
        if (autoFetch && boardName) {
            fetchMessages();
        }
    }, [autoFetch, boardName, fetchMessages]);

    return {
        messages,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success,
        lastFetch,
        fetchMessages,
        refreshMessages,
        getMessagesByBoard,
        getMessageById,
        searchMessages
    };
}
