import React from 'react';
import ActionButton from '../ActionButton';
import ListContainer from '../ListContainer';
import { EmptyMessage } from '../Messages';

export default function AccountList({
    accounts,
    onEdit,
    onDelete,
    editAccountLoading
}) {
    return (
        <ListContainer emptyMessage={<EmptyMessage>No accounts found.</EmptyMessage>}>
            <ul className="accounts-list">
                {Object.keys(accounts).map(acc => (
                    <li key={acc} className="account-item">
                        <b>{acc}</b>
                        {acc !== "GameMaster" && (
                            <span className="account-actions">
                                <ActionButton
                                    variant="primary"
                                    className="account-manage-btn account-edit-btn"
                                    onClick={() => onEdit(acc)}
                                    disabled={editAccountLoading}
                                >Edit</ActionButton>
                                <ActionButton
                                    variant="danger"
                                    className="account-manage-btn account-delete-btn"
                                    onClick={() => onDelete(acc)}
                                    disabled={editAccountLoading}
                                >Delete</ActionButton>
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </ListContainer>
    );
}
