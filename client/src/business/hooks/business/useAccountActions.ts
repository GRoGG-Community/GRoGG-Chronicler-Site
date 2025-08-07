/**
 * Custom hook for Account business actions (create, update, delete)
 * Business Layer: Handles account CRUD operations with proper error handling
 * Separates action concerns from data management for proper separation of concerns
 */

import { useCallback } from 'react';
import Account from '../../../data/models/Account';
import { AccountDataService } from '../../../data/services/AccountDataService';
import { AccountCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

export function useAccountActions(onSuccess?: () => void, onError?: (error: string) => void) {
    const entityState = useEntityState();

    const createAccount = useCallback(async (name: string, password: string) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await AccountDataService.createAccount(name, password);
            
            AccountCache.invalidate('accounts');
            entityState.setSuccess('Account created successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to create account';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const updateAccount = useCallback(async (id: Account['id'], name: string, password: string) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await AccountDataService.editAccount(id, name, password);
            
            AccountCache.invalidate('accounts');
            entityState.setSuccess('Account updated successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to update account';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const deleteAccount = useCallback(async (name: string) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            await AccountDataService.deleteAccount(name);
            
            AccountCache.invalidate('accounts');
            entityState.setSuccess('Account deleted successfully');
            onSuccess?.();
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to delete account';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    return {
        createAccount,
        updateAccount,
        deleteAccount,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success
    };
}
