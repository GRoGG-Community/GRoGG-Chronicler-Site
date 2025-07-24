import React, { useRef, useEffect } from 'react';
import ActionButton from './ActionButton';
import ListContainer from './ListContainer';
import { EmptyMessage } from './Messages';

export default function MessageList({
    messages,
    selected,
    account,
    gmPermissions,
    handleDeleteMessage
}) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!selected) return;
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages, selected]);

    if (!selected || !messages) return null;

    return (
        <ListContainer emptyMessage={<EmptyMessage>No messages yet.</EmptyMessage>}>
            <ul className="messages-list">
                {messages.map((msg, i) => {
                    const [partnerA, partnerB] = selected.split('|');
                    let partnerClass = '';
                    if (msg.author === partnerA) partnerClass = 'message-partnerA';
                    else if (msg.author === partnerB) partnerClass = 'message-partnerB';
                    return (
                        <li
                            key={i}
                            className={`message-item ${partnerClass}`}
                            style={{
                                display: 'flex',
                                alignItems: 'stretch',
                                justifyContent: 'flex-start',
                                gap: '0.7rem'
                            }}
                        >
                            <div style={{
                                flex: 1,
                                minWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.15rem',
                                justifyContent: 'center'
                            }}>
                                <div className="message-meta" style={{marginBottom: 0}}>
                                    <span className="message-author">{msg.author}</span>
                                    <small className="message-date">{new Date(msg.timestamp).toLocaleString()}</small>
                                </div>
                                <div className="message-text">{msg.text}</div>
                            </div>
                            {account && account.username === "GameMaster" && gmPermissions.canDeleteMessages && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '2.5em',
                                    paddingLeft: '0.5em'
                                }}>
                                    <ActionButton
                                        variant="danger"
                                        title="Delete message"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ff4d4d',
                                            cursor: 'pointer',
                                            fontSize: '1.3em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '2.2em'
                                        }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleDeleteMessage(selected, i);
                                        }}
                                    >
                                        <span role="img" aria-label="Delete">&#128465;</span>
                                    </ActionButton>
                                </div>
                            )}
                        </li>
                    );
                })}
                <div ref={messagesEndRef} />
            </ul>
        </ListContainer>
    );
}
