/**
 * Custom hook for Account Page functionality
 * Wraps business controller logic for presentation layer
 * Follows 5-layer architecture separation of concerns
 * Enhanced with standardized error handling and loading patterns
 */
import { useState, useCallback } from 'react';
import { useAccountData } from '../../business/hooks/data/useAccountData';
import { useAccountActions } from '../../business/hooks/business/useAccountActions';
import { useBusinessErrorHandling } from '../../business/hooks/application/useBusinessErrorHandling';
import { useErrorHandling } from './useErrorHandling';
import { useLoadingState } from './useLoadingState';
import Account from '../../data/models/Account';

export function useAccountPage() {
    const [selectedTab, setSelectedTab] = useState<'info' | 'management'>('info');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    
    // Standardized error and loading handling
    const errorHandling = useErrorHandling();
    const loadingState = useLoadingState();
    const { createSuccessMessage } = useBusinessErrorHandling();

    // Use data layer hooks instead of direct controller access
    const accountData = useAccountData();
    const accountActions = useAccountActions(
        () => {
            // Success callback
            errorHandling.setSuccess('Operation completed successfully');
            accountData.refreshAccounts();
        },
        (error) => {
            // Error callback - use standardized error handling
            errorHandling.handleBusinessError(error);
        }
    );

    const handleTabChange = useCallback((tab: 'info' | 'management') => {
        setSelectedTab(tab);
        setSelectedAccount(null); // Reset selection when changing tabs
        errorHandling.clearAll(); // Clear messages when switching tabs
    }, [errorHandling]);

    const handleAccountSelect = useCallback((account: Account) => {
        setSelectedAccount(account);
        errorHandling.clearAll();
    }, [errorHandling]);

    // Enhanced actions with loading and error handling
    const createAccountWithHandling = useCallback(async (name: string, password: string) => {
        return loadingState.withLoading(async () => {
            try {
                await accountActions.createAccount(name, password);
                errorHandling.setSuccess(createSuccessMessage('createAccount'));
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'createAccount');
    }, [accountActions, errorHandling, loadingState, createSuccessMessage]);

    const updateAccountWithHandling = useCallback(async (id: number, name: string, password: string) => {
        return loadingState.withLoading(async () => {
            try {
                await accountActions.updateAccount(id, name, password);
                errorHandling.setSuccess(createSuccessMessage('updateAccount'));
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'updateAccount');
    }, [accountActions, errorHandling, loadingState, createSuccessMessage]);

    const deleteAccountWithHandling = useCallback(async (name: string) => {
        return loadingState.withLoading(async () => {
            try {
                await accountActions.deleteAccount(name);
                errorHandling.setSuccess(createSuccessMessage('deleteAccount'));
                setSelectedAccount(null); // Clear selection after delete
            } catch (error) {
                errorHandling.handleBusinessError(error);
                throw error;
            }
        }, 'deleteAccount');
    }, [accountActions, errorHandling, loadingState, createSuccessMessage]);

    return {
        // Tab management
        selectedTab,
        handleTabChange,
        
        // Account selection
        selectedAccount,
        handleAccountSelect,
        
        // Enhanced data and state management
        accounts: accountData.accounts,
        loading: accountData.loading || accountActions.loading || loadingState.isLoading,
        error: errorHandling.error || accountData.error || accountActions.error,
        success: errorHandling.success || accountActions.success,
        
        // Enhanced actions with proper error/loading handling
        createAccount: createAccountWithHandling,
        updateAccount: updateAccountWithHandling,
        deleteAccount: deleteAccountWithHandling,
        refreshAccounts: accountData.refreshAccounts,
        
        // Direct access to error handling for components
        clearError: errorHandling.clearError,
        clearSuccess: errorHandling.clearSuccess,
        clearAllMessages: errorHandling.clearAll
    };
}
