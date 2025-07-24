// har har please send help, ohh Coding Jesus have mercy
import React, { useState, useEffect, useRef } from 'react';
import './css/App.css';
import './css/Treaties.css';
import './css/Empires.css';
import './css/Boards.css';
import './css/Accounts.css';
import { getNationPairs } from './utils/getNationPairs';
import TreatyDialog from './components/TreatyDialog';
import TreatyView from './components/TreatyView';
import EmpireEditPanel from './components/EmpireEditPanel';
import EmpirePanel from './components/EmpirePanel';
import MenuDropdown from './components/MenuDropdown';
import {
    handleCreateAccount,
    handleCreateEmpire,
    handleRenameAccount,
    handleChangePassword,
    handleDeleteAccount,
    handleDeleteEmpire
} from './handlers/handlers';
import { useBurgerMenu } from './components/BurgerMenu';
import RoadmapTab from './components/RoadmapTab';
import { TREATY_STATUSES } from './utils/treatyStatuses';
import { TREATY_STATUS_OPTIONS } from './utils/treatyStatusOptions';
import AccountList from './components/AccountList';
import MessageList from './components/MessageList';
import EmpireList from './components/EmpireList';
import TreatyList from './components/TreatyList';
import SearchSortBar from './components/SearchSortBar';
import { ErrorMessage, LoadingMessage } from './components/Messages';
import Dropdown from './components/Dropdown';
import cutOffDotter from './utils/cutOffDotter';

