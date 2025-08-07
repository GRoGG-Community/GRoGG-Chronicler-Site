
import React from 'react';
import ActionButton from '../common/ActionButton';
import EntityActionButtons, { createCRUDActions } from '../common/EntityActionButtons';
import ListContainer from '../common/ListContainer';
import AccountDropdown from '../common/AccountDropdown';
import { Empire, EmpireListProps } from '../../../data/models/Empire';
import { Account } from '../../../data/types/AccountTypes';
import { useAccountSelection } from '../../../business/hooks/presentation/useAccountSelection';

export default function EmpireList({
    empires,
    onEdit,
    onDelete,
    onLink,
    onUnlink,
    getEmpireAccount,
    loading
}: EmpireListProps) {
    const { selectedAccounts, handleLinkAccount, handleAccountSelection, getSelectedAccount } = useAccountSelection();

    const handleLinkClick = (empireId: string) => {
        handleLinkAccount(empireId, onLink);
    };

    return <ListContainer
        emptyMessage="No empires found."
        loading={loading}
    >
        <ul className="empires-list">
            {empires.map(empire => {
                const empireIdStr = String(empire.id);
                const linkedAccount = getEmpireAccount(empireIdStr);
                const selectedAccountId = getSelectedAccount(empireIdStr);

                return (
                    <li key={empire.id} className="empire-item">
                        <div className="empire-info">
                            <b>{empire.name}</b>
                            {linkedAccount ? (
                                <span className="empire-linked-account">
                                    Linked to: <strong>{linkedAccount}</strong>
                                </span>
                            ) : (
                                <span className="empire-unlinked">Not linked</span>
                            )}
                        </div>
                        <span className="empire-actions">
                            {linkedAccount ? (
                                <ActionButton
                                    variant="secondary"
                                    className="empire-manage-btn empire-unlink-btn"
                                    onClick={() => onUnlink(empireIdStr)}
                                    disabled={loading}
                                >Unlink</ActionButton>
                            ) : (
                                <>
                                    <AccountDropdown
                                        value={selectedAccountId}
                                        onChange={(accountId) => handleAccountSelection(empireIdStr, accountId)}
                                        label=""
                                    />
                                    <ActionButton
                                        variant="secondary"
                                        className="empire-manage-btn empire-link-btn"
                                        onClick={() => handleLinkClick(empireIdStr)}
                                        disabled={loading || !selectedAccountId}
                                    >Link</ActionButton>
                                </>
                            )}

                            <EntityActionButtons
                                actions={createCRUDActions(
                                    () => onEdit(empire.name),
                                    () => onDelete(empireIdStr),
                                    undefined, // no view action
                                    {
                                        editDisabled: loading,
                                        deleteDisabled: loading,
                                        loading: loading
                                    }
                                )}
                                orientation="horizontal"
                                spacing="compact"
                            />
                        </span>
                    </li>
                );
            })}
        </ul>
    </ListContainer>
}
