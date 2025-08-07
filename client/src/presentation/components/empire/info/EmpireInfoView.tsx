import React from 'react';
import { Empire, EmpireInfo, EmpireInfoViewProps } from '../../../../data/models/Empire';

/**
 * EmpireInfoView - Read-only view component for empire information
 */
export default function EmpireInfoView({ empire, info, onEdit, onBack, canEdit }: EmpireInfoViewProps) {
    if (!empire) {
        return <div>No empire selected</div>;
    }

    return (
        <div className="empire-info-view">
            <div className="empire-info-header">
                <h3>{empire.name}</h3>
                {onEdit && canEdit && (
                    <button onClick={onEdit} className="edit-button">
                        Edit
                    </button>
                )}
                {onBack && (
                    <button onClick={onBack} className="back-button">
                        Back
                    </button>
                )}
            </div>
            
            <div className="empire-info-content">
                {info.lore && (
                    <div className="info-section">
                        <h4>Lore</h4>
                        <p>{info.lore}</p>
                    </div>
                )}
                
                {info.stats && (
                    <div className="info-section">
                        <h4>Stats</h4>
                        <p>{info.stats}</p>
                    </div>
                )}
                
                {info.ethics && (
                    <div className="info-section">
                        <h4>Ethics</h4>
                        <p>{info.ethics}</p>
                    </div>
                )}
                
                {info.civics && (
                    <div className="info-section">
                        <h4>Civics</h4>
                        <p>{info.civics}</p>
                    </div>
                )}
                
                {info.special && (
                    <div className="info-section">
                        <h4>Special</h4>
                        <p>{info.special}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
