/**
 * Custom hook for Account data management
 * Data Layer: Handles account fetching, caching, and state management
 * Separates account data concerns from business logic and presentation
 */

import { useState, useEffect, useCallback } from 'react';
import Account from '../../../data/models/Account';
import { AccountDataService } from '../../../data/services/AccountDataService';
import { AccountCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

export function useAccountData(autoFetch: boolean = true) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountsMap, setAccountsMap] = useState<Record<string, string>>({});
    const [lastFetch, setLastFetch] = useState<Date | null>(null);
    const entityState = useEntityState();

    const fetchAccounts = useCallback(async () => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            // Try cache first
            const cached = AccountCache.get('accounts');
            if (cached) {
                setAccounts(cached);
                setLastFetch(new Date());
                entityState.setLoading(false);
                return cached;
            }
            
            const [accountsData, accountsMapData] = await Promise.all([
                AccountDataService.fetchAccountsRaw(),
                AccountDataService.fetchAccounts()
            ]);
            
            setAccounts(accountsData);
            setAccountsMap(accountsMapData);
            setLastFetch(new Date());
            
            // Cache the results (only cache the accounts array)
            AccountCache.set('accounts', accountsData);
            
            return accountsData;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to fetch accounts';
            entityState.setError(error);
            setAccounts([]);
            setAccountsMap({});
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState]);

    const getAccountByName = useCallback((name: string): Account | undefined => {
        return accounts.find(account => account.name.toLowerCase() === name.toLowerCase());
    }, [accounts]);

    const getAccountById = useCallback((id: string | number): Account | undefined => {
        return accounts.find(account => account.id === id);
    }, [accounts]);

    const validateAccount = useCallback((name: string, password: string): boolean => {
        return accountsMap[name] === password;
    }, [accountsMap]);

    const searchAccounts = useCallback((searchTerm: string): Account[] => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return accounts;
        
        return accounts.filter(account => 
            account.name.toLowerCase().includes(term)
        );
    }, [accounts]);

    const refreshAccounts = useCallback(async () => {
        AccountCache.invalidate('accounts');
        return fetchAccounts();
    }, [fetchAccounts]);

    useEffect(() => {
        if (autoFetch) {
            fetchAccounts();
        }
    }, [autoFetch, fetchAccounts]);

    return {
        accounts,
        accountsMap,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success,
        lastFetch,
        fetchAccounts,
        refreshAccounts,
        getAccountByName,
        getAccountById,
        validateAccount,
        searchAccounts
    };
}
