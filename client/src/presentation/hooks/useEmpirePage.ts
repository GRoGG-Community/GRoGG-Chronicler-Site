/**
 * Custom hook for Empire Page functionality
 * Wraps business layer logic for presentation layer
 * Follows 5-layer architecture separation of concerns
 * Enhanced with standardized error handling and loading patterns
 */
import { useState, useCallback } from 'react';
import { useEmpireData } from '../../business/hooks/data/useEmpireData';
import { useEmpireInfo } from '../../business/hooks/data/useEmpireInfo';
import { useEmpireActions } from '../../business/hooks/business/useEmpireActions';
import { useErrorHandling } from './useErrorHandling';
import { useLoadingState } from './useLoadingState';
import { Empire, EmpireInfo } from '../../data/models/Empire';

export function useEmpirePage() {
    const [selectedEmpire, setSelectedEmpire] = useState<Empire | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'view' | 'edit' | 'manage'>('list');
    
    // Standardized error and loading handling
    const errorHandling = useErrorHandling();
    const loadingState = useLoadingState();

    // Use hooks instead of direct controller access
    const empireData = useEmpireData();
    const empireInfo = useEmpireInfo();
    const empireActions = useEmpireActions(
        () => {
            // Success callback
            errorHandling.setSuccess('Empire operation completed successfully');
            empireData.refreshEmpires();
            setViewMode('list');
        },
        (error) => {
            // Error callback - use standardized error handling
            errorHandling.handleBusinessError(error);
        }
    );

    const handleEmpireSelect = useCallback((empire: Empire) => {
        setSelectedEmpire(empire);
        setViewMode('view');
        errorHandling.clearAll(); // Clear messages when switching views
    }, [errorHandling]);

    const handleEditEmpire = useCallback((empire: Empire) => {
        setSelectedEmpire(empire);
        setViewMode('edit');
        errorHandling.clearAll();
    }, [errorHandling]);

    const handleManageEmpires = useCallback(() => {
        setViewMode('manage');
        setSelectedEmpire(null);
        errorHandling.clearAll();
    }, [errorHandling]);

    const handleBackToList = useCallback(() => {
        setViewMode('list');
        setSelectedEmpire(null);
        errorHandling.clearAll();
    }, [errorHandling]);

    const handleSaveEmpire = useCallback(async (empireData: Partial<Empire>) => {
        return loadingState.withLoading(async () => {
            try {
                if (selectedEmpire) {
                    await empireActions.updateEmpire(selectedEmpire.id, empireData);
                    errorHandling.setSuccess('Empire updated successfully');
                } else {
                    await empireActions.createEmpire(empireData);
                    errorHandling.setSuccess('Empire created successfully');
                }
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'saveEmpire');
    }, [selectedEmpire, empireActions, errorHandling, loadingState]);

    const deleteEmpireWithHandling = useCallback(async (id: number) => {
        return loadingState.withLoading(async () => {
            try {
                await empireActions.deleteEmpire(id);
                errorHandling.setSuccess('Empire deleted successfully');
                setSelectedEmpire(null);
                setViewMode('list');
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'deleteEmpire');
    }, [empireActions, errorHandling, loadingState]);

    return {
        // View management
        viewMode,
        selectedEmpire,
        handleEmpireSelect,
        handleEditEmpire,
        handleManageEmpires,
        handleBackToList,
        
        // Enhanced data and state management
        empires: empireData.empires,
        empireInfoData: empireInfo.empireInfo,
        loading: empireData.loading || empireInfo.loading || empireActions.loading || loadingState.isLoading,
        error: errorHandling.error || empireData.error || empireInfo.error || empireActions.error,
        success: errorHandling.success || empireActions.success,
        
        // Enhanced actions with proper error/loading handling
        handleSaveEmpire,
        deleteEmpire: deleteEmpireWithHandling,
        refreshEmpires: empireData.refreshEmpires,
        
        // Search and filtering
        searchEmpires: empireData.searchEmpires,
        getEmpireById: empireData.getEmpireById,
        getEmpireByName: empireData.getEmpireByName,
        
        // Direct access to error handling for components
        clearError: errorHandling.clearError,
        clearSuccess: errorHandling.clearSuccess,
        clearAllMessages: errorHandling.clearAll
    };
}
