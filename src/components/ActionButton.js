import React from 'react';

const VARIANT_STYLES = {
    primary: {
        background: 'var(--accent)',
        color: '#fff'
    },
    danger: {
        background: '#ff4d4d',
        color: '#fff'
    },
    secondary: {
        background: '#555',
        color: '#fff'
    }
};

export default function ActionButton({
    children,
    onClick,
    type = 'button',
    className = '',
    disabled = false,
    style = {},
    variant = 'primary',
    ...props
}) {
    const variantStyle = VARIANT_STYLES[variant] || {};
    return (
        <button
            type={type}
            className={`action-btn ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{ ...variantStyle, ...style }}
            {...props}
        >
            {children}
        </button>
    );
}
