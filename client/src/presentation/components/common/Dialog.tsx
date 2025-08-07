import React, { ReactNode } from 'react';
import Card from './Card';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function Dialog({
    open,
    onClose,
    title,
    actions,
    children,
    className = '',
    style = {}
}: DialogProps) {
    if (!open) return null;
    return (
        <div className={`modal-overlay ${className}`} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <Card className={className} style={style}>
                    {title && <h2>{title}</h2>}
                    <div className="dialog-content">
                        {children}
                    </div>
                    {actions && <div className="dialog-actions">{actions}</div>}
                </Card>
            </div>
        </div>
    );
}
