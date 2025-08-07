import React, { useState, useEffect } from 'react';
import { AccountDataService } from '../../data/services/AccountDataService';
import { AccountBusinessService } from '../services/AccountBusinessService';
import Account from '../../data/models/Account';
import type { Empire } from '../../data/models/Empire';

/**
 * AccountDataController (Business Layer)
 * Manages account data loading for components that need account information.
 * Provides a bridge between business layer data access and presentation components.
 */

interface AccountDataControllerProps {
    children: (data: { 
        accounts: Account[]; 
        loading: boolean;
        getLinkedEmpires: (accountName: string, empires: Empire[]) => Empire[];
    }) => React.ReactNode;
}

export default function AccountDataController({ children }: AccountDataControllerProps) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const accountsData = await AccountDataService.fetchAccountsRaw();
                setAccounts(accountsData);
            } catch (error) {
                console.error('Failed to load accounts:', error);
                setAccounts([]);
            } finally {
                setLoading(false);
            }
        };

        loadAccounts();
    }, []);

    const getLinkedEmpires = (accountName: string, empires: Empire[]) => {
        return AccountBusinessService.getLinkedEmpires(accountName, empires);
    };

    return <>{children({ accounts, loading, getLinkedEmpires })}</>;
}
