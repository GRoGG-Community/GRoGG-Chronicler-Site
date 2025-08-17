
import React, { useState } from 'react';
import { useTreatyPage } from '../hooks/useTreatyPage';
import { StandardizedMessage } from '../components/common/StandardizedMessage';
import TreatyManagementController from '../../business/controllers/treaty/TreatyManagementController';
import TreatyInfoEdit from '../components/treaty/info/TreatyInfoEdit';
import TreatyInfoView from '../components/treaty/info/TreatyInfoView';
import useAccount from '../../business/hooks/application/useAccount';
import type { Treaty } from '../../data/models/Treaty';
import type { CurrentAccount } from '../../data/types/AccountTypes';

/**
 * TreatyPage (Presentation Layer)
 * Uses presentation hook to maintain proper separation of concerns.
 * All business logic is delegated through the useTreatyPage hook.
 */
export default function TreatyPage() {
    const {
        viewMode,
        selectedTreaty,
        handleTreatySelect,
        handleEditTreaty,
        handleBackToList,
        treaties,
        loading,
        error,
        success,
        handleSaveTreaty,
        deleteTreaty,
        refreshTreaties,
        clearError,
        clearSuccess
    } = useTreatyPage();

    const { account } = useAccount();
    const typedAccount = account as CurrentAccount | null;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('title');

    // Simple permission check (can be enhanced later)
    const canEdit = (treaty: Treaty) => {
        return typedAccount?.username === treaty.side1 || typedAccount?.username === treaty.side2;
    };

    const canDelete = (treaty: Treaty) => {
        return typedAccount?.username === treaty.side1 || typedAccount?.username === treaty.side2;
    };

    // Handler: view treaty details
    const onView = (treaty: Treaty) => handleTreatySelect(treaty);
    
    // Handler: open edit dialog
    const onEdit = (mode: string, treaty: Treaty) => {
        handleEditTreaty(treaty);
        setDialogOpen(true);
    };
    
    // Handler: close dialog
    const onDialogClose = () => {
        setDialogOpen(false);
        handleBackToList();
    };

    // Handler: delete treaty
    const onDelete = async (treaty: Treaty) => {
        try {
            if (typeof treaty.id === 'number') {
                await deleteTreaty(treaty.id);
                refreshTreaties();
                handleBackToList();
            }
        } catch (error) {
            // Error already handled by hook
        }
    };

    // Handler: save treaty
    const onDialogSave = async (form: Partial<Treaty>) => {
        try {
            await handleSaveTreaty(form);
            setDialogOpen(false);
            refreshTreaties();
        } catch (error) {
            // Error already handled by hook
        }
    };

    return (
        <div className="treaties-section card">
            <h2>Treaties</h2>
            
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
            
            {viewMode === 'list' && (
                <TreatyManagementController
                    treaties={treaties}
                    loaded={!loading}
                    onView={onView}
                    canEditTreaty={canEdit}
                    onEdit={onEdit}
                    canDeleteTreaty={canDelete}
                    onDelete={onDelete}
                    search={search}
                    sort={sort}
                />
            )}
            
            {viewMode === 'view' && selectedTreaty && (
                <TreatyInfoView
                    treaty={selectedTreaty}
                    onBack={handleBackToList}
                    onEdit={() => onEdit('edit', selectedTreaty)}
                    onDelete={() => onDelete(selectedTreaty)}
                    canEdit={canEdit(selectedTreaty)}
                    canDelete={canDelete(selectedTreaty)}
                />
            )}
            
            {viewMode === 'edit' && (
                <TreatyInfoEdit
                    open={dialogOpen}
                    mode="edit"
                    data={selectedTreaty}
                    onSave={onDialogSave}
                    onClose={onDialogClose}
                    error={error}
                    saving={loading}
                    empires={[]}
                    accounts={[]}
                    account={typedAccount}
                />
            )}
        </div>
    );
}
