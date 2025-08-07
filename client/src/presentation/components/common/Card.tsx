import React, { ReactNode, CSSProperties } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export default function Card({ children, className = '', style = {} }: CardProps) {
    return (
        <div className={`card ${className}`} style={style}>
            {children}
        </div>
    );
}
