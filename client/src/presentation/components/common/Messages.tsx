import React, { ReactNode } from 'react';

interface BaseMessageProps {
    children?: ReactNode;
    className?: string;
}

export function LoadingMessage({ children = "Loading...", className = "login-loading" }: BaseMessageProps) {
    return <div className={className}>{children}</div>;
}

export function ErrorMessage({ children, className = "login-error" }: BaseMessageProps) {
    if (!children) return null;
    return <div className={className}>{children}</div>;
}

export function EmptyMessage({ children = "No items found.", className = "no-messages" }: BaseMessageProps) {
    return <div className={className}>{children}</div>;
}
