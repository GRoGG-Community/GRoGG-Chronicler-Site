/**
 * Generic Page Controller Hook
 * Consolidates common page-level state management patterns for entity pages
 * Replaces AccountPageController, EmpirePageController, TreatyPageController
 */
import { useState, useEffect } from 'react';

interface PageControllerReturn {
    // Data state
    data: any[];
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    success: string;
    setSuccess: React.Dispatch<React.SetStateAction<string>>;
    
    // Edit state
    editItem: any;
    setEditItem: React.Dispatch<React.SetStateAction<any>>;
    editItemName: string;
    setEditItemName: React.Dispatch<React.SetStateAction<string>>;
    editItemPass: string;
    setEditItemPass: React.Dispatch<React.SetStateAction<string>>;
    editItemLoading: boolean;
    setEditItemLoading: React.Dispatch<React.SetStateAction<boolean>>;
    editItemError: string;
    setEditItemError: React.Dispatch<React.SetStateAction<string>>;
    
    // New item state
    newItemName: string;
    setNewItemName: React.Dispatch<React.SetStateAction<string>>;
    newItemPass: string;
    setNewItemPass: React.Dispatch<React.SetStateAction<string>>;
    newItemLoading: boolean;
    setNewItemLoading: React.Dispatch<React.SetStateAction<boolean>>;
    newItemError: string;
    setNewItemError: React.Dispatch<React.SetStateAction<string>>;
    
    // Utilities
    refreshData: () => Promise<void>;
    clearMessages: () => void;
}

export function usePageController(fetchFunction: (() => Promise<any[]>) | null, entityName: string = 'items'): PageControllerReturn {
    // Core state
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    
    // Edit state (common pattern across all controllers)
    const [editItem, setEditItem] = useState<any>(null);
    const [editItemName, setEditItemName] = useState<string>('');
    const [editItemPass, setEditItemPass] = useState<string>('');
    const [editItemLoading, setEditItemLoading] = useState<boolean>(false);
    const [editItemError, setEditItemError] = useState<string>('');
    
    // New item state (common pattern)
    const [newItemName, setNewItemName] = useState<string>('');
    const [newItemPass, setNewItemPass] = useState<string>('');
    const [newItemLoading, setNewItemLoading] = useState<boolean>(false);
    const [newItemError, setNewItemError] = useState<string>('');

    // Fetch data on mount
    useEffect(() => {
        if (fetchFunction) {
            setLoading(true);
            fetchFunction()
                .then(result => {
                    setData(result);
                    setError('');
                })
                .catch((err: Error) => {
                    setData([]);
                    setError(`Failed to load ${entityName}: ${err.message}`);
                })
                .finally(() => setLoading(false));
        }
    }, [fetchFunction, entityName]);

    // Common utility functions
    const refreshData = async (): Promise<void> => {
        if (fetchFunction) {
            try {
                const result = await fetchFunction();
                setData(result);
                setError('');
            } catch (err: any) {
                setError(`Failed to refresh ${entityName}: ${err.message}`);
            }
        }
    };

    const clearMessages = (): void => {
        setError('');
        setSuccess('');
        setEditItemError('');
        setNewItemError('');
    };

    return {
        // Data state
        data,
        setData,
        loading,
        setLoading,
        error,
        setError,
        success,
        setSuccess,
        
        // Edit state
        editItem,
        setEditItem,
        editItemName,
        setEditItemName,
        editItemPass,
        setEditItemPass,
        editItemLoading,
        setEditItemLoading,
        editItemError,
        setEditItemError,
        
        // New item state
        newItemName,
        setNewItemName,
        newItemPass,
        setNewItemPass,
        newItemLoading,
        setNewItemLoading,
        newItemError,
        setNewItemError,
        
        // Utilities
        refreshData,
        clearMessages
    };
}
