import React from 'react';
import { TREATY_STATUSES } from '../../../business/utils/treatyUtils';

// Extended status map including treaty statuses and additional states
const STATUS_MAP = {
    // Treaty statuses from treatyUtils
    ...Object.fromEntries(
        Object.entries(TREATY_STATUSES).map(([key, label]) => [
            key,
            {
                label,
                color: key === 'discussion' ? '#00bfff' 
                    : key === 'active' ? '#00e676'
                    : key === 'broken' ? '#ff4d4d'
                    : key === 'expired' ? '#ffb300'
                    : '#aaa'
            }
        ])
    ),
    // Additional non-treaty statuses
    'in-progress': { label: '🛠️ In Progress', color: '#ffb300' },
    completed: { label: '✅ Completed', color: '#00e676' },
    planned: { label: '🗓️ Planned', color: '#00bfff' }
};

export default function StatusBadge({ status }) {
    const s = STATUS_MAP[status] || { label: status, color: '#aaa' };
    return (
        <span
            className="status-badge"
            style={{
                color: s.color,
                borderColor: s.color,
                fontWeight: 'bold',
                borderRadius: 8,
                padding: '0.3em 1.2em',
                background: 'var(--primary-bg)',
                border: '1.5px solid',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center'
            }}
        >
            {s.label}
        </span>
    );
}
