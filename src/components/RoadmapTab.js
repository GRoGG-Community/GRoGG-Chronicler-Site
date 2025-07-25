import React, { useEffect, useState } from 'react';
import '../css/RoadmapTab.css';
import StatusBadge from './StatusBadge';

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'planned', label: 'Planned' }
];

export default function RoadmapTab({ onClose, account }) {
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [showEditor, setShowEditor] = useState(false);
    const [editorText, setEditorText] = useState('');
    const [editorError, setEditorError] = useState('');
    const [editorSaving, setEditorSaving] = useState(false);

    function fetchRoadmap() {
        setLoading(true);
        fetch('/roadmap.json?ts=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setRoadmap(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const filtered = roadmap.filter(item => {
        const matchesTab = activeTab === 'all' || item.status === activeTab;
        const matchesSearch = !search.trim() ||
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    function openEditor() {
        setEditorText(JSON.stringify(roadmap, null, 2));
        setEditorError('');
        setShowEditor(true);
    }
    function closeEditor() {
        setShowEditor(false);
        setEditorError('');
        setEditorSaving(false);
        fetchRoadmap(); // <-- Always reload after closing editor
    }
    function handleEditorChange(e) {
        setEditorText(e.target.value);
        setEditorError('');
    }
    function handleEditorSubmit(e) {
        e.preventDefault();
        setEditorError('');
        setEditorSaving(true);
        let parsed;
        try {
            parsed = JSON.parse(editorText);
            if (!Array.isArray(parsed)) throw new Error("Roadmap JSON must be an array.");
        } catch (err) {
            setEditorError('Invalid JSON: ' + err.message);
            setEditorSaving(false);
            return;
        }
        fetch('/api/roadmap/json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setShowEditor(false);
                setEditorSaving(false);
                fetchRoadmap();
            } else {
                setEditorError(data.error || 'Failed to save roadmap.json');
                setEditorSaving(false);
            }
        })
        .catch(() => {
            setEditorError('Failed to save roadmap.json');
            setEditorSaving(false);
        });
    }

    return (
        <section className="roadmap-section card">
            <div className="roadmap-header" style={{display: 'flex', alignItems: 'center', gap: '0.7rem'}}>
                <h2>Project Roadmap</h2>
                {account && account.username === "GameMaster" && (
                    <button
                        className="roadmap-edit-btn"
                        style={{marginLeft:8, background:'#555'}}
                        onClick={openEditor}
                    >Edit Roadmap</button>
                )}
                <button className="roadmap-close-btn" onClick={onClose}>Close</button>
            </div>
            <div className="roadmap-tabs-bar" style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`roadmap-tab-btn${activeTab === tab.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
                <input
                    type="text"
                    placeholder="Search roadmap..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="roadmap-search-input"
                    style={{marginLeft:'auto',minWidth:180}}
                />
                {search && (
                    <button
                        className="roadmap-search-clear-btn"
                        onClick={() => setSearch('')}
                        title="Clear search"
                        style={{marginLeft:4}}
                    >✕</button>
                )}
            </div>
            {loading ? (
                <div className="roadmap-loading">Loading roadmap...</div>
            ) : (
                <ul className="roadmap-list">
                    {filtered.length === 0 && (
                        <li className="roadmap-item roadmap-empty">
                            <i>No roadmap items found.</i>
                        </li>
                    )}
                    {filtered.map((item, idx) => (
                        <li key={idx} className={`roadmap-item roadmap-status-${item.status}`}>
                            <div className="roadmap-title-row">
                                <span className="roadmap-title">{item.title}</span>
                                <span className={`roadmap-status roadmap-status-${item.status}`}>
                                    <StatusBadge status={item.status} />
                                </span>
                            </div>
                            <div className="roadmap-desc">{item.description}</div>
                        </li>
                    ))}
                </ul>
            )}
            {showEditor && (
                <div className="modal-overlay" onClick={closeEditor}>
                    <div className="modal-content" style={{maxWidth: 900, width: '98vw'}} onClick={e => e.stopPropagation()}>
                        <h2>Edit roadmap.json</h2>
                        <form onSubmit={handleEditorSubmit}>
                            <textarea
                                value={editorText}
                                onChange={handleEditorChange}
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
                                disabled={editorSaving}
                            />
                            {editorError && <div className="login-error">{editorError}</div>}
                            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                                <button
                                    type="button"
                                    className="roadmap-close-btn"
                                    style={{background: '#555'}}
                                    onClick={closeEditor}
                                    disabled={editorSaving}
                                >Cancel</button>
                                <button
                                    type="submit"
                                    className="roadmap-edit-btn"
                                    disabled={editorSaving}
                                >Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
