/**
 * Business Layer Error Handling Hook
 * Provides error processing services to presentation layer
 * Maintains proper layer separation by keeping infrastructure dependencies in business layer
 */
import { useCallback } from 'react';
import { businessErrorService } from '../../services/BusinessErrorService';

export interface BusinessErrorHandling {
    processError: (error: unknown) => string;
    createSuccessMessage: (operation: string) => string;
}

export function useBusinessErrorHandling(): BusinessErrorHandling {
    const processError = useCallback((error: unknown) => {
        return businessErrorService.processError(error);
    }, []);

    const createSuccessMessage = useCallback((operation: string) => {
        return businessErrorService.createSuccessMessage(operation);
    }, []);

    return {
        processError,
        createSuccessMessage
    };
}
