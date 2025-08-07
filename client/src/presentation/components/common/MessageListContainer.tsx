import React, { useRef, useState, RefObject, MouseEvent } from 'react';
import ActionButton from './ActionButton';
import ListContainer from './ListContainer';
import { EmptyMessage } from './Messages';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
    author: string;
    timestamp: string;
    text: string;
    originalText?: string;
}

interface Account {
    username: string;
}

interface GMPermissions {
    canDeleteMessages: boolean;
}

interface MessageListProps {
    messages: Message[];
    selected: string;
    account: Account | null;
    gmPermissions: GMPermissions;
    handleDeleteMessage: (selected: string, index: number) => void;
    handleEditMessage: (selected: string, index: number, text: string) => void;
    handleEditOriginalTooltip: (boardKey: string, idx: number, originalText: string) => void;
    messagesEndRef: RefObject<HTMLDivElement>;
}

export default function MessageList({
    messages,
    selected,
    account,
    gmPermissions,
    handleDeleteMessage,
    handleEditMessage,
    handleEditOriginalTooltip,
    messagesEndRef
}: MessageListProps) {
    if (!selected || !messages) return null;
    if (!Array.isArray(messages)) messages = [];

    return (
        <ListContainer loading={false} emptyMessage="No messages yet.">
            <ul className="messages-list btt-messages-list">
                {messages.map((msg, i) => {
                    const [partnerA, partnerB] = selected.split('|');
                    let isOwn = account && msg.author === account.username;
                    let isGM = account && account.username === 'GameMaster';
                    let alignClass = isOwn ? 'btt-message-own' : 'btt-message-other';
                    const canEdit = account && (account.username === msg.author || isGM);
                    const isEdited = msg.originalText && msg.originalText !== msg.text;
                    return (
                        <li
                            key={i}
                            className={`btt-message-item ${alignClass}`}
                        >
                            <div className="btt-message-avatar">
                                <span>{msg.author[0]?.toUpperCase()}</span>
                            </div>
                            <div className="btt-message-bubble">
                                <div className="btt-message-meta">
                                    <span className="btt-message-author">{msg.author}</span>
                                    <span className="btt-message-date">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="btt-message-text">
                                    <MarkdownRenderer markdown={msg.text} />
                                    {isEdited && <span className="btt-message-edited">(edited)</span>}
                                </div>
                                <div className="btt-message-actions">
                                    {canEdit && (
                                        <>
                                            <ActionButton
                                                variant="primary"
                                                title="Edit message"
                                                className="btt-edit-btn"
                                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    handleEditMessage(selected, i, msg.text);
                                                }}
                                            >
                                                <span role="img" aria-label="Edit">✏️</span>
                                            </ActionButton>
                                            {isGM && gmPermissions.canDeleteMessages && (
                                                <ActionButton
                                                    variant="danger"
                                                    title="Delete message"
                                                    className="btt-delete-btn"
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        handleDeleteMessage(selected, i);
                                                    }}
                                                >
                                                    <span role="img" aria-label="Delete">🗑️</span>
                                                </ActionButton>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
                <div ref={messagesEndRef} />
            </ul>
        </ListContainer>
    );
}

interface MessageItemProps {
    msg: Message;
    index: number;
    partnerClass: string;
    canEdit: boolean;
    isEdited: boolean;
    selected: string;
    account: Account | null;
    gmPermissions: GMPermissions;
    handleDeleteMessage: (selected: string, index: number) => void;
    handleEditMessage: (selected: string, index: number, text: string) => void;
    handleEditOriginalTooltip: (boardKey: string, idx: number, originalText: string) => void;
}

function MessageItem({
    msg,
    index,
    partnerClass,
    canEdit,
    isEdited,
    selected,
    account,
    gmPermissions,
    handleDeleteMessage,
    handleEditMessage,
    handleEditOriginalTooltip
}: MessageItemProps) {
    const [showOriginal, setShowOriginal] = useState(false);

    // All button and message styling is now handled by CSS classes only.

    return (
        <li className={`message-item ${partnerClass}`}>
            <div className="message-content">
                <div className="message-meta">
                    <span className="message-author">{msg.author}</span>
                    <div className="message-meta-actions">
                        <small className="message-date">{new Date(msg.timestamp).toLocaleString()}</small>
                        {canEdit && (
                            <span className="message-action-btns">
                                <ActionButton
                                    variant="primary"
                                    title="Edit message"
                                    className="btt-edit-btn"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        handleEditMessage(selected, index, msg.text);
                                    }}
                                >
                                    <span role="img" aria-label="Edit">✏️</span>
                                </ActionButton>
                                {account && account.username === "GameMaster" && msg.originalText && (
                                    <ActionButton
                                        variant="secondary"
                                        title="Edit original message"
                                        className="btt-edit-original-btn"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            handleEditOriginalTooltip(selected, index, msg.originalText || '');
                                        }}
                                    >
                                        <span role="img" aria-label="Edit Tooltip">📝</span>
                                    </ActionButton>
                                )}
                                {account && account.username === "GameMaster" && gmPermissions.canDeleteMessages && (
                                    <ActionButton
                                        variant="danger"
                                        title="Delete message"
                                        className="btt-delete-btn"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            handleDeleteMessage(selected, index);
                                        }}
                                    >
                                        <span role="img" aria-label="Delete">🗑️</span>
                                    </ActionButton>
                                )}
                            </span>
                        )}
                    </div>
                </div>
                <div className="message-text">
                    <span>
                        {isEdited && showOriginal ? (
                            <span className="message-original-text">
                                <span className="message-original-label">Original message:</span>
                                <br />
                                <MarkdownRenderer markdown={msg.originalText} />
                            </span>
                        ) : (
                            <MarkdownRenderer markdown={msg.text} />
                        )}
                    </span>
                    {isEdited && (
                        <button
                            type="button"
                            className={`message-edited-btn${showOriginal ? ' active' : ''}`}
                            onClick={() => setShowOriginal(v => !v)}
                            aria-pressed={showOriginal}
                            tabIndex={0}
                            title="Click to show/hide original message"
                        >
                            {showOriginal ? 'Hide original' : '(edited)'}
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
}
