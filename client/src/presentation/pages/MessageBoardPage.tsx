import React from 'react';
import MessageBoardController from '../../business/controllers/MessageBoardController';
import { StandardizedMessage } from '../components/common/StandardizedMessage';
import { LoadingMessage, EmptyMessage } from '../components/common/Messages';
import { useMessageBoardPage } from '../hooks/useMessageBoardPage';
import MessageList from '../components/common/MessageListContainer';

/**
 * MessageBoardPage (Presentation Layer)
 * Uses presentation hook and business controller for messaging functionality.
 * Maintains existing message board behavior with proper layer separation.
 * Enhanced with standardized error handling patterns.
 */
export default function MessageBoardPage() {
    const { 
        account, 
        empires, 
        loading, 
        error, 
        success, 
        clearError, 
        clearSuccess,
        postMessageWithHandling,
        deleteMessageWithHandling,
        editMessageWithHandling
    } = useMessageBoardPage();

    if (loading) {
        return <LoadingMessage>Loading empires...</LoadingMessage>;
    }

    if (!account || !empires) {
        return <LoadingMessage>Loading...</LoadingMessage>;
    }

    const typedAccount = { username: account.name };

    return (
        <div>
            {/* Standardized Success/Error Messages */}
            <StandardizedMessage 
                type="error"
                message={error || ''}
                onDismiss={clearError}
            />
            <StandardizedMessage 
                type="success"
                message={success || ''}
                onDismiss={clearSuccess}
            />
            
            <MessageBoardController account={typedAccount} empires={empires}>
            {({
                selected,
                setSelected,
                filteredBoards,
                messages,
                text,
                setText,
                postMessage,
                messagesEndRef,
                handleDeleteMessage,
                handleEditMessage,
                handleEditOriginalTooltip,
                handleEditMsgSubmit,
                handleEditMsgCancel,
                editMsgIdx,
                editMsgText,
                setEditMsgText,
                editMsgOriginal
            }) => (
                <section className="channels-main">
                    <aside className="channels-sidebar">
                        <div className="boards-list">
                            <h2>Diplomatic Channels</h2>
                            <ul className="boards-list-ul">
                                {filteredBoards.length === 0 && (
                                    <li className="no-channels">
                                        <EmptyMessage>No available channels.</EmptyMessage>
                                    </li>
                                )}
                                {filteredBoards.map((pair: [string, string]) => {
                                    const key = pair.join('|');
                                    return (
                                        <li 
                                            className={`boards-list-item${key === selected ? ' active' : ''}`} 
                                            key={key}
                                        >
                                            <button
                                                className="board-btn"
                                                onClick={() => setSelected(pair)}
                                            >
                                                <span className="board-nations">{pair[0]}</span>
                                                <span className="board-arrow">↔</span>
                                                <span className="board-nations">{pair[1]}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </aside>
                    
                    <main className="channels-content">
                        <div className="board-messages">
                            {selected ? (
                                <>
                                    <div className="board-title-row">
                                        <h3>{selected.replace('|', ' ↔ ')}</h3>
                                    </div>
                                    <div className="messages-panel">
                                        <MessageList
                                            messages={messages[selected] || []}
                                            selected={selected}
                                            account={typedAccount}
                                            gmPermissions={{ canDeleteMessages: typedAccount.username === 'GameMaster' }}
                                            handleDeleteMessage={handleDeleteMessage}
                                            handleEditMessage={handleEditMessage}
                                            handleEditOriginalTooltip={handleEditOriginalTooltip}
                                            messagesEndRef={messagesEndRef}
                                        />
                                        <form className="message-form" onSubmit={editMsgIdx !== null ? handleEditMsgSubmit : postMessage}>
                                            {editMsgIdx !== null ? (
                                                <div className="edit-message-form">
                                                    <input
                                                        type="text"
                                                        value={editMsgText}
                                                        onChange={e => setEditMsgText(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button type="submit">Save</button>
                                                    <button type="button" onClick={handleEditMsgCancel}>Cancel</button>
                                                    {editMsgOriginal && <span className="edit-original-label">Editing original</span>}
                                                </div>
                                            ) : (
                                                <div className="new-message-form">
                                                    <input
                                                        type="text"
                                                        value={text}
                                                        onChange={e => setText(e.target.value)}
                                                        placeholder="Type your message..."
                                                        autoFocus
                                                    />
                                                    <button className="send-btn" type="submit">Send</button>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <EmptyMessage>Select a channel to view messages.</EmptyMessage>
                            )}
                        </div>
                    </main>
                </section>
            )}
        </MessageBoardController>
        </div>
    );
}
