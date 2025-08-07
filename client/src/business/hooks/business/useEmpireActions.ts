import { useState, useCallback } from 'react';
import { Empire } from '../../../data/models/Empire';
import { EmpireDataService } from '../../../data/services/EmpireDataService';
import { EmpireCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

/**
 * Hook for empire actions following 5-layer architecture
 * Business Layer: Handles empire CRUD operations with proper error handling
 * Separates action concerns from data management and presentation
 */
/**
 * Custom hook for Empire business actions (create, update, delete)
 * Separates action concerns from data management for proper separation of concerns
 */

export function useEmpireActions(onSuccess?: () => void, onError?: (error: string) => void) {
    const entityState = useEntityState();

    const createEmpire = useCallback(async (empireDraft: Partial<Empire>) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await EmpireDataService.createEmpire({
                id: Date.now(),
                name: empireDraft.name || '',
                account: empireDraft.account || ''
            });
            
            // Invalidate cache after creation
            EmpireCache.invalidate('empires');
            
            entityState.setSuccess('Empire created successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to create empire';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const updateEmpire = useCallback(async (id: string | number, empireData: Partial<Empire>) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const result = await EmpireDataService.updateEmpire(id, empireData);
            
            // Invalidate cache after update
            EmpireCache.invalidate('empires');
            
            entityState.setSuccess('Empire updated successfully');
            onSuccess?.();
            return result;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to update empire';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    const deleteEmpire = useCallback(async (id: string | number) => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            await EmpireDataService.deleteEmpire(id);
            
            // Invalidate cache after deletion
            EmpireCache.invalidate('empires');
            
            entityState.setSuccess('Empire deleted successfully');
            onSuccess?.();
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to delete empire';
            entityState.setError(error);
            onError?.(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState, onSuccess, onError]);

    return {
        createEmpire,
        updateEmpire,
        deleteEmpire,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success
    };
}
