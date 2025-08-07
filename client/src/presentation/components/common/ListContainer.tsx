import React, { ReactNode, CSSProperties } from 'react';
import { LoadingMessage, EmptyMessage } from './Messages';

interface ListContainerProps {
    loading?: boolean;
    emptyMessage?: string;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export default function ListContainer({
    loading,
    emptyMessage = "No items found.",
    children,
    className = "",
    style = {}
}: ListContainerProps) {
    if (loading) {
        return <LoadingMessage />;
    }
    if (!children || (Array.isArray(children) && children.length === 0)) {
        return <EmptyMessage>{emptyMessage}</EmptyMessage>;
    }
    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
}
