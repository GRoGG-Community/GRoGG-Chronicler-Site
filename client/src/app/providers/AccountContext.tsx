import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Account from '../../data/models/Account';
import { StorageService } from '../../infrastructure/storage/StorageService';

interface AccountContextType {
    account: Account | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    error: string;
    accountsLoaded: boolean;
}

interface AccountProviderProps {
    children: ReactNode;
}

/**
 * AccountContext
 * Provides global authentication/session state and actions for the app.
 */
const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: AccountProviderProps) {
    // Holds the current authenticated account (null if not logged in)
    const [account, setAccount] = useState<Account | null>(() => {
        const saved = StorageService.getItem<Account | null>('stellarisAccount', null);
        return saved;
    });
    const [accountsLoaded, setAccountsLoaded] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<Record<string, string>>({});
    const [error, setError] = useState<string>('');

    // Load all accounts (for login validation)
    useEffect(() => {
        fetch('/api/accounts?ts=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setAccounts(data.accounts || {});
                setAccountsLoaded(true);
            })
            .catch(() => setAccountsLoaded(true));
    }, []);

    // Login function (Command pattern: encapsulates login action)
    const login = useCallback((username: string, password: string): boolean => {
        if (!accountsLoaded) {
            setError('Accounts are still loading, please wait...');
            return false;
        }
        if (!accounts[username] || accounts[username] !== password) {
            setError('Invalid credentials');
            return false;
        }
        // Create a proper Account object
        const accountObj: Account = { id: 0, name: username, password };
        setAccount(accountObj);
        StorageService.setItem('stellarisAccount', accountObj);
        setError('');
        return true;
    }, [accounts, accountsLoaded]);

    // Logout function
    const logout = useCallback(() => {
        setAccount(null);
        StorageService.removeItem('stellarisAccount');
    }, []);

    return (
        <AccountContext.Provider value={{ account, login, logout, error, accountsLoaded }}>
            {children}
        </AccountContext.Provider>
    );
}

// Custom hook for consuming account context (Factory pattern)
export function useAccount() {
    const ctx = useContext(AccountContext);
    if (!ctx) throw new Error('useAccount must be used within an AccountProvider');
    return ctx;
}
