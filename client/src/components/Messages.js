import React from 'react';

export function LoadingMessage({ children = "Loading...", className = "login-loading" }) {
    return <div className={className}>{children}</div>;
}

export function ErrorMessage({ children, className = "login-error" }) {
    if (!children) return null;
    return <div className={className}>{children}</div>;
}

export function EmptyMessage({ children = "No items found.", className = "no-messages" }) {
    return <div className={className}>{children}</div>;
}
