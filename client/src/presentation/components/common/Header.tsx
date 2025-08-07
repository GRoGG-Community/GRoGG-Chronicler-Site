import React from 'react';
import { useNavigate } from "react-router";
import NavigationManager from '../navigation/NavigationManager';

interface Tab {
    key: string;
    label: string;
}

export const tabs: Tab[] = [
    { key: 'channels', label: 'Channels' },
    { key: 'empires', label: 'Empires' },
    { key: 'treaties', label: 'Treaties' },
    { key: 'accounts', label: 'Manage Accounts' },
    { key: 'manage-empires', label: 'Manage Empires' }
];

interface HeaderProps {
    activeTab?: string;
}

export default function Header({ activeTab }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-content">
                <h1>Stellaris RP Chronicler</h1>
                
                {/* Mobile Navigation */}
                <div className="header-mobile-nav">
                    <NavigationManager />
                </div>
                
                {/* Desktop Navigation */}
                <div className="tabs-bar">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                            onClick={() => {
                                navigate(`/${tab.key}`)
                            }}
                        >{tab.label}</button>
                    ))}
                </div>
            </div>
        </header>
    );
}
