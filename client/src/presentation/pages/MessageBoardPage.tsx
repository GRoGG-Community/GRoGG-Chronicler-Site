import React from 'react';
import '../styles/Boards.css';
import MessageBoardController from '../../business/controllers/MessageBoardController';
import { LoadingMessage, EmptyMessage } from '../components/common/Messages';
import useAccount from '../../business/hooks/application/useAccount';
import EmpireDataController from '../../business/controllers/EmpireDataController';
import { Empire } from '../../data/models/Empire';
import MessageList from '../components/common/MessageListContainer';

export default function MessageBoardPageWrapper() {
    const { account } = useAccount();

    return (
        <EmpireDataController>
            {({ empires, loading }: { empires: Empire[], loading: boolean }) => {
                if (loading) {
                    return <LoadingMessage>Loading empires...</LoadingMessage>;
                }

                return <MessageBoardPageUI 
                    account={account ? { username: account.name } : null} 
                    empires={empires} 
                />;
            }}
        </EmpireDataController>
    );
}

interface MessageBoardPageProps {
    account: { username: string } | null;
    empires: Empire[];
}

interface MessageBoardControllerProps {
    selected: string | null;
    setSelected: (pair: [string, string]) => void;
    filteredBoards: [string, string][];
    messages: Record<string, any[]>;
    setMessages: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    postMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    handleDeleteMessage: (boardKey: string, msgIdx: number) => void;
    handleEditMessage: (boardKey: string, idx: number, currentText: string) => void;
    handleEditOriginalTooltip: (boardKey: string, idx: number, originalText: string) => void;
    handleEditMsgSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleEditMsgCancel: () => void;
    editMsgIdx: number | null;
    editMsgText: string;
    setEditMsgText: React.Dispatch<React.SetStateAction<string>>;
    editMsgOriginal: boolean;
    getLinkedBoards: () => [string, string][];
    getEmpireAccount: (empireName: string) => string | null;
    account: { username: string };
    empires: Empire[];
}


const MessageBoardPageUI: React.FC<MessageBoardPageProps> = ({ account, empires }) => {
    if (!account || !empires) return <LoadingMessage>Loading...</LoadingMessage>;

    return (
        <MessageBoardController account={account} empires={empires}>
            {({
                selected,
                setSelected,
                filteredBoards,
                messages,
                setMessages,
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
                editMsgOriginal,
                getLinkedBoards,
                getEmpireAccount,
                account,
                empires,
            }: MessageBoardControllerProps) => (
                <section className="channels-main">
                    <aside className="channels-sidebar">
                        <div className="boards-list">
                            <h2>Diplomatic Channels</h2>
                            <ul className="boards-list-ul">
                                {filteredBoards.length === 0 && (
                                    <li className="no-channels"><EmptyMessage>No available channels.</EmptyMessage></li>
                                )}
                                {filteredBoards.map((pair: [string, string]) => {
                                    const key = pair.join('|');
                                    return (
                                        <li className={`boards-list-item${key === selected ? ' active' : ''}`} key={key}>
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
                                            account={account}
                                            gmPermissions={{ canDeleteMessages: account.username === 'GameMaster' }}
                                            handleDeleteMessage={handleDeleteMessage}
                                            handleEditMessage={handleEditMessage}
                                            handleEditOriginalTooltip={handleEditOriginalTooltip}
                                            messagesEndRef={messagesEndRef}
                                        />
                                        <form className="message-form" onSubmit={postMessage}>
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
    );
};
