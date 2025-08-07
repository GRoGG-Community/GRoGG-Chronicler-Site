/**
 * Custom hook for Treaty business actions (create, update, delete)
 * Separates action concerns from data management for proper separation of concerns
 */

import { useCallback } from 'react';
import { Treaty } from '../../../data/models/Treaty';
import { TreatyDataService } from '../../../data/services/TreatyDataService';
import { TreatyCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

export function useTreatyActions(onSuccess?: () => void, onError?: (error: string) => void) {
    const entityState = useEntityState();

    const createTreaty = useCallback(async (treatyDraft: Partial<Treaty>) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await TreatyDataService.createTreaty({
                id: Date.now(),
                side1: treatyDraft.side1 || '',
                side2: treatyDraft.side2 || '',
                type: treatyDraft.type || '',
                status: treatyDraft.status || 'Proposed'
            });
            
            TreatyCache.invalidate('treaties');
            entityState.setSuccess('Treaty created successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to create treaty';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const updateTreaty = useCallback(async (id: string | number, treatyData: Partial<Treaty>) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await TreatyDataService.updateTreaty(id, treatyData);
            TreatyCache.invalidate('treaties');
            entityState.setSuccess('Treaty updated successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to update treaty';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const deleteTreaty = useCallback(async (id: string | number) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            await TreatyDataService.deleteTreaty(id);
            TreatyCache.invalidate('treaties');
            entityState.setSuccess('Treaty deleted successfully');
            onSuccess?.();
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to delete treaty';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    return {
        createTreaty,
        updateTreaty,
        deleteTreaty,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success
    };
}
