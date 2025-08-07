/**
 * Custom hook for search/filter functionality
 * Consolidates duplicate search filter logic found across empire components
 */
import React from 'react';
import { useMemo } from 'react';

export function useSearchFilter<T>(
    items: T[], 
    searchTerm: string, 
    getSearchableText: (item: T) => string
) {
    return useMemo(() => {
        const trimmedSearch = searchTerm.trim();
        if (!trimmedSearch) return items;
        
        const lowerSearch = trimmedSearch.toLowerCase();
        return items.filter(item => 
            getSearchableText(item).toLowerCase().includes(lowerSearch)
        );
    }, [items, searchTerm, getSearchableText]);
}

/**
 * Utility for confirming delete operations
 * Consolidates repetitive confirmation patterns through infrastructure service
 */
export function useConfirmDelete() {
    // Import moved inside function to avoid circular dependencies
    const { ConfirmationService } = require('../../../infrastructure/services/ConfirmationService');
    
    const confirmDelete = (itemType: string, itemName: string): boolean => {
        return ConfirmationService.confirmDelete(itemType, itemName);
    };

    const confirmAction = (message: string): boolean => {
        return ConfirmationService.confirm(message);
    };

    return { confirmDelete, confirmAction };
}

/**
 * Utility for handling form state changes
 * Consolidates repetitive form input handlers
 */
export function useFormHelpers<T extends Record<string, any>>() {
    const createChangeHandler = (setFormData: React.Dispatch<React.SetStateAction<T>>) => {
        return (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            setFormData((prev: T) => ({
                ...prev,
                [field]: e.target.value
            }));
        };
    };

    const resetForm = (setFormData: React.Dispatch<React.SetStateAction<T>>, initialState: T) => {
        setFormData(initialState);
    };

    return { createChangeHandler, resetForm };
}
