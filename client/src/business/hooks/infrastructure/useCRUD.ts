import { useState, useCallback } from 'react';
import { useEntityState } from './useEntityState';

export interface CRUDOperations<T> {
  create: (data: Partial<T>) => Promise<void>;
  read: () => Promise<T[]>;
  update: (id: string | number, data: Partial<T>) => Promise<void>;
  delete: (id: string | number) => Promise<void>;
}

export interface UseCRUDOptions<T> {
  apiClient: CRUDOperations<T>;
  onSuccess?: (operation: string, data?: T | T[]) => void;
  onError?: (operation: string, error: Error) => void;
}

export interface UseCRUDReturn<T> {
  data: T[];
  error: string;
  success: string;
  loading: boolean;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  reset: () => void;
  createEntity: (entityData: Partial<T>) => Promise<void>;
  fetchEntities: () => Promise<void>;
  updateEntity: (id: string | number, entityData: Partial<T>) => Promise<void>;
  deleteEntity: (id: string | number) => Promise<void>;
  refreshData: () => Promise<void>;
}

/**
 * Custom hook for CRUD operations that eliminates duplicate fetch patterns
 * Found in 10+ components with fetchAccountsRaw, fetchEmpires, etc.
 */
export function useCRUD<T>({ apiClient, onSuccess, onError }: UseCRUDOptions<T>): UseCRUDReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const entityState = useEntityState();

  const handleOperation = useCallback(async (
    operation: () => Promise<any>,
    operationName: string,
    successMessage?: string
  ) => {
    try {
      entityState.setLoading(true);
      entityState.clearMessages();
      
      const result = await operation();
      
      if (successMessage) {
        entityState.setSuccess(successMessage);
      }
      
      onSuccess?.(operationName, result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      entityState.setError(errorMessage);
      onError?.(operationName, error as Error);
      throw error;
    } finally {
      entityState.setLoading(false);
    }
  }, [entityState, onSuccess, onError]);

  const createEntity = useCallback(async (entityData: Partial<T>) => {
    await handleOperation(
      () => apiClient.create(entityData),
      'create',
      'Entity created successfully'
    );
  }, [apiClient, handleOperation]);

  const fetchEntities = useCallback(async () => {
    const result = await handleOperation(
      () => apiClient.read(),
      'read'
    );
    setData(result);
  }, [apiClient, handleOperation]);

  const updateEntity = useCallback(async (id: string | number, entityData: Partial<T>) => {
    await handleOperation(
      () => apiClient.update(id, entityData),
      'update',
      'Entity updated successfully'
    );
  }, [apiClient, handleOperation]);

  const deleteEntity = useCallback(async (id: string | number) => {
    await handleOperation(
      () => apiClient.delete(id),
      'delete',
      'Entity deleted successfully'
    );
  }, [apiClient, handleOperation]);

  const refreshData = useCallback(async () => {
    await fetchEntities();
  }, [fetchEntities]);

  return {
    data,
    ...entityState,
    createEntity,
    fetchEntities,
    updateEntity,
    deleteEntity,
    refreshData
  };
}
