import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useConfirmDelete } from '../hooks/infrastructure/useCommonUtilities';
import { Empire } from '../../data/models/Empire';
import { APP_CONSTANTS } from '../../infrastructure/constants/app.constants';
import { MessageBusinessService } from '../services/MessageBusinessService';
import { StorageService } from '../../infrastructure/storage/StorageService';
import { getNationPairs } from '../utils/empirePairUtils';

interface MessageBoardControllerProps {
    account: any;
    empires: Empire[];
    children: (props: any) => React.ReactElement;
}

/**
 * MessageBoardController (Controller, Observer, Command Patterns)
 * Handles all state, data fetching, and logic for the message board/chat (diplomatic channels).
 * Exposes selected channel, messages, posting, editing, deleting, and polling logic to children (render prop).
 * Follows the Controller and Observer patterns for separation of concerns and real-time updates.
 */
export default function MessageBoardController({ account, empires, children }: MessageBoardControllerProps): React.ReactElement {
    const { confirmAction } = useConfirmDelete();
    
    // State for selected channel/board
    const [selected, setSelected] = useState<string | null>(() => {
        const saved = StorageService.getItem<string | null>('stellarisSelectedBoard', null);
        return saved;
    });
    // State for all messages per board
    const [messages, setMessages] = useState<Record<string, any[]>>({});
    // State for message input
    const [text, setText] = useState('');
    // Polling ref for interval
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    // Ref for scroll-to-bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get all possible board pairs (Strategy pattern)
    const getLinkedBoards = useCallback(() => {
        if (!empires) return [];
        const names = empires.map(e => e.name);
        return getNationPairs(names);
    }, [empires]);

    // Filter boards for current account (Strategy pattern)
    const getEmpireAccount = useCallback(
        (empireName: string) => {
            if (!empires) return null;
            const emp = empires.find(e => e.name === empireName);
            return emp && emp.account ? emp.account : null;
        },
        [empires]
    );

    const filteredBoards = useMemo(() => {
        if (!account || !empires) return [];
        if (account.username === 'GameMaster') return getLinkedBoards();
        return getLinkedBoards().filter(([a, b]) =>
            getEmpireAccount(a) === account.username || getEmpireAccount(b) === account.username
        );
    }, [account, empires, getLinkedBoards, getEmpireAccount]);

    // Board selection handler
    const handleBoardSelect = useCallback((pair: string[]) => {
        const key = pair.join('|');
        setSelected(key);
        StorageService.setItem('stellarisSelectedBoard', key);
    }, []);

    // Poll for messages in selected board
    useEffect(() => {
        if (!selected) return;
        const fetchMessages = async () => {
            try {
                const data = await MessageBusinessService.getMessagesForBoard(selected);
                setMessages(prev => ({ ...prev, [selected]: data }));
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                setMessages(prev => ({ ...prev, [selected]: [] }));
            }
        };
        fetchMessages();
        pollingRef.current = setInterval(fetchMessages, APP_CONSTANTS.MESSAGE_POLLING_INTERVAL);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [selected]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (selected && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [selected, messages]);

    // Message posting handler
    const postMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected || !account || !text.trim()) return;
        const msg = {
            board: selected,
            author: account.username,
            text,
            timestamp: Date.now()
        };
        try {
            await MessageBusinessService.createMessage(msg);
            const data = await MessageBusinessService.getMessagesForBoard(selected);
            setMessages(prev => ({ ...prev, [selected]: data }));
        } catch (error) {
            console.error('Failed to post message:', error);
        }
        setText('');
        setTimeout(() => {
            requestAnimationFrame(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }, 150);
    }, [selected, account, text]);

    // Message delete handler (GameMaster only)
    const handleDeleteMessage = useCallback(async (boardKey: string, msgIdx: number) => {
        if (!account || account.username !== 'GameMaster') return;
        if (!confirmAction('Delete this message?')) return;
        try {
            await MessageBusinessService.deleteMessage(boardKey, msgIdx);
            const data = await MessageBusinessService.getMessagesForBoard(boardKey);
            setMessages(prev => ({ ...prev, [boardKey]: data }));
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    }, [account, confirmAction]);

    // Message edit logic
    const [editMsgIdx, setEditMsgIdx] = useState<number | null>(null);
    const [editMsgText, setEditMsgText] = useState('');
    const [editMsgOriginal, setEditMsgOriginal] = useState(false);

    const handleEditMessage = useCallback((boardKey: string, idx: number, currentText: string) => {
        setEditMsgIdx(idx);
        setEditMsgText(currentText);
        setEditMsgOriginal(false);
    }, []);
    const handleEditOriginalTooltip = useCallback((boardKey: string, idx: number, originalText: string) => {
        setEditMsgIdx(idx);
        setEditMsgText(originalText);
        setEditMsgOriginal(true);
    }, []);
    const handleEditMsgSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected || editMsgIdx === null || !account) return;
        try {
            await MessageBusinessService.updateMessage(selected, editMsgIdx, editMsgText, account.username, editMsgOriginal);
            const data = await MessageBusinessService.getMessagesForBoard(selected);
            setMessages(prev => ({ ...prev, [selected]: data }));
            setEditMsgIdx(null);
            setEditMsgText('');
            setEditMsgOriginal(false);
        } catch (error) {
            console.error('Failed to edit message:', error);
        }
    }, [selected, editMsgIdx, editMsgText, editMsgOriginal, account]);
    const handleEditMsgCancel = useCallback(() => {
        setEditMsgIdx(null);
        setEditMsgText('');
        setEditMsgOriginal(false);
    }, []);

    // Expose all state and handlers to children (render prop)
    return children({
        selected,
        setSelected: handleBoardSelect,
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
        editMsgOriginal,
        getLinkedBoards,
        getEmpireAccount,
        account,
        empires,
    });
}
