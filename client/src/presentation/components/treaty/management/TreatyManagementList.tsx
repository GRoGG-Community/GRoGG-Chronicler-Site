import React from 'react';
import EntityActionButtons, { createCRUDActions } from '../../common/EntityActionButtons';
import StatusBadge from '../../common/StatusBadge';
import ListContainer from '../../common/ListContainer';
import cutOffDotter from '../../../../business/utils/textTruncationUtils';
import { TEXT_LIMITS } from '../../../../infrastructure/constants/app.constants';
import { Treaty } from '../../../../data/models/Treaty';

interface TreatyManagementListProps {
    treaties: Treaty[];
    loaded: boolean;
    onView: (treaty: Treaty) => void;
    canEditTreaty: (treaty: Treaty) => boolean;
    canDeleteTreaty: (treaty: Treaty) => boolean;
    onEdit: (mode: string, treaty: Treaty) => void;
    onDelete: (treaty: Treaty) => void;
}

export default function TreatyManagementList({
    treaties,
    loaded,
    onView,
    canEditTreaty,
    canDeleteTreaty,
    onEdit,
    onDelete
}: TreatyManagementListProps) {
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
                                    Owner: {cutOffDotter.cut(treaty.owner || '', TEXT_LIMITS.TREATY_OWNER_PREVIEW)}
                                </div>
                                <div className="treaty-participants">
                                    <b>Participants:</b> {cutOffDotter.cut(treaty.participants?.join(', ') || '', TEXT_LIMITS.TREATY_PARTICIPANTS_PREVIEW)}
                                </div>
                            </div>
                            <div className="treaty-content">
                                {cutOffDotter.cut(treaty.content || '', TEXT_LIMITS.TREATY_CONTENT_PREVIEW)}
                            </div>
                        </div>
                        <div className="treaty-actions">
                            <span className="treaty-status">
                                <StatusBadge status={treaty.status} />
                            </span>
                            <span className="treaty-buttons">
                                <EntityActionButtons
                                    actions={createCRUDActions(
                                        canEditTreaty && canEditTreaty(treaty) ? () => onEdit('edit', treaty) : () => {},
                                        canDeleteTreaty && canDeleteTreaty(treaty) ? () => onDelete(treaty) : () => {},
                                        () => onView(treaty), // Include view action in EntityActionButtons
                                        {
                                            editDisabled: !canEditTreaty || !canEditTreaty(treaty),
                                            deleteDisabled: !canDeleteTreaty || !canDeleteTreaty(treaty),
                                            loading: false
                                        }
                                    )}
                                    orientation="horizontal"
                                    spacing="compact"
                                />
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </ListContainer>
    );
}
