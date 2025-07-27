import React from 'react';
import Card from './Card';

export default function Dialog({
    open,
    onClose,
    title,
    actions,
    children,
    className = '',
    style = {}
}) {
    if (!open) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <Card className={className} style={style}>
                    {title && <h2>{title}</h2>}
                    {children}
                    {actions && <div className="dialog-actions">{actions}</div>}
                </Card>
            </div>
        </div>
    );
}
