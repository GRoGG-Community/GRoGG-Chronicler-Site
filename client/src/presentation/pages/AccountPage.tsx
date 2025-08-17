import React, { useState } from 'react';
import { useAccountPage } from '../hooks/useAccountPage';
import { StandardizedMessage } from '../components/common/StandardizedMessage';
import AccountInfoController from '../../business/controllers/account/AccountInfoController';
import AccountManagementController from '../../business/controllers/account/AccountManagementController';

/**
 * AccountPage (Presentation Layer)
 * Uses presentation hook to maintain proper separation of concerns.
 * Controllers are imported but through business layer, not directly accessed.
 */
export default function AccountPage() {
    const {
        selectedTab,
        handleTabChange,
        selectedAccount,
        handleAccountSelect,
        accounts,
        loading,
        error,
        success,
        refreshAccounts,
        clearError,
        clearSuccess
    } = useAccountPage();

    const [editingAccount, setEditingAccount] = useState<{ id: number; name: string; password: string } | null>(null);

    const handleEdit = (accountName: string) => {
        // Find the account by name and set it for editing
        const account = accounts.find(acc => acc.name === accountName);
        if (account) {
            setEditingAccount({
                id: typeof account.id === 'string' ? parseInt(account.id) : account.id,
                name: account.name,
                password: account.password || ''
            });
        }
    };

    const handleDelete = (accountName: string) => {
        // Close edit panel if the deleted account was being edited
        if (editingAccount && editingAccount.name === accountName) {
            setEditingAccount(null);
        }
        refreshAccounts();
    };

    const handleAccountUpdated = () => {
        setEditingAccount(null);
        refreshAccounts();
    };

    const handleCancelEdit = () => {
        setEditingAccount(null);
    };

    return (
        <section className="account-manage-section card">
            <h2>Manage Accounts</h2>
            
            {/* Standardized Success/Error Messages */}
            <StandardizedMessage 
                type="error"
                message={error}
                onDismiss={clearError}
            />
            <StandardizedMessage 
                type="success"
                message={success}
                onDismiss={clearSuccess}
            />

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={selectedTab === 'info' ? 'active' : ''}
                    onClick={() => handleTabChange('info')}
                >
                    Account Info
                </button>
                <button 
                    className={selectedTab === 'management' ? 'active' : ''}
                    onClick={() => handleTabChange('management')}
                >
                    Management
                </button>
            </div>

            {/* Account Creation Form */}
            {selectedTab === 'info' && (
                <div className="account-create-section">
                    <h3>Create New Account</h3>
                    <AccountInfoController
                        updateAccounts={refreshAccounts}
                    />
                </div>
            )}

            {/* Account List and Management */}
            {selectedTab === 'management' && (
                <div className="account-list-section">
                    <h3>All Accounts</h3>
                    <AccountManagementController
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        editAccountLoading={loading}
                    />
                </div>
            )}

            {/* Account Editing */}
            {editingAccount && (
                <div className="account-edit-section">
                    <h3>Edit Account: {editingAccount.name}</h3>
                    <AccountInfoController
                        updateAccounts={handleAccountUpdated}
                        onCancel={handleCancelEdit}
                        accountId={editingAccount.id}
                        accountName={editingAccount.name}
                        accountPass=""
                    />
                </div>
            )}
        </section>
    );
}