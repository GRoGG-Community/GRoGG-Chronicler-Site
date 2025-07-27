import React from 'react';
import ActionButton from './ActionButton';
import Card from './Card';
import MarkdownRenderer from './MarkdownRenderer';

export default function EmpirePanel({ name, canEdit, empireInfo, getEmpireAccount, setEmpirePage, setEditEmpire }) {
    const info = empireInfo[name] || {};
    return (
        <Card className="empire-info-card empire-info-page">
            <h2 className="empire-info-title">{name}</h2>
            <div className="empire-info-owner">
                Owner: <span>{getEmpireAccount(name) || <i>Unassigned</i>}</span>
            </div>
            <div className="empire-info-details">
                <div>
                    <b>Lore:</b>
                    <div className="empire-info-field">
                        <MarkdownRenderer markdown={info.lore || ''} />
                    </div>
                </div>
                <div><b>Stats:</b> <div className="empire-info-field">{info.stats || <i>No stats set.</i>}</div></div>
                <div><b>Ethics:</b> <div className="empire-info-field">{info.ethics || <i>No ethics set.</i>}</div></div>
                <div><b>Civics:</b> <div className="empire-info-field">{info.civics || <i>No civics set.</i>}</div></div>
                <div><b>Special Info:</b> <div className="empire-info-field">{info.special || <i>No special info set.</i>}</div></div>
            </div>
            <div className="empire-actions">
                <ActionButton variant="secondary" className="empire-back-btn" onClick={() => setEmpirePage(null)}>Back to Empires</ActionButton>
                {canEdit && (
                    <ActionButton variant="primary" className="empire-save-btn" onClick={() => setEditEmpire(name)}>Edit</ActionButton>
                )}
            </div>
        </Card>
    );
}

