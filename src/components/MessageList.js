import React, { useRef, useState } from 'react';
import ActionButton from './ActionButton';
import ListContainer from './ListContainer';
import { EmptyMessage } from './Messages';

export default function MessageList({
    messages,
    selected,
    account,
    gmPermissions,
    handleDeleteMessage,
    handleEditMessage,
    handleEditOriginalTooltip,
    messagesEndRef
}) {
    if (!selected || !messages) return null;

    const buttonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.1em',
        padding: 0,
        minWidth: '2em',
        minHeight: '2em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    // Tooltip styling
    const tooltipStyle = {
        position: 'fixed',
        left: '50%',
        bottom: '18%',
        transform: 'translateX(-50%)',
        background: 'var(--card-bg)',
        color: 'var(--text)',
        border: '2px solid var(--accent)',
        borderRadius: '10px',
        boxShadow: '0 4px 24px #0007',
        padding: '1em 1.2em',
        fontSize: '1.05em',
        zIndex: 4000,
        minWidth: '220px',
        maxWidth: '420px',
        whiteSpace: 'pre-line',
        marginTop: 0,
        fontStyle: 'italic'
    };

    return (
        <ListContainer emptyMessage={<EmptyMessage>No messages yet.</EmptyMessage>}>
            <ul className="messages-list">
                {messages.map((msg, i) => {
                    const [partnerA, partnerB] = selected.split('|');
                    let partnerClass = '';
                    if (msg.author === partnerA) partnerClass = 'message-partnerA';
                    else if (msg.author === partnerB) partnerClass = 'message-partnerB';
                    const canEdit = account && (account.username === msg.author || account.username === "GameMaster");
                    const isEdited = msg.originalText && msg.originalText !== msg.text;
                    const [showOriginal, setShowOriginal] = useState(false);

                    return (
                        <li
                            key={i}
                            className={`message-item ${partnerClass}`}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                gap: '0.7rem',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                flex: 1,
                                minWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.08rem',
                                justifyContent: 'center'
                            }}>
                                <div
                                    className="message-meta"
                                    style={{
                                        marginBottom: 0,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        width: '100%'
                                    }}
                                >
                                    <span className="message-author">{msg.author}</span>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                                        <small className="message-date">{new Date(msg.timestamp).toLocaleString()}</small>
                                        {canEdit && (
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.15em',
                                                marginTop: '0.2em'
                                            }}>
                                                <ActionButton
                                                    variant="primary"
                                                    title="Edit message"
                                                    style={{
                                                        ...buttonStyle,
                                                        color: '#00bfff'
                                                    }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleEditMessage(selected, i, msg.text);
                                                    }}
                                                >
                                                    <span role="img" aria-label="Edit">&#9998;</span>
                                                </ActionButton>
                                                {account && account.username === "GameMaster" && msg.originalText && (
                                                    <ActionButton
                                                        variant="secondary"
                                                        title="Edit original message"
                                                        style={{
                                                            ...buttonStyle,
                                                            color: '#ffb300'
                                                        }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleEditOriginalTooltip(selected, i, msg.originalText);
                                                        }}
                                                    >
                                                        <span role="img" aria-label="Edit Tooltip">&#128221;</span>
                                                    </ActionButton>
                                                )}
                                                {account && account.username === "GameMaster" && gmPermissions.canDeleteMessages && (
                                                    <ActionButton
                                                        variant="danger"
                                                        title="Delete message"
                                                        style={{
                                                            ...buttonStyle,
                                                            color: '#ff4d4d'
                                                        }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleDeleteMessage(selected, i);
                                                        }}
                                                    >
                                                        <span role="img" aria-label="Delete" style={{fontSize: '1.2em'}}>&#128465;</span>
                                                    </ActionButton>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="message-text"
                                    title={undefined}
                                    style={{
                                        cursor: isEdited ? 'pointer' : 'default',
                                        display: 'inline-block',
                                        position: 'relative'
                                    }}
                                >
                                    <span>
                                        {isEdited && showOriginal ? (
                                            <span
                                                style={{
                                                    display: 'block',
                                                    background: 'rgba(0,191,255,0.10)',
                                                    border: '2px solid var(--accent)',
                                                    borderRadius: '8px',
                                                    color: 'var(--accent)',
                                                    fontStyle: 'italic',
                                                    fontWeight: 'bold',
                                                    padding: '0.7em 1em',
                                                    marginBottom: '0.3em',
                                                    marginTop: '0.1em'
                                                }}
                                            >
                                                <span style={{fontWeight:'bold'}}>Original message:</span>
                                                <br />
                                                {msg.originalText}
                                            </span>
                                        ) : (
                                            msg.text
                                        )}
                                    </span>
                                    {isEdited && (
                                        <button
                                            type="button"
                                            style={{
                                                fontSize: '0.85em',
                                                fontStyle: 'italic',
                                                color: showOriginal ? 'var(--accent)' : '#aaa',
                                                marginLeft: 0,
                                                marginTop: '0.3em',
                                                lineHeight: '1.2',
                                                display: 'block',
                                                position: 'relative',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                textDecoration: showOriginal ? 'underline' : 'underline dotted',
                                                fontWeight: showOriginal ? 'bold' : 'normal',
                                                transition: 'color 0.2s, text-decoration 0.2s',
                                                opacity: 0.92
                                            }}
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
                })}
                <div ref={messagesEndRef} />
            </ul>
        </ListContainer>
    );
}
