import React from 'react';
import Card from '../../common/Card';
import { Empire, EmpireInfo } from '../../../../data/models/Empire';
import cutOffDotter from '../../../../business/utils/textTruncationUtils';
import { TEXT_LIMITS } from '../../../../infrastructure/constants/app.constants';

/**
 * EmpireInfoList (Presentational Component, Iterator Pattern)
 * Displays a list of empires with view/edit actions.
 * Implements the Single Responsibility Principle - only handles empire list display.
 * Uses the Observer pattern to notify parent of user actions.
 */

interface EmpireInfoListProps {
    empires: Empire[];
    empireInfo: Record<string, EmpireInfo>;
    loading: boolean;
    onViewEmpire: (empire: Empire) => void;
    onEditEmpire: (empire: Empire) => void;
}

export default function EmpireInfoList({
    empires,
    empireInfo,
    loading,
    onViewEmpire,
    onEditEmpire
}: EmpireInfoListProps) {
    if (loading) return <div>Loading empires...</div>;
    if (!empires || empires.length === 0) return <div>No empires found.</div>;

    return (
        <div className="empire-list-cards">
            {empires.map((empire: Empire) => {
                const info = empireInfo[empire.id] || empireInfo[empire.name] || {};
                const hasInfo = info.lore || info.stats || info.ethics || info.civics || info.special;

                return (
                    <Card key={empire.id || empire.name} className="empire-card">
                        <div className="empire-card-content">
                            <h3 className="empire-card-title">{empire.name}</h3>
                            
                            {hasInfo && (
                                <div className="empire-info-preview">
                                    {info.lore && (
                                        <div className="empire-info-snippet">
                                            <strong>Lore:</strong> {cutOffDotter.cut(info.lore, TEXT_LIMITS.EMPIRE_LORE_PREVIEW)}
                                        </div>
                                    )}
                                    {info.ethics && (
                                        <div className="empire-info-snippet">
                                            <strong>Ethics:</strong> {info.ethics}
                                        </div>
                                    )}
                                    {info.civics && (
                                        <div className="empire-info-snippet">
                                            <strong>Civics:</strong> {info.civics}
                                        </div>
                                    )}
                                    {info.stats && (
                                        <div className="empire-info-snippet">
                                            <strong>Stats:</strong> {info.stats}
                                        </div>
                                    )}
                                    {info.special && (
                                        <div className="empire-info-snippet">
                                            <strong>Special:</strong> {info.special}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {!hasInfo && (
                                <div className="empire-info-empty-preview">
                                    <em>No information available</em>
                                </div>
                            )}
                            
                            <div className="empire-card-info">
                                <button 
                                    onClick={() => onViewEmpire(empire)}
                                    className="empire-view-btn"
                                >
                                    View
                                </button>
                                <button 
                                    onClick={() => onEditEmpire(empire)}
                                    className="empire-edit-btn"
                                >
                                    {hasInfo ? 'Edit Info' : 'Add Info'}
                                </button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
