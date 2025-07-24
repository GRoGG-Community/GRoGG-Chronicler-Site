import React, { useEffect, useState } from 'react';
import '../css/RoadmapTab.css';
import StatusBadge from './StatusBadge';

export default function RoadmapTab({ onClose }) {
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/roadmap.json?ts=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setRoadmap(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="roadmap-section card">
            <div className="roadmap-header">
                <h2>Project Roadmap</h2>
                <button className="roadmap-close-btn" onClick={onClose}>Close</button>
            </div>
            {loading ? (
                <div className="roadmap-loading">Loading roadmap...</div>
            ) : (
                <ul className="roadmap-list">
                    {roadmap.map((item, idx) => (
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
        </section>
    );
}
