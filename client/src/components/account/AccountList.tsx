import React from 'react';
import ActionButton from '../ActionButton';
import ListContainer from '../ListContainer';
import { EmptyMessage } from '../Messages';
import Account from '../../model/Account';

interface AccountListProps {
    accounts: Array<Account>,
    onEdit: (accountName: string) => void,
    onDelete: (accountName: string) => void,
    editAccountLoading: boolean
}

export default function AccountList({
    accounts,
    onEdit,
    onDelete,
    editAccountLoading
}: AccountListProps) {
    return <ListContainer
        emptyMessage="No accounts found."
        loading={editAccountLoading}
    >
        <ul className="accounts-list">
            {accounts.map(acc => (
                <li key={acc.id} className="account-item">
                    <b>{acc.name}</b>
                    {acc.name !== "GameMaster" && (
                        <span className="account-actions">
                            <ActionButton
                                variant="primary"
                                className="account-manage-btn account-edit-btn"
                                onClick={() => onEdit(acc.name)}
                                disabled={editAccountLoading}
                            >Edit</ActionButton>
                            <ActionButton
                                variant="danger"
                                className="account-manage-btn account-delete-btn"
                                onClick={() => onDelete(acc.name)}
                                disabled={editAccountLoading}
                            >Delete</ActionButton>
                        </span>
                    )}
                </li>
            ))}
        </ul>
    </ListContainer>
}
