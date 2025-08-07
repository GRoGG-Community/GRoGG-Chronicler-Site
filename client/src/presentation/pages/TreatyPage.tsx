
import React, { useState } from 'react';
import TreatyManagementController from '../../business/controllers/treaty/TreatyManagementController';
import TreatyBusinessController from '../../business/controllers/treaty/TreatyBusinessController';
import TreatyInfoEdit from '../components/treaty/info/TreatyInfoEdit';
import TreatyInfoView from '../components/treaty/info/TreatyInfoView';
import useAccount from '../../business/hooks/application/useAccount';
import { useEntityState } from '../../business/hooks/infrastructure/useEntityState';
import type { Treaty } from '../../data/models/Treaty';
import type { CurrentAccount } from '../../data/types/AccountTypes';

/**
 * TreatyPage (Presentation Layer Only)
 * Fixed to remove direct service calls and business logic.
 * All business operations now properly delegated to business controllers.
 */
type ControllerProps = {
    treaties: Treaty[];
    loading: boolean;
    error: string | null;
    refreshTreaties: () => void;
};

export default function TreatyPage() {
    const { account } = useAccount();
    const typedAccount = account as CurrentAccount | null;
    const dialogState = useEntityState();
    const [viewTreaty, setViewTreaty] = useState<Treaty | null>(null);
    const [editTreaty, setEditTreaty] = useState<Treaty | null>(null);
    const [dialogMode, setDialogMode] = useState('edit');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('title');

    const handleBusinessSuccess = () => {
        dialogState.setError('');
    };

    const handleBusinessError = (error: string) => {
        dialogState.setError(error);
    };

    // Handler: view treaty details
    const onView = (treaty: Treaty) => setViewTreaty(treaty);
    
    // Handler: open edit dialog
    const onEdit = (mode: string, treaty: Treaty) => {
        setEditTreaty(treaty);
        setDialogMode(mode);
        setDialogOpen(true);
        dialogState.setError('');
    };
    
    // Handler: close dialog
    const onDialogClose = () => {
        setDialogOpen(false);
        setEditTreaty(null);
        dialogState.setError('');
    };

    return (
        <TreatyManagementController>
            {({ treaties, loading, error, refreshTreaties }: ControllerProps) => (
                <TreatyBusinessController
                    account={typedAccount}
                    onSuccess={handleBusinessSuccess}
                    onError={handleBusinessError}
                >
                    {({ canEdit, canDelete, deleteTreaty, updateTreaty, createTreaty }) => {
                        // Handler: delete treaty
                        const createOnDelete = (refreshTreaties: () => void) => async (treaty: Treaty) => {
                            try {
                                dialogState.setLoading(true);
                                await deleteTreaty(treaty);
                                refreshTreaties();
                                setViewTreaty(null);
                            } catch (error) {
                                // Error already handled by business controller
                            } finally {
                                dialogState.setLoading(false);
                            }
                        };

                        // Handler: save treaty
                        const onDialogSave = async (form: Partial<Treaty>) => {
                            dialogState.setLoading(true);
                            dialogState.setError('');
                            
                            try {
                                if (editTreaty?.id) {
                                    await updateTreaty(editTreaty, form);
                                } else {
                                    await createTreaty(form);
                                }
                                
                                refreshTreaties();
                                setDialogOpen(false);
                                setEditTreaty(null);
                            } catch (error) {
                                // Error already handled by business controller
                            } finally {
                                dialogState.setLoading(false);
                            }
                        };

                        return (
                            <div className="treaties-section card">
                                <h2>Treaties</h2>
                                {error && <div className="error-message">{error}</div>}
                                <TreatyManagementController
                                    treaties={treaties}
                                    loaded={!loading}
                                    onView={onView}
                                    canEditTreaty={canEdit}
                                    onEdit={onEdit}
                                    canDeleteTreaty={canDelete}
                                    onDelete={createOnDelete(refreshTreaties)}
                                    search={search}
                                    sort={sort}
                                />
                                {viewTreaty && (
                                    <TreatyInfoView
                                        treaty={viewTreaty}
                                        onBack={() => setViewTreaty(null)}
                                        onEdit={() => onEdit('edit', viewTreaty)}
                                        onDelete={createOnDelete(refreshTreaties)}
                                        canEdit={canEdit(viewTreaty)}
                                        canDelete={canDelete(viewTreaty)}
                                    />
                                )}
                                {dialogOpen && (
                                    <TreatyInfoEdit
                                        open={dialogOpen}
                                        mode={dialogMode}
                                        data={editTreaty}
                                        onSave={onDialogSave}
                                        onClose={onDialogClose}
                                        error={dialogState.error}
                                        saving={dialogState.loading}
                                        empires={[]}
                                        accounts={[]}
                                        account={typedAccount}
                                    />
                                )}
                            </div>
                        );
                    }}
                </TreatyBusinessController>
            )}
        </TreatyManagementController>
    );
}
