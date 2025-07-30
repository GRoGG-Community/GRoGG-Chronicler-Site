import { LoadingMessage, EmptyMessage } from './Messages';

export default function ListContainer({
    loading,
    emptyMessage = "No items found.",
    children,
    className = "",
    style = {}
}) {
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
