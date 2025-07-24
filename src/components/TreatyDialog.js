import React, { useState, useEffect, useRef } from 'react';
import { TREATY_STATUS_OPTIONS } from '../utils/treatyStatusOptions';
import ActionButton from './ActionButton';
import ModalOverlay from './ModalOverlay';
import FormField from './FormField';
import { ErrorMessage } from './Messages';
import Dropdown from './Dropdown';
import cutOffDotter from '../utils/cutOffDotter';

export default function TreatyDialog({ open, mode, data, onSave, onClose, error, saving, empires, accounts, account }) {
    const [form, setForm] = useState(() => data ? { ...data } : {
        title: '', content: '', participants: [], status: 'discussion', owner: account?.username || ''
    });
    const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false);
    const dropdownBtnRef = useRef(null);
    const dropdownListRef = useRef(null);

    useEffect(() => {
        if (data) setForm({ ...data });
        else setForm({ title: '', content: '', participants: [], status: 'discussion', owner: account?.username || '' });
    }, [data, open]);

    useEffect(() => {
        if (!showParticipantsDropdown) return;
        function handleClick(e) {
            if (
                dropdownBtnRef.current &&
                !dropdownBtnRef.current.contains(e.target) &&
                dropdownListRef.current &&
                !dropdownListRef.current.contains(e.target)
            ) {
                setShowParticipantsDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showParticipantsDropdown]);

    useEffect(() => {
        if (!showParticipantsDropdown) return;
        function handleKey(e) {
            if (e.key === "Escape") setShowParticipantsDropdown(false);
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [showParticipantsDropdown]);

    if (!open) return null;

    const isEdit = mode === 'edit';

    function toggleParticipant(name) {
        setForm(f => {
            const exists = f.participants.includes(name);
            return {
                ...f,
                participants: exists
                    ? f.participants.filter(p => p !== name)
                    : [...f.participants, name]
            };
        });
    }

    return (
        <ModalOverlay onClose={onClose}>
            <h2>{isEdit ? 'Edit Treaty' : 'New Treaty'}</h2>
            <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.2rem',
                    marginBottom: '1.2rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label
                            htmlFor="treaty-title"
                            style={{
                                fontWeight: 'bold',
                                color: 'var(--accent)',
                                fontSize: '1.05em',
                                marginBottom: '0.2em',
                                display: 'block'
                            }}
                        >
                            Title:
                        </label>
                        <FormField
                            id="treaty-title"
                            label={null}
                            name="title"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            required
                            disabled={saving}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label
                            htmlFor="treaty-status"
                            style={{
                                fontWeight: 'bold',
                                color: 'var(--accent)',
                                fontSize: '1.05em',
                                marginBottom: '0.2em',
                                display: 'block'
                            }}
                        >
                            Status:
                        </label>
                        <FormField
                            id="treaty-status"
                            label={null}
                            name="status"
                            as="select"
                            value={form.status}
                            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                            options={TREATY_STATUS_OPTIONS}
                            disabled={saving}
                        />
                    </div>
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <label
                            htmlFor="participants-dropdown"
                            style={{
                                fontWeight: 'bold',
                                color: 'var(--accent)',
                                fontSize: '1.05em',
                                marginBottom: 0,
                                display: 'block'
                            }}
                        >
                            Participants:
                        </label>
                        <div
                            id="participants-dropdown"
                            className="participants-dropdown"
                            ref={dropdownBtnRef}
                            tabIndex={0}
                            style={{
                                userSelect: 'none',
                                background: 'var(--primary-bg)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                padding: '0.7rem 1rem',
                                minHeight: '2.2rem',
                                maxWidth: '100%',
                                width: '100%',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                marginBottom: 0,
                                marginTop: '0.2em',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                overflow: 'hidden'
                            }}
                            onMouseDown={e => e.preventDefault()}
                            onClick={e => {
                                if (!saving) setShowParticipantsDropdown(v => !v);
                            }}
                            aria-haspopup="listbox"
                            aria-expanded={showParticipantsDropdown}
                        >
                            <span style={{
                                color: form.participants.length ? 'var(--text)' : '#aaa',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                maxWidth: 'calc(100% - 2em)',
                                display: 'block'
                            }}>
                                {form.participants.length
                                    ? cutOffDotter.cut(form.participants.join(', '), 12)
                                    : 'Select participants...'}
                            </span>
                            <span style={{ marginLeft: 8, color: '#aaa', fontSize: '1.1em', pointerEvents: 'none' }}>▼</span>
                        </div>
                        {showParticipantsDropdown && (
                            <div
                                className="participants-dropdown-list"
                                ref={dropdownListRef}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 'calc(100% + 8px)',
                                    zIndex: 1001,
                                    background: 'var(--card-bg)',
                                    border: '1.5px solid var(--accent)',
                                    borderRadius: 10,
                                    boxShadow: '0 4px 24px #0005',
                                    minWidth: 210,
                                    padding: '0.3rem 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.2rem',
                                    maxHeight: 220,
                                    overflowY: 'auto'
                                }}
                                onClick={e => e.stopPropagation()}
                                role="listbox"
                            >
                                {empires.map((e, idx) => (
                                    <button
                                        key={e}
                                        type="button"
                                        className="participants-dropdown-item"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--accent)',
                                            fontSize: '1.08rem',
                                            textAlign: 'left',
                                            padding: '0.7rem 1.2rem',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                            borderRadius: 7,
                                            transition: 'background 0.15s, color 0.15s',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.7em',
                                            position: 'relative',
                                            backgroundColor: form.participants.includes(e) ? 'rgba(0,191,255,0.10)' : 'transparent'
                                        }}
                                        tabIndex={-1}
                                        onMouseDown={ev => ev.preventDefault()}
                                        onClick={ev => {
                                            ev.stopPropagation();
                                            if (!saving) {
                                                setForm(f => {
                                                    const exists = f.participants.includes(e);
                                                    return {
                                                        ...f,
                                                        participants: exists
                                                            ? f.participants.filter(p => p !== e)
                                                            : [...f.participants, e]
                                                    };
                                                });
                                            }
                                        }}
                                    >
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 22,
                                            height: 22,
                                            borderRadius: 5,
                                            border: '1.5px solid var(--accent)',
                                            background: form.participants.includes(e) ? 'var(--accent)' : 'var(--primary-bg)',
                                            marginRight: 10,
                                            transition: 'background 0.15s, border 0.15s'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={form.participants.includes(e)}
                                                readOnly
                                                tabIndex={-1}
                                                style={{
                                                    accentColor: 'var(--accent)',
                                                    width: 18,
                                                    height: 18,
                                                    margin: 0,
                                                    pointerEvents: 'none'
                                                }}
                                            />
                                        </span>
                                        <span style={{
                                            color: form.participants.includes(e) ? '#fff' : 'var(--accent)',
                                            fontWeight: form.participants.includes(e) ? 600 : 400,
                                            flex: 1,
                                            textAlign: 'left'
                                        }}>
                                            {cutOffDotter.cut(e, 32)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {account?.username === "GameMaster" && (
                            <>
                                <label
                                    htmlFor="treaty-owner"
                                    style={{
                                        fontWeight: 'bold',
                                        color: 'var(--accent)',
                                        fontSize: '1.05em',
                                        marginBottom: '0.2em',
                                        display: 'block'
                                    }}
                                >
                                    Owner:
                                </label>
                                <FormField
                                    id="treaty-owner"
                                    label={null}
                                    name="owner"
                                    as="select"
                                    value={form.owner}
                                    onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                                    options={Object.keys(accounts).map(acc => ({ value: acc, label: acc }))}
                                    disabled={saving}
                                />
                            </>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', gridColumn: '1 / span 2' }}>
                    <label
                        htmlFor="treaty-content"
                        style={{
                            fontWeight: 'bold',
                            color: 'var(--accent)',
                            fontSize: '1.05em',
                            marginBottom: '0.2em',
                            display: 'block'
                        }}
                    >
                        Content:
                    </label>
                    <FormField
                        id="treaty-content"
                        label={null}
                        name="content"
                        as="textarea"
                        value={form.content}
                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                        rows={7}
                        required
                        disabled={saving}
                        style={{
                            width: '100%',
                            marginRight: 0
                        }}
                    />
                </div>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <div className="treaty-form-actions">
                    <ActionButton type="submit" variant="primary" className="empire-save-btn" disabled={saving}>
                        {isEdit ? "Save Changes" : "Create Treaty"}
                    </ActionButton>
                    <ActionButton type="button" variant="secondary" className="empire-back-btn" onClick={onClose} disabled={saving}>Cancel</ActionButton>
                </div>
            </form>
        </ModalOverlay>
    );
}

