import React, { useState } from 'react';
import AccountInfoController from '../../business/controllers/account/AccountInfoController';
import AccountManagementController from '../../business/controllers/account/AccountManagementController';
import Account from '../../data/models/Account';

/**
 * AccountPage (Presentation Layer Only)
 * Fixed to remove direct cache operations and data management.
 * All business logic is now properly delegated to the controller.
 */
export default function AccountPage() {
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showSuccess = (text: string) => {
        setMessage({ type: 'success', text });
    };

    const showError = (text: string) => {
        setMessage({ type: 'error', text });
    };

    const clearMessage = () => {
        setMessage(null);
    };

    const handleEdit = (accountName: string) => {
        // Let the controller handle account lookup
        setEditingAccount({ name: accountName, id: 0, password: '' }); // Simplified for presentation layer
        clearMessage();
    };

    const handleDelete = (accountName: string) => {
        setEditingAccount(null); // Close edit panel if the deleted account was being edited
        showSuccess('Account deleted successfully');
    };

    const handleAccountCreated = () => {
        showSuccess('Account created successfully');
    };

    const clearMessages = () => {
        clearMessage();
    };

    return (
        <section className="account-manage-section card">
            <h2>Manage Accounts</h2>
            
            {/* Success/Error Messages */}
            {message && (
                <div className={`${message.type}-message`} onClick={clearMessage}>
                    {message.text}
                </div>
            )}

            {/* Account Creation Form - Always visible like ManageEmpiresPage */}
            <AccountInfoController
                updateAccounts={handleAccountCreated}
            />

            <h3>All Accounts</h3>
            <AccountManagementController
                onEdit={handleEdit}
                onDelete={handleDelete}
                editAccountLoading={false}
            />

            {/* Account Editing */}
            {editingAccount && (
                <div className="account-edit-section">
                    <h3>Edit Account: {editingAccount.name}</h3>
                    <AccountInfoController
                        updateAccounts={() => {
                            setEditingAccount(null);
                            showSuccess('Account updated successfully');
                        }}
                        onCancel={() => {
                            setEditingAccount(null);
                            clearMessage();
                        }}
                        accountId={editingAccount.id}
                        accountName={editingAccount.name}
                        accountPass=""
                    />
                </div>
            )}
        </section>
    );
}