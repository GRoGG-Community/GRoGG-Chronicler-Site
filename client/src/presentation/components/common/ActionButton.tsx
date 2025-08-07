import React, { ReactNode, MouseEvent, CSSProperties } from 'react';

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
    },
    success: {
        background: '#28a745',
        color: '#fff'
    }
} as const;

type Variant = keyof typeof VARIANT_STYLES;

interface ActionButtonProps {
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    style?: CSSProperties;
    variant?: Variant;
    [key: string]: any;
}

export default function ActionButton({
    children,
    onClick,
    type = 'button', 
    className = '',
    disabled = false,
    style = {},
    variant = 'primary',
    ...props
}: ActionButtonProps) {
    const variantStyle = VARIANT_STYLES[variant] || {};
    
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (onClick) {
            onClick(event);
        }
    };
    
    return (
        <button
            type={type}
            className={`action-btn ${className}`}
            onClick={handleClick}
            disabled={disabled}
            style={{ ...variantStyle, ...style }}
            {...props}
        >
            {children}
        </button>
    );
}
