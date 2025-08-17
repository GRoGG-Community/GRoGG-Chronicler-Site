/**
 * Custom hook for Treaty Page functionality
 * Wraps business layer logic for presentation layer
 * Follows 5-layer architecture separation of concerns
 * Enhanced with standardized error handling and loading patterns
 */
import { useState, useCallback } from 'react';
import { useTreatyData } from '../../business/hooks/data/useTreatyData';
import { useTreatyActions } from '../../business/hooks/business/useTreatyActions';
import { useErrorHandling } from './useErrorHandling';
import { useLoadingState } from './useLoadingState';
import { Treaty } from '../../data/models/Treaty';

export function useTreatyPage() {
    const [selectedTreaty, setSelectedTreaty] = useState<Treaty | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit'>('list');
    
    // Standardized error and loading handling
    const errorHandling = useErrorHandling();
    const loadingState = useLoadingState();

    // Use hooks instead of direct controller access
    const treatyData = useTreatyData();
    const treatyActions = useTreatyActions(
        () => {
            // Success callback
            errorHandling.setSuccess('Treaty operation completed successfully');
            treatyData.refreshTreaties();
            setViewMode('list');
            setSelectedTreaty(null);
        },
        (error) => {
            // Error callback - use standardized error handling
            errorHandling.handleBusinessError(error);
        }
    );

    const handleTreatySelect = useCallback((treaty: Treaty) => {
        setSelectedTreaty(treaty);
        setViewMode('view');
        errorHandling.clearAll(); // Clear messages when switching views
    }, [errorHandling]);

    const handleEditTreaty = useCallback((treaty: Treaty) => {
        setSelectedTreaty(treaty);
        setViewMode('edit');
        errorHandling.clearAll();
    }, [errorHandling]);

    const handleBackToList = useCallback(() => {
        setViewMode('list');
        setSelectedTreaty(null);
        errorHandling.clearAll();
    }, [errorHandling]);

    const handleSaveTreaty = useCallback(async (treatyData: Partial<Treaty>) => {
        return loadingState.withLoading(async () => {
            try {
                if (selectedTreaty) {
                    await treatyActions.updateTreaty(selectedTreaty.id, treatyData);
                    errorHandling.setSuccess('Treaty updated successfully');
                } else {
                    await treatyActions.createTreaty(treatyData);
                    errorHandling.setSuccess('Treaty created successfully');
                }
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'saveTreaty');
    }, [selectedTreaty, treatyActions, errorHandling, loadingState]);

    const deleteTreatyWithHandling = useCallback(async (id: number) => {
        return loadingState.withLoading(async () => {
            try {
                await treatyActions.deleteTreaty(id);
                errorHandling.setSuccess('Treaty deleted successfully');
                setSelectedTreaty(null);
                setViewMode('list');
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'deleteTreaty');
    }, [treatyActions, errorHandling, loadingState]);

    return {
        // View management
        viewMode,
        selectedTreaty,
        handleTreatySelect,
        handleEditTreaty,
        handleBackToList,
        
        // Enhanced data and state management
        treaties: treatyData.treaties,
        loading: treatyData.loading || treatyActions.loading || loadingState.isLoading,
        error: errorHandling.error || treatyData.error || treatyActions.error,
        success: errorHandling.success || treatyActions.success,
        
        // Enhanced actions with proper error/loading handling
        handleSaveTreaty,
        deleteTreaty: deleteTreatyWithHandling,
        refreshTreaties: treatyData.refreshTreaties,
        
        // Direct access to error handling for components
        clearError: errorHandling.clearError,
        clearSuccess: errorHandling.clearSuccess,
        clearAllMessages: errorHandling.clearAll
    };
}
