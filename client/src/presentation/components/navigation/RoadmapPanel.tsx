import React, { useState } from 'react';
import { useRoadmapData } from '../../../business/hooks/data/useRoadmapData';

/**
 * RoadmapPanel (Presentational Component, Template Method Pattern)
 * Renders development roadmap information from public/roadmap.json.
 * Implements Template Method pattern for consistent panel structure.
 * Follows Single Responsibility: only handles roadmap display.
 */

interface RoadmapPanelProps {
    onClose: () => void;
    onBackToMainMenu: () => void;
}

interface RoadmapItem {
    title: string;
    status: string;
    description?: string;
    priority?: string;
}

export default function RoadmapPanel({ onClose, onBackToMainMenu }: RoadmapPanelProps) {
    const { roadmapItems, loading, error } = useRoadmapData();
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    // Group items by status
    const groupedItems = roadmapItems.reduce((acc, item) => {
        if (!acc[item.status]) {
            acc[item.status] = [];
        }
        acc[item.status].push(item);
        return acc;
    }, {} as Record<string, RoadmapItem[]>);

    const statusOrder = ['in-progress', 'planned', 'completed'];
    const statusLabels = {
        'completed': '✅ Completed',
        'in-progress': '🚧 In Progress', 
        'planned': '📋 Planned'
    };

    const toggleSection = (status: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return '✅';
            case 'in-progress': return '🔄';
            case 'planned': return '📋';
            default: return '❓';
        }
    };

    const getStatusClass = (status: string) => {
        return `roadmap-status roadmap-status-${status}`;
    };

    return (
        <div 
            className="burger-roadmap-panel"
            role="dialog"
            aria-label="Development roadmap"
        >
            <div className="burger-panel-header">
                <h3>Development Roadmap</h3>
                <div className="burger-panel-header-actions">
                    <button 
                        className="burger-panel-back"
                        onClick={onBackToMainMenu}
                        aria-label="Back to main menu"
                        title="Back to main menu"
                    >
                        ←
                    </button>
                    <button 
                        className="burger-panel-close"
                        onClick={onClose}
                        aria-label="Close roadmap panel"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="burger-panel-content">
                {loading && (
                    <p className="roadmap-loading">Loading roadmap...</p>
                )}
                
                {error && (
                    <p className="roadmap-error">Error: {error}</p>
                )}

                {!loading && !error && (
                    <>
                        <p className="roadmap-description">
                            Track the development progress and upcoming features for the Stellaris RP Chronicler.
                        </p>

                        <div className="roadmap-sections">
                            {statusOrder.map(status => {
                                const items = groupedItems[status] || [];
                                if (items.length === 0) return null;

                                return (
                                    <div key={status} className="roadmap-section">
                                        <div 
                                            className="roadmap-section-header"
                                            onClick={() => toggleSection(status)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span className={getStatusClass(status)}>
                                                {getStatusIcon(status)}
                                            </span>
                                            <h4 className="roadmap-section-title">
                                                {statusLabels[status as keyof typeof statusLabels]}
                                            </h4>
                                            <span className="roadmap-item-count">
                                                ({items.length} items)
                                            </span>
                                            <span className="roadmap-collapse-icon">
                                                {collapsedSections[status] ? '▶' : '▼'}
                                            </span>
                                        </div>

                                        {!collapsedSections[status] && (
                                            <ul className="roadmap-items">
                                                {items
                                                    .sort((a, b) => {
                                                        const priorityA = a.priority ? parseInt(a.priority) : 0;
                                                        const priorityB = b.priority ? parseInt(b.priority) : 0;
                                                        return priorityB - priorityA;
                                                    })
                                                    .map((item, itemIndex) => (
                                                    <li key={itemIndex} className="roadmap-item">
                                                        <div className="roadmap-item-title">{item.title}</div>
                                                        <div className="roadmap-item-description">{item.description}</div>
                                                        <div className="roadmap-item-priority">Priority: {item.priority}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="roadmap-footer">
                            <p>
                                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Total items:</strong> {roadmapItems.length}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
