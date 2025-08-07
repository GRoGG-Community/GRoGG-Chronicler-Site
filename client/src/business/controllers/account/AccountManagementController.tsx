import { useEffect, useState } from "react";
import { LoadingMessage } from "../../../presentation/components/common/Messages";
import AccountManagementList from "../../../presentation/components/account/management/AccountManagementList";
import Account from "../../../data/models/Account";
import { Empire } from "../../../data/models/Empire";
import { AccountManagementControllerProps } from '../../../data/types/AccountTypes';
import { useCRUD } from '../../hooks/infrastructure/useCRUD';
import { useConfirmDelete } from '../../hooks/infrastructure/useCommonUtilities';
import { AccountBusinessService } from '../../services/AccountBusinessService';
import { AccountDataService } from "../../../data/services/AccountDataService";
import { EmpireDataService } from "../../../data/services/EmpireDataService";
import { AccountCache, EmpireCache } from "../../../data/cache/EntityCacheManager";

// Create API client adapter for useCRUD hook using AccountBusinessService
const accountsApiClient = {
    create: async (data: Partial<Account>): Promise<void> => {
        if (!data.name || !data.password) throw new Error('Name and password are required');
        await AccountBusinessService.createAccount(data.name, data.password);
        AccountCache.invalidate(); // Invalidate cache after creation
    },
    read: () => AccountDataService.fetchAccountsRaw(),
    update: async (id: string | number, data: Partial<Account>): Promise<void> => {
        // Get current account data from cache first to preserve existing values
        const accounts = await AccountDataService.fetchAccountsRaw();
        const currentAccount = accounts.find((acc: Account) => acc.name === id.toString());
        if (!currentAccount) throw new Error('Account not found');
        
        const name = data.name !== undefined ? data.name : currentAccount.name;
        const password = data.password !== undefined ? data.password : currentAccount.password;
        
        await AccountBusinessService.updateAccount(currentAccount.id, name, password);
        AccountCache.invalidate(); // Invalidate cache after update
    },
    delete: async (id: string | number): Promise<void> => {
        await AccountBusinessService.deleteAccount(id.toString());
        AccountCache.invalidate(); // Invalidate cache after deletion
    }
};

export default function AccountManagementController({
    onEdit,
    onDelete,
    editAccountLoading
}: AccountManagementControllerProps) {
    const { confirmDelete } = useConfirmDelete();
    const [empires, setEmpires] = useState<Empire[]>([]);
    
    const {
        data: accounts,
        loading,
        error,
        success,
        fetchEntities,
        deleteEntity
    } = useCRUD<Account>({
        apiClient: accountsApiClient,
        onSuccess: (operation, data) => {
            // Account operation completed successfully
        },
        onError: (operation, error) => {
            console.error(`Account ${operation} failed:`, error);
        }
    });

    useEffect(() => {
        fetchEntities();
    }, [fetchEntities]);

    // Fetch empires data
    useEffect(() => {
        EmpireDataService.fetchEmpires().then(setEmpires).catch(() => setEmpires([]));
    }, [accounts]); // Refresh empires when accounts change

    const handleDelete = async (accountId: string) => {
        const account = accounts.find(a => a.id.toString() === accountId);
        if (confirmDelete('account', account?.name || 'Unknown')) {
            try {
                await deleteEntity(accountId);
                onDelete?.(accountId);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    if (loading && accounts.length === 0) {
        return <LoadingMessage>Loading accounts...</LoadingMessage>;
    }

    return (
        <AccountManagementList
            accounts={accounts}
            empires={empires.map(empire => ({
                id: empire.id,
                name: empire.name,
                account: empire.account || ""
            }))}
            onEdit={onEdit}
            onDelete={handleDelete}
            editAccountLoading={editAccountLoading}
            getLinkedEmpires={(accountName: string, empires: any[]) => 
                AccountBusinessService.getLinkedEmpires(accountName, empires)
            }
        />
    );
}