function App() {
    const [empires, setEmpires] = useState([]);
    const [selected, setSelected] = useState(() => {
        const saved = localStorage.getItem('stellarisSelectedBoard');
        return saved ? saved : null;
    });
    const [messages, setMessages] = useState({});
    const [text, setText] = useState('');
    const pollingRef = useRef();
    const messagesEndRef = useRef(null);
    const [accounts, setAccounts] = useState({});
    const [accountsLoaded, setAccountsLoaded] = useState(false);
    const [account, setAccount] = useState(() => {
        const saved = localStorage.getItem('stellarisAccount');
        return saved ? JSON.parse(saved) : null;
    });
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('channels');
    const [empirePage, setEmpirePage] = useState(null);
    const [editEmpire, setEditEmpire] = useState(null);
    const [empireInfo, setEmpireInfo] = useState({});

    // Account creation and management
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountPass, setNewAccountPass] = useState('');
    const [accountError, setAccountError] = useState('');
    const [accountSuccess, setAccountSuccess] = useState('');
    const [accountsTabLoading, setAccountsTabLoading] = useState(false);
    const [editAccount, setEditAccount] = useState(null);
    const [editAccountName, setEditAccountName] = useState('');
    const [editAccountPass, setEditAccountPass] = useState('');
    const [editAccountError, setEditAccountError] = useState('');
    const [editAccountLoading, setEditAccountLoading] = useState(false);

    // Manage Empires tab
    const [newEmpireName, setNewEmpireName] = useState('');
    const [newEmpireError, setNewEmpireError] = useState('');
    const [newEmpireLoading, setNewEmpireLoading] = useState(false);

    // Treaties State
    const [treaties, setTreaties] = useState([]);
    const [treatiesLoaded, setTreatiesLoaded] = useState(false);
    const [treatyDialog, setTreatyDialog] = useState({ open: false, mode: null, data: null });
    const [treatyError, setTreatyError] = useState('');
    const [treatySaving, setTreatySaving] = useState(false);

    // Treaty JSON Editor State
    const [showTreatyJsonEditor, setShowTreatyJsonEditor] = useState(false);
    const [treatyJsonText, setTreatyJsonText] = useState('');
    const [treatyJsonError, setTreatyJsonError] = useState('');
    const [treatyJsonSaving, setTreatyJsonSaving] = useState(false);

    function openTreatyJsonEditor() {
        setTreatyJsonError('');
        setTreatyJsonSaving(false);
        fetch('/treaties.json?ts=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setTreatyJsonText(JSON.stringify(data, null, 2));
                setShowTreatyJsonEditor(true);
            })
            .catch(() => {
                setTreatyJsonText('[]');
                setShowTreatyJsonEditor(true);
            });
    }
    function closeTreatyJsonEditor() {
        setShowTreatyJsonEditor(false);
        setTreatyJsonError('');
        setTreatyJsonSaving(false);
    }
    function handleTreatyJsonChange(e) {
        setTreatyJsonText(e.target.value);
        setTreatyJsonError('');
    }
    function handleTreatyJsonSubmit(e) {
        e.preventDefault();
        setTreatyJsonError('');
        setTreatyJsonSaving(true);
        let parsed;
        try {
            parsed = JSON.parse(treatyJsonText);
            if (!Array.isArray(parsed)) throw new Error("Treaties JSON must be an array.");
        } catch (err) {
            setTreatyJsonError('Invalid JSON: ' + err.message);
            setTreatyJsonSaving(false);
            return;
        }
        fetch('/api/treaties/json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setTreaties(parsed);
                setShowTreatyJsonEditor(false);
            } else {
                setTreatyJsonError(data.error || 'Failed to save treaties.json');
            }
        })
        .catch(() => setTreatyJsonError('Failed to save treaties.json'))
        .finally(() => setTreatyJsonSaving(false));
    }

    // Add search states
    const [treatySearch, setTreatySearch] = useState(() => localStorage.getItem('treatySearch') || '');
    const [empireSearch, setEmpireSearch] = useState(() => localStorage.getItem('empireSearch') || '');
    // Add sort states
    const [treatySort, setTreatySort] = useState('title');
    const [empireSort, setEmpireSort] = useState('name');

    function fetchTreaties() {
        fetch('/treaties.json?ts=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setTreaties(Array.isArray(data) ? data : []);
                setTreatiesLoaded(true);
            })
            .catch(() => setTreatiesLoaded(true));
    }
    useEffect(() => { fetchTreaties(); }, []);

    function openTreatyDialog(mode, data = null) {
        setTreatyDialog({ open: true, mode, data });
        setTreatyError('');
    }
    function closeTreatyDialog() {
        setTreatyDialog({ open: false, mode: null, data: null });
        setTreatyError('');
    }
    function handleTreatySave(form) {
        setTreatySaving(true);
        setTreatyError('');
        const payload = { ...form };
        if (!payload.title || !payload.content || !payload.participants?.length) {
            setTreatyError('Title, content, and at least one participant are required.');
            setTreatySaving(false);
            return;
        }
        if (!payload.owner) payload.owner = account?.username || '';
        if (!payload.status) payload.status = 'discussion';
        if (!payload.id) payload.id = Date.now().toString();

        fetch('/api/treaties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setTreaties(prev => {
                    const idx = prev.findIndex(t => t.id === payload.id);
                    if (idx !== -1) {
                        const updated = [...prev];
                        updated[idx] = { ...prev[idx], ...payload };
                        return updated;
                    } else {
                        return [...prev, payload];
                    }
                });
                closeTreatyDialog();
            } else {
                setTreatyError(data.error || 'Failed to save treaty');
            }
        })
        .catch(() => setTreatyError('Failed to save treaty'))
        .finally(() => setTreatySaving(false));
    }
    function handleTreatyTransferOwner(id, newOwner) {
        setTreatySaving(true);
        fetch('/api/treaties/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, newOwner })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) fetchTreaties();
        })
        .finally(() => setTreatySaving(false));
    }

    function canEditTreaty(treaty) {
        if (!account) return false;
        return account.username === treaty.owner || account.username === "GameMaster";
    }
    function canTransferTreaty(treaty) {
        return account && account.username === "GameMaster";
    }

    const {
        showMenu,
        showPermissions,
        gmPermissions,
        showRoadmap,
        handleMenuToggle,
        handleMenuClose,
        handlePermissionsToggle,
        handlePermissionChange,
        handleRoadmapToggle,
        menuDropdownRef,
        permissionsDropdownRef
    } = useBurgerMenu(account);

    useEffect(() => {
        if (
            activeTab === 'empires' &&
            !editEmpire &&
            !empirePage
        ) {
            fetch(`/empireInfo.json?ts=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    setEmpireInfo(data && typeof data === 'object' ? data : {});
                })
                .catch(() => {});
        }
    }, [activeTab, editEmpire, empirePage]);

    function getEmpireNames() {
        return empires.map(e => e.name);
    }

    function getLinkedBoards() {
        const names = getEmpireNames();
        return getNationPairs(names);
    }

    function getEmpireAccount(empireName) {
        const emp = empires.find(e => e.name === empireName);
        return emp && emp.account ? emp.account : null;
    }

    const filteredBoards = account
        ? account.username === "GameMaster"
            ? getLinkedBoards()
            : getLinkedBoards().filter(([a, b]) =>
                getEmpireAccount(a) === account.username || getEmpireAccount(b) === account.username
            )
        : [];

    function handleLinkAccount(empireName, accountName) {
        fetch('/api/empires/link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ empireName, accountName })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setEmpires(prev =>
                    prev.map(e => e.name === empireName ? { ...e, account: accountName } : e)
                );
            }
        });
    }
    function handleUnlinkAccount(empireName) {
        fetch('/api/empires/unlink', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ empireName })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setEmpires(prev =>
                    prev.map(e => e.name === empireName ? { ...e, account: null } : e)
                );
            }
        });
    }
    function handleBoardSelect(pair) {
        const key = pair.join('|');
        setSelected(key);
        localStorage.setItem('stellarisSelectedBoard', key);
    }

    useEffect(() => {
        if (
            !selected ||
            activeTab !== 'channels' ||
            editEmpire ||
            empirePage
        ) {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        const key = selected;

        const fetchMessages = () => {
            fetch(`/api/messages?board=${encodeURIComponent(key)}`)
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(data => {
                    setMessages(prev => ({
                        ...prev,
                        [key]: data
                    }));
                })
                .catch((err) => {
                    setMessages(prev => ({
                        ...prev,
                        [key]: []
                    }));
                    console.error('Failed to fetch messages:', err);
                });
        };

        fetchMessages();

        pollingRef.current = setInterval(fetchMessages, 2000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [selected, activeTab, editEmpire, empirePage]);

    const prevMessagesLengthRef = useRef(0);
    useEffect(() => {
        if (!selected) return;
        const currentMessages = messages[selected] || [];
        if (currentMessages.length !== prevMessagesLengthRef.current) {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
            }
            prevMessagesLengthRef.current = currentMessages.length;
        }
    }, [messages, selected]);

    function postMessage(e) {
        e.preventDefault();
        if (!selected || !account || !text.trim()) return;
        const key = selected;
        const msg = {
            board: key,
            author: account.username,
            text,
            timestamp: Date.now()
        };
        fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg)
        })
        .then(res => res.json())
        .then(() => {
            fetch(`/api/messages?board=${encodeURIComponent(key)}`)
                .then(res => res.json())
                .then(data => {
                    setMessages(prev => ({
                        ...prev,
                        [key]: data
                    }));
                });
        });
        setText('');
    }

    useEffect(() => {
        const url = '/accounts.json?ts=' + Date.now();
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .then(data => {
                if (!data || typeof data !== 'object' || Array.isArray(data)) {
                    setAccounts({});
                    setError("Accounts data is invalid or missing.");
                } else {
                    setAccounts(data);
                    setError('');
                }
                setAccountsLoaded(true);
            })
            .catch(err => {
                setAccounts({});
                setError(`Failed to load accounts: ${err.message}`);
                setAccountsLoaded(true);
            });
    }, []);

    useEffect(() => {
        fetch('/empires.json')
            .then(res => res.json())
            .then(data => {
                setEmpires(Array.isArray(data) ? data : []);
            });
    }, []);

    useEffect(() => {
        fetch('/treaties.json')
            .then(res => res.json())
            .then(data => {
                setTreaties(Array.isArray(data) ? data : []);
                setTreatiesLoaded(true);
            })
            .catch(() => setTreatiesLoaded(true));
    }, []);

    function handleLogin(e) {
        e.preventDefault();
        if (!accountsLoaded) {
            setError('Accounts are still loading, please wait...');
            return;
        }
        const username = loginUser.trim();
        const password = loginPass.trim();
        if (!accounts[username]) {
            setError('Invalid credentials');
            return;
        }
        if (accounts[username] !== password) {
            setError('Invalid credentials');
            return;
        }
        setAccount({ username });
        localStorage.setItem('stellarisAccount', JSON.stringify({ username }));
        setError('');
    }

    function handleLogout() {
        setAccount(null);
        localStorage.removeItem('stellarisAccount');
        setActiveTab('channels');
        setEmpirePage(null);
        setEditEmpire(null);
        setEditAccount(null);
        setTreatyDialog({ open: false, mode: null, data: null });
    }

    function saveEmpireInfo(name, info) {
        return fetch('/api/empireInfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, info })
        })
        .then(res => res.json())
        .then(() => {
            return fetch(`/empireInfo.json?ts=${Date.now()}`)
                .then(res => res.json())
                .then(data => {
                    setEmpireInfo(data && typeof data === 'object' ? data : {});
                });
        });
    }

    function EmpireEditPanel({ name, onCancel }) {
        const info = empireInfo[name] || {};
        const [edit, setEdit] = useState(info);

        function handleChange(e) {
            setEdit({ ...edit, [e.target.name]: e.target.value });
        }
        function handleSave(e) {
            e.preventDefault();
            saveEmpireInfo(name, edit).then(() => {
                onCancel();
            });
        }

        return (
            <form className="empire-edit-form" onSubmit={handleSave}>
                <label>
                    Lore:
                    <textarea
                        name="lore"
                        value={edit.lore || ''}
                        onChange={handleChange}
                        rows={3}
                    />
                </label>
                <label>
                    Stats:
                    <input name="stats" value={edit.stats || ''} onChange={handleChange} />
                </label>
                <label>
                    Ethics:
                    <input name="ethics" value={edit.ethics || ''} onChange={handleChange} />
                </label>
                <label>
                    Civics:
                    <input name="civics" value={edit.civics || ''} onChange={handleChange} />
                </label>
                <label>
                    Special Info:
                    <input name="special" value={edit.special || ''} onChange={handleChange} />
                </label>
                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <button type="submit" className="empire-save-btn">Save</button>
                    <button type="button" className="empire-back-btn" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        );
    }

    function canEditTreaty(treaty) {
        if (!account) return false;
        return account.username === treaty.owner || account.username === "GameMaster";
    }
    function canTransferTreaty(treaty) {
        return account && account.username === "GameMaster";
    }

    function handleAddTreaty() {
        setTreatyDialog({
            open: true,
            mode: 'new',
            data: null
        });
        setTreatyError('');
    }

    function handleEditTreaty(treaty) {
        setTreatyDialog({
            open: true,
            mode: 'edit',
            data: treaty
        });
        setTreatyError('');
    }

    function handleViewTreaty(treaty) {
        setTreatyDialog({
            open: true,
            mode: 'view',
            data: treaty
        });
        setTreatyError('');
    }

    function handleCancelTreatyForm() {
        setTreatyDialog({
            open: false,
            mode: null,
            data: null
        });
        setTreatyError('');
    }

    function handleSaveTreaty(e) {
        e.preventDefault();
        setTreatyError('');
        setTreatySaving(true);
        const isEdit = treatyEditId != null;
        const form = { ...treatyForm };
        if (!form.title.trim() || !form.content.trim() || !form.participants.length) {
            setTreatyError('Title, content, and at least one participant are required.');
            setTreatySaving(false);
            return;
        }
        if (!form.owner) form.owner = account ? account.username : '';
        if (!form.status) form.status = 'discussion';
        if (!form.id) form.id = isEdit ? treatyEditId : Date.now().toString();

        fetch('/api/treaties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                return fetch('/treaties.json?ts=' + Date.now())
                    .then(res => res.json())
                    .then(data2 => {
                        setTreaties(Array.isArray(data2) ? data2 : []);
                        setTreatyForm(null);
                        setTreatyEditId(null);
                        setShowTreatyForm(false);
                        setTreatyViewId(form.id);
                    });
            } else {
                setTreatyError(data.error || 'Failed to save treaty');
            }
        })
        .catch(() => setTreatyError('Failed to save treaty'))
        .finally(() => setTreatySaving(false));
    }

    function handleTransferTreatyOwner(treaty, newOwner) {
        if (!canTransferTreaty(treaty)) return;
        setTreatySaving(true);
        fetch('/api/treaties/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: treaty.id, newOwner })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                return fetch('/treaties.json')
                    .then(res => res.json())
                    .then(data2 => setTreaties(Array.isArray(data2) ? data2 : []));
            }
        })
        .finally(() => setTreatySaving(false));
    }

    function handleTreatyFormChange(e) {
        const { name, value, type, options } = e.target;
        if (type === 'select-multiple') {
            const vals = Array.from(options).filter(o => o.selected).map(o => o.value);
            setTreatyForm(f => ({ ...f, [name]: vals }));
        } else {
            setTreatyForm(f => ({ ...f, [name]: value }));
        }
    }

    function renderTreatyForm() {
        if (!treatyForm) return null;
        return (
            <form className="treaty-form card" onSubmit={handleSaveTreaty}>
                <div className="treaty-form-header">
                    <input
                        name="title"
                        placeholder="Treaty Title"
                        value={treatyForm.title}
                        onChange={handleTreatyFormChange}
                        className="login-input"
                        required
                        disabled={treatySaving}
                    />
                    <Dropdown
                        value={treatyForm.status}
                        onChange={handleTreatyFormChange}
                        options={TREATY_STATUS_OPTIONS}
                        placeholder="Select status..."
                        className="login-input"
                        disabled={treatySaving}
                    />
                </div>
                <div className="treaty-form-participants">
                    <div className="participants-select">
                        <label className="participants-label">Participants</label>
                        <select
                            name="participants"
                            value={treatyForm.participants}
                            onChange={handleTreatyFormChange}
                            className="login-input"
                            multiple
                            disabled={treatySaving}
                        >
                            {getEmpireNames().map(e => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>
                    </div>
                    {account && account.username === "GameMaster" && (
                        <div className="owner-select">
                            <label className="owner-label">Owner:</label>
                            <Dropdown
                                value={treatyForm.owner}
                                onChange={handleTreatyFormChange}
                                options={Object.keys(accounts).map(acc => ({ value: acc, label: acc }))}
                                placeholder="Select owner..."
                                className="login-input"
                                disabled={treatySaving}
                            />
                        </div>
                    )}
                </div>
                <label className="treaty-content-label">Treaty Content</label>
                <textarea
                    name="content"
                    placeholder="Treaty Content"
                    value={treatyForm.content}
                    onChange={handleTreatyFormChange}
                    className="login-input"
                    rows={9}
                    required
                />
                <div className="treaty-form-actions">
                    <button type="submit" className="empire-save-btn" disabled={treatySaving}>
                        {treatyEditId ? "Save Changes" : "Create Treaty"}
                    </button>
                    <button type="button" className="empire-back-btn" onClick={handleCancelTreatyForm} disabled={treatySaving}>Cancel</button>
                    {treatyError && <ErrorMessage className="treaty-error">{treatyError}</ErrorMessage>}
                </div>
            </form>
        );
    }

    function renderTreatyView(treaty) {
        const statusObj = TREATY_STATUSES.find(s => s.value === treaty.status);
        return (
            <div className="treaty-view card">
                <div className="treaty-view-header">
                    <h2 className="treaty-title">{treaty.title}</h2>
                    <span className="treaty-status" style={{color: statusObj.color}}>{statusObj ? statusObj.label : treaty.status}</span>
                </div>
                <div className="treaty-view-owner">
                    Owner: {treaty.owner}
                </div>
                <div className="treaty-view-participants">
                    <b>Participants:</b> {treaty.participants && treaty.participants.length > 0 ? treaty.participants.join(', ') : <i>None</i>}
                </div>
                <div className="treaty-content-static">
                    {treaty.content}
                </div>
                <div className="treaty-view-actions">
                    <button className="empire-back-btn" onClick={() => setTreatyViewId(null)}>Back</button>
                    {canEditTreaty(treaty) && (
                        <button className="empire-save-btn" onClick={() => handleEditTreaty(treaty)}>Edit</button>
                    )}
                    {canTransferTreaty(treaty) && (
                        <select
                            value={treaty.owner}
                            onChange={e => handleTransferTreatyOwner(treaty, e.target.value)}
                            className="owner-transfer-select"
                        >
                            {Object.keys(accounts).map(acc => (
                                <option key={acc} value={acc}>{acc}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        );
    }

    const showAccountsTab = account && account.username === "GameMaster";
    const tabs = [
        { key: 'channels', label: 'Channels' },
        { key: 'empires', label: 'Empires' },
        { key: 'treaties', label: 'Treaties' }
    ];
    if (showAccountsTab) {
        tabs.push({ key: 'accounts', label: 'Manage Accounts' });
        tabs.push({ key: 'manage-empires', label: 'Manage Empires' });
    }

    const accountEditPanelRef = useRef(null);

    useEffect(() => {
        if (editAccount && accountEditPanelRef.current) {
            accountEditPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [editAccount]);

    function handleDeleteMessage(boardKey, msgIdx) {
        if (!account || account.username !== "GameMaster" || !gmPermissions.canDeleteMessages) return;
        if (!window.confirm("Delete this message?")) return;
        fetch('/api/messages/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board: boardKey, index: Number(msgIdx) })
        })
        .then(res => res.json())
        .then(() => {
            fetch(`/api/messages?board=${encodeURIComponent(boardKey)}`)
                .then(res => res.json())
                .then(data => {
                    setMessages(prev => ({
                        ...prev,
                        [boardKey]: data
                    }));
                });
        });
    }

    const filteredTreaties = treatySearch.trim()
        ? treaties.filter(t =>
            (t.title && t.title.toLowerCase().includes(treatySearch.toLowerCase())) ||
            (t.content && t.content.toLowerCase().includes(treatySearch.toLowerCase())) ||
            (t.owner && t.owner.toLowerCase().includes(treatySearch.toLowerCase())) ||
            (Array.isArray(t.participants) && t.participants.some(p => p.toLowerCase().includes(treatySearch.toLowerCase())))
        )
        : treaties;
    const sortedTreaties = [...filteredTreaties].sort((a, b) => {
        if (treatySort === 'title') return a.title.localeCompare(b.title);
        if (treatySort === 'owner') return a.owner.localeCompare(b.owner);
        return 0;
    });

    const filteredEmpires = empireSearch.trim()
        ? getEmpireNames().filter(e => e.toLowerCase().includes(empireSearch.toLowerCase()))
        : getEmpireNames();
    const sortedEmpires = [...filteredEmpires].sort((a, b) => {
        if (empireSort === 'name') return a.localeCompare(b);
        return 0;
    });

    if (!account) {
        return (
            <div className="app-container">
                <header className="header">
                    <h1>Stellaris RP Chronicler</h1>
                </header>
                <main className="main-content">
                    <section className="account-section card">
                        <h2 className="login-title">Login</h2>
                        <form onSubmit={handleLogin} className="account-form login-form">
                            <div className="login-fields">
                                <input
                                    placeholder="Empire name"
                                    value={loginUser}
                                    onChange={e => setLoginUser(e.target.value)}
                                    required
                                    disabled={!accountsLoaded}
                                    className="login-input"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={loginPass}
                                    onChange={e => setLoginPass(e.target.value)}
                                    required
                                    disabled={!accountsLoaded}
                                    className="login-input"
                                />
                            </div>
                            <button type="submit" disabled={!accountsLoaded} className="login-btn">Login</button>
                        </form>
                        {!accountsLoaded && !error && <LoadingMessage>Loading accounts...</LoadingMessage>}
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                    </section>
                </main>
                <footer className="footer">
                    <span>Stellaris RP Chronicler &copy; {new Date().getFullYear()}</span>
                </footer>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="header">
                <h1>Stellaris RP Chronicler</h1>
                <div className="tabs-bar">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setEmpirePage(null);
                                setEditEmpire(null);
                                setEditAccount(null);
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <MenuDropdown
                        showMenu={showMenu}
                        showPermissions={showPermissions}
                        showRoadmap={showRoadmap}
                        handleMenuToggle={handleMenuToggle}
                        handleLogout={handleLogout}
                        account={account}
                        handlePermissionsToggle={handlePermissionsToggle}
                        gmPermissions={gmPermissions}
                        handlePermissionChange={handlePermissionChange}
                        handleRoadmapToggle={handleRoadmapToggle}
                        menuDropdownRef={menuDropdownRef}
                        permissionsDropdownRef={permissionsDropdownRef}
                    />
                </div>
            </header>
            <main className="main-content">
                {showRoadmap ? (
                    <RoadmapTab onClose={handleRoadmapToggle} />
                ) : activeTab === 'treaties' ? (
                    <section className="treaties-section card">
                        <div className="treaties-header">
                            <h2>Treaties, Contracts & Agreements</h2>
                            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                {account && (
                                    <button
                                        className="empire-save-btn"
                                        onClick={() => openTreatyDialog('new')}
                                    >
                                        + Add New Treaty
                                    </button>
                                )}
                                {account && account.username === "GameMaster" && (
                                    <button
                                        className="empire-save-btn"
                                        style={{background: '#555'}}
                                        onClick={openTreatyJsonEditor}
                                        title="Edit treaties.json directly"
                                    >
                                        Edit treaties.json
                                    </button>
                                )}
                            </div>
                        </div>
                        {showTreatyJsonEditor && account && account.username === "GameMaster" && (
                            <div className="modal-overlay" onClick={closeTreatyJsonEditor}>
                                <div className="modal-content" style={{maxWidth: 900, width: '98vw'}} onClick={e => e.stopPropagation()}>
                                    <h2>treaties.json Editor</h2>
                                    <form onSubmit={handleTreatyJsonSubmit}>
                                        <textarea
                                            value={treatyJsonText}
                                            onChange={handleTreatyJsonChange}
                                            rows={24}
                                            style={{
                                                width: '100%',
                                                fontFamily: 'monospace',
                                                fontSize: '1em',
                                                borderRadius: 8,
                                                border: '1.5px solid var(--accent)',
                                                background: 'var(--primary-bg)',
                                                color: 'var(--text)',
                                                marginBottom: '1em'
                                            }}
                                            spellCheck={false}
                                            disabled={treatyJsonSaving}
                                        />
                                        {treatyJsonError && <ErrorMessage>{treatyJsonError}</ErrorMessage>}
                                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                                            <button
                                                type="button"
                                                className="empire-back-btn"
                                                style={{background: '#555'}}
                                                onClick={closeTreatyJsonEditor}
                                                disabled={treatyJsonSaving}
                                            >Cancel</button>
                                            <button
                                                type="submit"
                                                className="empire-save-btn"
                                                disabled={treatyJsonSaving}
                                            >Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        <SearchSortBar
                            searchValue={treatySearch}
                            onSearchChange={setTreatySearch}
                            onClearSearch={() => setTreatySearch('')}
                            sortValue={treatySort}
                            onSortChange={setTreatySort}
                            sortOptions={[
                                { value: 'title', label: 'Sort by Title' },
                                { value: 'owner', label: 'Sort by Owner' }
                            ]}
                            placeholder="Search treaties by title, content, owner, or participant..."
                            searchClass="treaty-search-input"
                            sortClass="treaty-sort-select"
                        />
                        {treatyDialog.open && treatyDialog.mode !== 'view' && (
                            <TreatyDialog
                                open={treatyDialog.open}
                                mode={treatyDialog.mode}
                                data={treatyDialog.data}
                                onSave={handleTreatySave}
                                onClose={closeTreatyDialog}
                                error={treatyError}
                                saving={treatySaving}
                                empires={empires.map(e => e.name)}
                                accounts={accounts}
                                account={account}
                            />
                        )}
                        {treatyDialog.open && treatyDialog.mode === 'view' && (
                            <TreatyView
                                treaty={treatyDialog.data}
                                onBack={closeTreatyDialog}
                                onEdit={() => openTreatyDialog('edit', treatyDialog.data)}
                                onTransfer={newOwner => handleTreatyTransferOwner(treatyDialog.data.id, newOwner)}
                                canEdit={canEditTreaty(treatyDialog.data)}
                                canTransfer={canTransferTreaty(treatyDialog.data)}
                                accounts={accounts}
                            />
                        )}
                        <TreatyList
                            treaties={sortedTreaties}
                            loaded={treatiesLoaded}
                            onView={treaty => setTreatyDialog({ open: true, mode: 'view', data: treaty })}
                            canEditTreaty={canEditTreaty}
                            onEdit={openTreatyDialog}
                        />
                    </section>
                ) : activeTab === 'manage-empires' && showAccountsTab ? (
                    <section className="account-manage-section card">
                        <h2>Manage Empires</h2>
                        <form
                            onSubmit={e => handleCreateEmpire(
                                e,
                                newEmpireName,
                                empires,
                                setNewEmpireError,
                                setNewEmpireLoading,
                                setEmpires,
                                setNewEmpireName
                            )}
                            className="account-form"
                        >
                            <div className="account-form-fields">
                                <input
                                    placeholder="New empire name"
                                    value={newEmpireName}
                                    onChange={e => setNewEmpireName(e.target.value)}
                                    required
                                    className="login-input"
                                    disabled={newEmpireLoading}
                                />
                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={newEmpireLoading}
                                    onClick={e => e.stopPropagation()}
                                >Create Empire</button>
                            </div>
                        </form>
                        {newEmpireError && <ErrorMessage>{newEmpireError}</ErrorMessage>}
                        <h3>Empires & Account Assignment</h3>
                        <EmpireList
                            empires={empires}
                            accounts={accounts}
                            onLink={handleLinkAccount}
                            onUnlink={handleUnlinkAccount}
                            onDelete={(name) => handleDeleteEmpire(
                                name,
                                setNewEmpireLoading,
                                setNewEmpireError,
                                setEmpires
                            )}
                            loading={newEmpireLoading}
                        />
                    </section>
                ) : activeTab === 'accounts' && showAccountsTab ? (
                    <section className="account-manage-section card">
                        <h2>Manage Accounts</h2>
                        <form
                            onSubmit={e => handleCreateAccount(
                                e,
                                newAccountName,
                                newAccountPass,
                                accounts,
                                setAccountError,
                                setAccountSuccess,
                                setAccountsTabLoading,
                                setAccounts,
                                setNewAccountName,
                                setNewAccountPass
                            )}
                            className="account-form"
                        >
                            <div className="account-form-fields">
                                <input
                                    placeholder="Account name"
                                    value={newAccountName}
                                    onChange={e => setNewAccountName(e.target.value)}
                                    required
                                    className="login-input"
                                    disabled={accountsTabLoading}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={newAccountPass}
                                    onChange={e => setNewAccountPass(e.target.value)}
                                    required
                                    className="login-input"
                                    disabled={accountsTabLoading}
                                />
                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={accountsTabLoading}
                                    onClick={e => e.stopPropagation()}
                                >Create Account</button>
                            </div>
                        </form>
                        {accountError && <ErrorMessage>{accountError}</ErrorMessage>}
                        {accountSuccess && <LoadingMessage style={{color:'limegreen'}}>{accountSuccess}</LoadingMessage>}
                        <h3>All Accounts</h3>
                        <AccountList
                            accounts={accounts}
                            onEdit={acc => {
                                setEditAccount(acc);
                                setEditAccountName(acc);
                                setEditAccountPass('');
                                setEditAccountError('');
                            }}
                            onDelete={acc => handleDeleteAccount(
                                acc,
                                setEditAccountLoading,
                                setEditAccountError,
                                setAccounts,
                                setAccountSuccess
                            )}
                            editAccountLoading={editAccountLoading}
                        />
                        {editAccount && (
                            <div
                                className="account-edit-panel card"
                                ref={accountEditPanelRef}
                            >
                                <h3>Edit Account: <b>{editAccount}</b></h3>
                                <form onSubmit={e => handleRenameAccount(
                                    e,
                                    editAccount,
                                    editAccountName,
                                    setEditAccountLoading,
                                    setEditAccountError,
                                    setAccounts,
                                    setEditAccount,
                                    setAccountSuccess
                                )} className="edit-account-form">
                                    <label>
                                        Rename to:
                                        <input
                                            value={editAccountName}
                                            onChange={e => setEditAccountName(e.target.value)}
                                            className="login-input"
                                            disabled={editAccountLoading}
                                        />
                                    </label>
                                    <button type="submit" className="empire-save-btn" disabled={editAccountLoading}>Rename</button>
                                </form>
                                <form onSubmit={e => handleChangePassword(
                                    e,
                                    editAccount,
                                    editAccountPass,
                                    setEditAccountLoading,
                                    setEditAccountError,
                                    setAccounts,
                                    setEditAccount,
                                    setAccountSuccess
                                )} className="change-password-form">
                                    <label>
                                        New Password:
                                        <input
                                            type="password"
                                            value={editAccountPass}
                                            onChange={e => setEditAccountPass(e.target.value)}
                                            className="login-input"
                                            disabled={editAccountLoading}
                                        />
                                    </label>
                                    <button type="submit" className="empire-save-btn" disabled={editAccountLoading}>Change Password</button>
                                </form>
                                {editAccountError && <div className="login-error">{editAccountError}</div>}
                                <button className="empire-back-btn" onClick={() => setEditAccount(null)} disabled={editAccountLoading}>Cancel</button>
                            </div>
                        )}
                    </section>
                ) : activeTab === 'empires' ? (
                    editEmpire ? (
                        <section className="empires-info-section card">
                            <h2>Edit {editEmpire}</h2>
                            <EmpireEditPanel
                                name={editEmpire}
                                onCancel={() => setEditEmpire(null)}
                                empireInfo={empireInfo}
                                saveEmpireInfo={saveEmpireInfo}
                            />
                        </section>
                    ) : empirePage ? (
                        <EmpirePanel
                            name={empirePage}
                            canEdit={account && account.username === empirePage}
                            empireInfo={empireInfo}
                            getEmpireAccount={getEmpireAccount}
                            setEmpirePage={setEmpirePage}
                            setEditEmpire={setEditEmpire}
                        />
                    ) : (
                        <section className="empires-info-section card">
                            <div className="empires-header">
                                <h2>Empires</h2>
                            </div>
                            <SearchSortBar
                                searchValue={empireSearch}
                                onSearchChange={setEmpireSearch}
                                onClearSearch={() => setEmpireSearch('')}
                                sortValue={empireSort}
                                onSortChange={setEmpireSort}
                                sortOptions={[
                                    { value: 'name', label: 'Sort by Name' }
                                ]}
                                placeholder="Search empires by name..."
                                searchClass="empire-search-input"
                                sortClass="empire-sort-select"
                            />
                            <div className="empires-info-list" style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start'}}>
                                <EmpireList
                                    empires={sortedEmpires.map(name => empires.find(e => e.name === name))}
                                    accounts={accounts}
                                    account={account}
                                    setEmpirePage={setEmpirePage}
                                    setEditEmpire={setEditEmpire}
                                    getEmpireAccount={getEmpireAccount}
                                />
                            </div>
                        </section>
                    )
                ) : (
                    <>
                        {!account ? (
                            <section className="account-section card">
                                <h2 className="login-title">Login</h2>
                                <form onSubmit={handleLogin} className="account-form login-form">
                                    <div className="login-fields">
                                        <input
                                            placeholder="Empire name"
                                            value={loginUser}
                                            onChange={e => setLoginUser(e.target.value)}
                                            required
                                            disabled={!accountsLoaded}
                                            className="login-input"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={loginPass}
                                            onChange={e => setLoginPass(e.target.value)}
                                            required
                                            disabled={!accountsLoaded}
                                            className="login-input"
                                        />
                                    </div>
                                    <button type="submit" disabled={!accountsLoaded} className="login-btn">Login</button>
                                </form>
                                {!accountsLoaded && <LoadingMessage>Loading accounts...</LoadingMessage>}
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                            </section>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <section className="boards-section">
                                    <div className="channels-main">
                                        <div className="channels-sidebar">
                                            <div className="boards-list card">
                                                <h2>
                                                    {account && account.username === "GameMaster"
                                                        ? "All Boards"
                                                        : "Your Diplomatic Channels"}
                                                </h2>
                                                <div className="boards-list-header">
                                                    <span className="boards-list-count">
                                                        {filteredBoards.length} {filteredBoards.length === 1 ? "channel" : "channels"}
                                                    </span>
                                                </div>
                                                <ul className="boards-list-ul">
                                                    {filteredBoards.length === 0 && (
                                                        <li className="no-channels">No channels available.</li>
                                                    )}
                                                    {filteredBoards.map(([a, b]) => {
                                                        const key = a + '|' + b;
                                                        const maxNameLen = 16;
                                                        return (
                                                            <li key={key} className={`boards-list-item${selected === key ? ' active' : ''}`}>
                                                                <button
                                                                    className="board-btn"
                                                                    onClick={() => handleBoardSelect([a, b])}
                                                                >
                                                                    <span className="board-nations" title={a}>
                                                                        {cutOffDotter.cut(a, maxNameLen)}
                                                                    </span>
                                                                    <span className="board-arrow">↔</span>
                                                                    <span className="board-nations" title={b}>
                                                                        {cutOffDotter.cut(b, maxNameLen)}
                                                                    </span>
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="channels-content">
                                            <div className="board-messages card">
                                                {(selected && filteredBoards.length > 0) ? (
                                                    <div className="board-messages-inner">
                                                        <div className="board-title-row">
                                                            <h2 className="board-title">{selected.replace('|', ' ↔ ')}</h2>
                                                        </div>
                                                        <div className="messages-panel">
                                                            <div className="messages-list-container">
                                                                <MessageList
                                                                    messages={messages[selected] || []}
                                                                    selected={selected}
                                                                    account={account}
                                                                    gmPermissions={gmPermissions}
                                                                    handleDeleteMessage={handleDeleteMessage}
                                                                />
                                                            </div>
                                                            <form onSubmit={postMessage} className="message-form message-form-bottom">
                                                                <input
                                                                    placeholder="Your empire"
                                                                    value={account.username}
                                                                    disabled
                                                                    required
                                                                    className="author-input"
                                                                />
                                                                <input
                                                                    placeholder="Message"
                                                                    value={text}
                                                                    onChange={e => setText(e.target.value)}
                                                                    required
                                                                    className="text-input"
                                                                />
                                                                <button type="submit" className="send-btn">Send</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="no-messages">Select a channel to view messages.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </>
                )}
            </main>
            <footer className="footer">
                <span>Stellaris RP Chronicler &copy; {new Date().getFullYear()}</span>
            </footer>
        </div>
    );
}
export default App;