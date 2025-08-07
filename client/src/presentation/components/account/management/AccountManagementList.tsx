import EntityActionButtons, { createCRUDActions } from '../../common/EntityActionButtons';
import ListContainer from '../../common/ListContainer';
import { Account, AccountManagementListProps } from '../../../../data/types/AccountTypes';

export default function AccountManagementList({
    accounts,
    onEdit,
    onDelete,
    editAccountLoading,
    empires = [],
    getLinkedEmpires
}: AccountManagementListProps) {
    
    return <ListContainer
        emptyMessage="No accounts found."
        loading={editAccountLoading}
    >
        <ul className="accounts-list">
            {accounts.map(acc => {
                const linkedEmpires = getLinkedEmpires ? getLinkedEmpires(acc.name, empires) : [];
                
                return (
                    <li key={acc.id} className={`account-item ${acc.name === "GameMaster" ? "account-item-admin" : ""}`}>
                        <div className="account-info">
                            <b>{acc.name}</b>
                            {acc.name === "GameMaster" && (
                                <span className="account-admin-badge">Permanent Admin Account</span>
                            )}
                            
                            {/* Show linked empires - always display the section */}
                            <div className="account-linked-empires">
                                <small>
                                    <strong>Linked Empires:</strong> {
                                        linkedEmpires.length > 0 
                                            ? linkedEmpires.map(empire => empire.name).join(', ')
                                            : <span className="no-linked-empire">No linked Empire</span>
                                    }
                                </small>
                            </div>
                        </div>
                        {acc.name === "GameMaster" ? (
                            <span className="account-actions">
                                <span className="account-admin-icon">👑</span>
                            </span>
                        ) : (
                            <span className="account-actions">
                                <EntityActionButtons 
                                    actions={createCRUDActions(
                                        () => onEdit(acc.name),
                                        () => onDelete(acc.name),
                                        undefined, // no view action for accounts
                                        {
                                            editDisabled: editAccountLoading,
                                            deleteDisabled: editAccountLoading,
                                            loading: editAccountLoading
                                        }
                                    )}
                                    orientation="horizontal"
                                    spacing="compact"
                                />
                            </span>
                        )}
                    </li>
                );
            })}
        </ul>
    </ListContainer>
}
