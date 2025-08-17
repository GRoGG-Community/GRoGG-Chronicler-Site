/**
 * Standardized Error Handling Hook for Presentation Layer
 * Provides consistent error handling patterns across all pages
 * Follows 5-layer architecture separation of concerns
 * Uses business layer for error processing to maintain proper layer boundaries
 */
import { useState, useCallback } from 'react';
import { useBusinessErrorHandling } from '../../business/hooks/application/useBusinessErrorHandling';

export interface ErrorState {
    error: string | null;
    success: string | null;
    hasError: boolean;
    hasSuccess: boolean;
}

export interface ErrorActions {
    setError: (error: string) => void;
    setSuccess: (message: string) => void;
    clearError: () => void;
    clearSuccess: () => void;
    clearAll: () => void;
    handleBusinessError: (error: unknown) => void;
}

export function useErrorHandling(): ErrorState & ErrorActions {
    const [error, setErrorState] = useState<string | null>(null);
    const [success, setSuccessState] = useState<string | null>(null);
    
    // Use business layer for error processing (proper layer separation)
    const { processError } = useBusinessErrorHandling();

    const setError = useCallback((errorMessage: string) => {
        setErrorState(errorMessage);
        setSuccessState(null); // Clear success when showing error
    }, []);

    const setSuccess = useCallback((successMessage: string) => {
        setSuccessState(successMessage);
        setErrorState(null); // Clear error when showing success
    }, []);

    const clearError = useCallback(() => {
        setErrorState(null);
    }, []);

    const clearSuccess = useCallback(() => {
        setSuccessState(null);
    }, []);

    const clearAll = useCallback(() => {
        setErrorState(null);
        setSuccessState(null);
    }, []);

    const handleBusinessError = useCallback((error: unknown) => {
        // Use business layer for proper error processing (maintains layer separation)
        const displayMessage = processError(error);
        setError(displayMessage);
    }, [setError, processError]);

    return {
        // State
        error,
        success,
        hasError: error !== null,
        hasSuccess: success !== null,
        
        // Actions
        setError,
        setSuccess,
        clearError,
        clearSuccess,
        clearAll,
        handleBusinessError
    };
}
