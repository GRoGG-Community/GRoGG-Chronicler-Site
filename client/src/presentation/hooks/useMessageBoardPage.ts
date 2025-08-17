/**
 * Custom hook for Message Board Page functionality
 * Wraps business layer logic for presentation layer
 * Follows 5-layer architecture separation of concerns
 * Enhanced with standardized error handling and loading patterns
 */
import { useCallback } from 'react';
import { useErrorHandling } from './useErrorHandling';
import { useLoadingState } from './useLoadingState';
import useAccount from '../../business/hooks/application/useAccount';
import { useEmpirePage } from './useEmpirePage';

export function useMessageBoardPage() {
    // Standardized error and loading handling
    const errorHandling = useErrorHandling();
    const loadingState = useLoadingState();
    
    // Use existing hooks for data
    const { account } = useAccount();
    const { empires, loading: empiresLoading } = useEmpirePage();

    // Enhanced message posting with error handling
    const postMessageWithHandling = useCallback(async (messageData: any, originalPostMessage: Function) => {
        return loadingState.withLoading(async () => {
            try {
                await originalPostMessage(messageData);
                errorHandling.setSuccess('Message posted successfully');
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'postMessage');
    }, [errorHandling, loadingState]);

    // Enhanced message deletion with error handling
    const deleteMessageWithHandling = useCallback(async (messageId: any, originalDeleteMessage: Function) => {
        return loadingState.withLoading(async () => {
            try {
                await originalDeleteMessage(messageId);
                errorHandling.setSuccess('Message deleted successfully');
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'deleteMessage');
    }, [errorHandling, loadingState]);

    // Enhanced message editing with error handling
    const editMessageWithHandling = useCallback(async (messageData: any, originalEditMessage: Function) => {
        return loadingState.withLoading(async () => {
            try {
                await originalEditMessage(messageData);
                errorHandling.setSuccess('Message updated successfully');
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'editMessage');
    }, [errorHandling, loadingState]);

    return {
        // Account and empire data
        account,
        empires,
        
        // Loading states
        loading: empiresLoading || loadingState.isLoading,
        
        // Error and success handling
        error: errorHandling.error,
        success: errorHandling.success,
        clearError: errorHandling.clearError,
        clearSuccess: errorHandling.clearSuccess,
        clearAllMessages: errorHandling.clearAll,
        
        // Enhanced message operations
        postMessageWithHandling,
        deleteMessageWithHandling,
        editMessageWithHandling
    };
}
