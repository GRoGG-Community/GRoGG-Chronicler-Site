import React from 'react';
import ActionButton from '../common/ActionButton';
import StatusBadge from '../common/StatusBadge';
import ListContainer from '../common/ListContainer';
import cutOffDotter from '../../../business/utils/textTruncationUtils';
import { TEXT_LIMITS } from '../../../infrastructure/constants/app.constants';

export default function TreatyList({
    treaties,
    loaded,
    onView,
    canEditTreaty,
    onEdit
}) {
    return (
        <ListContainer
            loading={!loaded}
            emptyMessage="No treaties found."
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
                                {cutOffDotter.cut(treaty.title, TEXT_LIMITS.TREATY_TITLE_PREVIEW)}
                            </div>
                            <div className="treaty-meta">
                                <div className="treaty-owner">
                                    Owner: {cutOffDotter.cut(treaty.owner, TEXT_LIMITS.TREATY_OWNER_PREVIEW)}
                                </div>
                                <div className="treaty-participants">
                                    <b>Participants:</b> {cutOffDotter.cut(treaty.participants?.join(', ') || '', TEXT_LIMITS.TREATY_PARTICIPANTS_PREVIEW)}
                                </div>
                            </div>
                            <div className="treaty-content">
                                {cutOffDotter.cut(treaty.content, TEXT_LIMITS.TREATY_CONTENT_PREVIEW)}
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

