import React from 'react';
import { TREATY_STATUSES } from '../utils/treatyStatuses';
import ActionButton from './ActionButton';
import StatusBadge from './StatusBadge';
import ListContainer from './ListContainer';
import { EmptyMessage, LoadingMessage } from './Messages';
import cutOffDotter from '../utils/cutOffDotter';

export default function TreatyList({
    treaties,
    loaded,
    onView,
    canEditTreaty,
    onEdit
}) {
    return (
        <ListContainer
            loading={!loaded ? <LoadingMessage /> : false}
            emptyMessage={<EmptyMessage>No treaties found.</EmptyMessage>}
        >
            <ul className="treaties-list">
                {treaties.map(treaty => (
                    <li
                        key={treaty.id}
                        className="treaty-item"
                        onClick={() => onView(treaty)}
                    >
                        <div className="treaty-info">
                            <div className="treaty-title">
                                {cutOffDotter.cut(treaty.title, 48)}
                            </div>
                            <div className="treaty-meta">
                                <div className="treaty-owner">
                                    Owner: {cutOffDotter.cut(treaty.owner, 24)}
                                </div>
                                <div className="treaty-participants">
                                    <b>Participants:</b> {cutOffDotter.cut(treaty.participants?.join(', ') || '', 46)}
                                </div>
                            </div>
                            <div className="treaty-content">
                                {cutOffDotter.cut(treaty.content, 220)}
                            </div>
                        </div>
                        <div className="treaty-actions">
                            <span className="treaty-status">
                                <StatusBadge status={treaty.status} />
                            </span>
                            <span className="treaty-buttons">
                                <ActionButton
                                    className="empire-view-btn"
                                    onClick={ev => { ev.stopPropagation(); onView(treaty); }}
                                >View</ActionButton>
                                {canEditTreaty && canEditTreaty(treaty) && (
                                    <ActionButton
                                        className="empire-save-btn"
                                        onClick={ev => { ev.stopPropagation(); onEdit('edit', treaty); }}
                                    >Edit</ActionButton>
                                )}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </ListContainer>
    );
}

