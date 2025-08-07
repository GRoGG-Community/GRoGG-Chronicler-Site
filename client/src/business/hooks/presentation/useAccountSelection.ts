/**
 * Custom hook for managing account selection state
 * Consolidates duplicate selectedAccounts logic found across empire components
 * Used by EmpireList, EmpireManagementList, and similar components
 */
import { useState } from 'react';

export function useAccountSelection() {
    const [selectedAccounts, setSelectedAccounts] = useState<Record<string, string>>({});

    const handleLinkAccount = (empireId: string, onLink: (empireId: string, accountId: string) => void) => {
        const selectedAccountId = selectedAccounts[empireId];
        if (selectedAccountId) {
            onLink(empireId, selectedAccountId);
            setSelectedAccounts(prev => ({
                ...prev,
                [empireId]: ''
            }));
        }
    };

    const handleAccountSelection = (empireId: string, accountId: string) => {
        setSelectedAccounts(prev => ({
            ...prev,
            [empireId]: accountId
        }));
    };

    const getSelectedAccount = (empireId: string) => selectedAccounts[empireId] || '';

    const clearSelection = (empireId: string) => {
        setSelectedAccounts(prev => ({
            ...prev,
            [empireId]: ''
        }));
    };

    return {
        selectedAccounts,
        setSelectedAccounts,
        handleLinkAccount,
        handleAccountSelection,
        getSelectedAccount,
        clearSelection
    };
}
