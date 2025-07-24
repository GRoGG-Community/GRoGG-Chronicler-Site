import ActionButton from '../ActionButton';
import ListContainer from '../ListContainer';
import { EmptyMessage, LoadingMessage } from '../Messages';
import Dropdown from '../Dropdown';
import cutOffDotter from '../../utils/cutOffDotter';

export default function EmpireList({
    empires,
    accounts,
    onLink,
    onUnlink,
    onDelete,
    loading,
    account,
    setEmpirePage,
    setEditEmpire,
    getEmpireAccount
}) {
    return (
        <ListContainer
            loading={loading ? <LoadingMessage /> : false}
            emptyMessage={<EmptyMessage>No empires found.</EmptyMessage>}
        >
            <div className="empires-info-list" style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start'}}>
                {empires.map(emp => {
                    if (!emp) return null;
                    const linkedAccount = getEmpireAccount ? getEmpireAccount(emp.name) : emp.account;
                    const canEdit = account && (account.username === linkedAccount || account.username === "GameMaster");
                    return (
                        <div
                            key={emp.name}
                            className="empire-info-card empire-list-card"
                            onClick={() => setEmpirePage && setEmpirePage(emp.name)}
                        >
                            <h3 className="empire-info-title">
                                {cutOffDotter.cut(emp.name, 28)}
                            </h3>
                            <div className="empire-info-owner">
                                {linkedAccount
                                    ? <span title="Assigned Account">{cutOffDotter.cut(linkedAccount, 18)}</span>
                                    : <i>Unassigned</i>}
                            </div>
                            <div className="empire-actions">
                                {setEmpirePage && (
                                    <ActionButton
                                        variant="primary"
                                        className="empire-view-btn"
                                        onClick={ev => {ev.stopPropagation(); setEmpirePage(emp.name);}}
                                    >View</ActionButton>
                                )}
                                {canEdit && setEditEmpire && (
                                    <ActionButton
                                        variant="primary"
                                        className="empire-save-btn"
                                        onClick={ev => {ev.stopPropagation(); setEditEmpire(emp.name);}}
                                    >Edit</ActionButton>
                                )}
                                {onDelete && (
                                    <ActionButton
                                        variant="danger"
                                        className="account-manage-btn account-delete-btn"
                                        onClick={ev => {ev.stopPropagation(); onDelete(emp.name);}}
                                        disabled={loading}
                                    >Delete</ActionButton>
                                )}
                                {onLink && onUnlink && (
                                    <Dropdown
                                        value={emp.account || ''}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val) onLink(emp.name, val);
                                            else onUnlink(emp.name);
                                        }}
                                        options={Object.keys(accounts).map(accName => ({
                                            value: accName,
                                            label: accName
                                        }))}
                                        placeholder="Select account..."
                                        className="account-select"
                                        disabled={loading}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </ListContainer>
    );
}

