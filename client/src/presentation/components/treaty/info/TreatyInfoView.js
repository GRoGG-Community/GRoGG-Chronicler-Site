import React from 'react';
import ActionButton from '../../common/ActionButton';
import Dialog from '../../common/Dialog';
import StatusBadge from '../../common/StatusBadge';
import MarkdownRenderer from '../../common/MarkdownRenderer';

export default function TreatyView({ treaty, onBack, onEdit, onDelete, canEdit, canDelete }) {
    if (!treaty) return null;
    return (
        <Dialog
            open={true}
            onClose={onBack}
            title={treaty.title}
            className="treaty-view-dialog"
            actions={
                <>
                    <ActionButton variant="secondary" className="empire-back-btn" style={{minWidth: 110, maxWidth: 160}} onClick={onBack}>Back</ActionButton>
                    {canEdit && <ActionButton variant="primary" className="empire-save-btn" style={{minWidth: 110, maxWidth: 160}} onClick={onEdit}>Edit</ActionButton>}
                    {canDelete && <ActionButton variant="danger" className="empire-delete-btn" style={{minWidth: 110, maxWidth: 160}} onClick={onDelete}>Delete</ActionButton>}
                </>
            }
        >
            <div className="treaty-view-meta">
                <div><b>Status:</b> <StatusBadge status={treaty.status} /></div>
                <div><b>Owner:</b> {treaty.owner}</div>
                <div><b>Participants:</b> {treaty.participants?.join(', ') || <i>None</i>}</div>
            </div>
            <div className="treaty-view-content">
                <MarkdownRenderer markdown={treaty.content} />
            </div>
        </Dialog>
    );
}

