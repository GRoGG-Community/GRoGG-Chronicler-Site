import React from 'react';
import { TREATY_STATUSES } from '../../utils/treatyStatuses';
import ActionButton from '../ActionButton';
import Dialog from '../Dialog';
import StatusBadge from '../StatusBadge';
import MarkdownRenderer from '../MarkdownRenderer';

export default function TreatyView({ treaty, onBack, onEdit, canEdit, canTransfer }) {
    if (!treaty) return null;
    return (
        <Dialog
            open={true}
            onClose={onBack}
            title={treaty.title}
            actions={
                <>
                    <ActionButton variant="secondary" className="empire-back-btn" style={{minWidth: 110, maxWidth: 160}} onClick={onBack}>Back</ActionButton>
                    {canEdit && <ActionButton variant="primary" className="empire-save-btn" style={{minWidth: 110, maxWidth: 160}} onClick={onEdit}>Edit</ActionButton>}
                </>
            }
        >
            <div><b>Status:</b> <StatusBadge status={treaty.status} /></div>
            <div><b>Owner:</b> {treaty.owner}</div>
            <div><b>Participants:</b> {treaty.participants?.join(', ') || <i>None</i>}</div>
            <div style={{margin: '1em 0', whiteSpace: 'pre-line'}}>
                <MarkdownRenderer markdown={treaty.content} />
            </div>
        </Dialog>
    );
}

