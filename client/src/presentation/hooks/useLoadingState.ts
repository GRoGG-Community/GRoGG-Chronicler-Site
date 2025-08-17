/**
 * Standardized Loading State Management Hook
 * Provides consistent loading patterns across all presentation components
 * Handles multiple concurrent operations and loading states
 */
import { useState, useCallback, useRef } from 'react';

export interface LoadingState {
    isLoading: boolean;
    loadingOperations: Set<string>;
    hasActiveOperations: boolean;
}

export interface LoadingActions {
    startLoading: (operationId?: string) => void;
    stopLoading: (operationId?: string) => void;
    setLoading: (loading: boolean, operationId?: string) => void;
    withLoading: <T>(operation: () => Promise<T>, operationId?: string) => Promise<T>;
    clearAllLoading: () => void;
}

const DEFAULT_OPERATION_ID = 'default';

export function useLoadingState(): LoadingState & LoadingActions {
    const [loadingOperations, setLoadingOperations] = useState<Set<string>>(new Set());
    const operationsRef = useRef<Set<string>>(new Set());

    const startLoading = useCallback((operationId: string = DEFAULT_OPERATION_ID) => {
        setLoadingOperations(prev => {
            const newSet = new Set(prev);
            newSet.add(operationId);
            operationsRef.current = newSet;
            return newSet;
        });
    }, []);

    const stopLoading = useCallback((operationId: string = DEFAULT_OPERATION_ID) => {
        setLoadingOperations(prev => {
            const newSet = new Set(prev);
            newSet.delete(operationId);
            operationsRef.current = newSet;
            return newSet;
        });
    }, []);

    const setLoading = useCallback((loading: boolean, operationId: string = DEFAULT_OPERATION_ID) => {
        if (loading) {
            startLoading(operationId);
        } else {
            stopLoading(operationId);
        }
    }, [startLoading, stopLoading]);

    const withLoading = useCallback(async <T>(
        operation: () => Promise<T>, 
        operationId: string = DEFAULT_OPERATION_ID
    ): Promise<T> => {
        startLoading(operationId);
        try {
            const result = await operation();
            return result;
        } finally {
            stopLoading(operationId);
        }
    }, [startLoading, stopLoading]);

    const clearAllLoading = useCallback(() => {
        setLoadingOperations(new Set());
        operationsRef.current = new Set();
    }, []);

    const isLoading = loadingOperations.size > 0;
    const hasActiveOperations = loadingOperations.size > 0;

    return {
        // State
        isLoading,
        loadingOperations,
        hasActiveOperations,
        
        // Actions
        startLoading,
        stopLoading,
        setLoading,
        withLoading,
        clearAllLoading
    };
}

/**
 * Hook for managing loading state of specific operations
 * Useful when you need to track multiple concurrent operations separately
 */
export function useOperationLoading() {
    const [operations, setOperations] = useState<Record<string, boolean>>({});

    const setOperationLoading = useCallback((operationId: string, loading: boolean) => {
        setOperations(prev => ({
            ...prev,
            [operationId]: loading
        }));
    }, []);

    const isOperationLoading = useCallback((operationId: string): boolean => {
        return operations[operationId] || false;
    }, [operations]);

    const withOperationLoading = useCallback(async <T>(
        operationId: string,
        operation: () => Promise<T>
    ): Promise<T> => {
        setOperationLoading(operationId, true);
        try {
            const result = await operation();
            return result;
        } finally {
            setOperationLoading(operationId, false);
        }
    }, [setOperationLoading]);

    const clearOperationLoading = useCallback((operationId: string) => {
        setOperations(prev => {
            const newOps = { ...prev };
            delete newOps[operationId];
            return newOps;
        });
    }, []);

    const clearAllOperations = useCallback(() => {
        setOperations({});
    }, []);

    const hasAnyLoading = Object.values(operations).some(loading => loading);

    return {
        operations,
        setOperationLoading,
        isOperationLoading,
        withOperationLoading,
        clearOperationLoading,
        clearAllOperations,
        hasAnyLoading
    };
}
