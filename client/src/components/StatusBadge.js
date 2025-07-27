import React from 'react';

const STATUS_MAP = {
    discussion: { label: '🗨️ In Discussion', color: '#00bfff' },
    active: { label: '✅ Active', color: '#00e676' },
    broken: { label: '❌ Broken', color: '#ff4d4d' },
    expired: { label: '⌛ Expired', color: '#ffb300' },
    other: { label: '❓ Other', color: '#aaa' },
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
