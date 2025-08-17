import React from 'react';
import { NavigationItem } from '../../../data/types/BurgerMenuTypes';
import BurgerMenuState from '../../../business/state/BurgerMenuState';
import NavigationList from './NavigationList';
import PermissionsPanel from './PermissionsPanel';
import RoadmapPanel from './RoadmapPanel';

/**
 * BurgerMenuView (Presentational Component, Template Method Pattern)
 * Pure presentational component for the burger menu.
 * Implements Template Method pattern for consistent UI structure.
 * Follows Single Responsibility: only handles UI rendering.
 */

interface BurgerMenuViewProps {
    navigationItems: NavigationItem[];
    currentPath: string;
    menuState: BurgerMenuState;
    onToggleMenu: () => void;
    onCloseMenu: () => void;
    onTogglePermissions: () => void;
    onToggleRoadmap: () => void;
    onBackToMainMenu: () => void;
    onNavigate: (path: string) => void;
    onPermissionChange: (key: string, value: boolean) => void;
    menuRef: React.RefObject<HTMLDivElement | null>;
    permissionsRef: React.RefObject<HTMLDivElement | null>;
}

export default function BurgerMenuView({
    navigationItems,
    currentPath,
    menuState,
    onToggleMenu,
    onCloseMenu,
    onTogglePermissions,
    onToggleRoadmap,
    onBackToMainMenu,
    onNavigate,
    onPermissionChange,
    menuRef,
    permissionsRef
}: BurgerMenuViewProps) {
    return (
        <div className="burger-menu-container">
            {/* Burger Menu Button */}
            <button
                className={`burger-menu-btn ${menuState.isMenuOpen ? 'active' : ''}`}
                onClick={onToggleMenu}
                aria-label="Toggle navigation menu"
                aria-expanded={menuState.isMenuOpen}
            >
                <span className="burger-line"></span>
                <span className="burger-line"></span>
                <span className="burger-line"></span>
            </button>

            {/* Menu Overlay */}
            {menuState.isAnyPanelOpen() && (
                <div 
                    className="burger-menu-overlay"
                    onClick={onCloseMenu}
                    aria-hidden="true"
                />
            )}

            {/* Main Navigation Menu */}
            {menuState.isMenuOpen && (
                <div 
                    ref={menuRef}
                    className="burger-menu-panel"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <div className="burger-menu-header">
                        <h3>Navigation</h3>
                        <button 
                            className="burger-menu-close"
                            onClick={onCloseMenu}
                            aria-label="Close menu"
                        >
                            ×
                        </button>
                    </div>

                    <NavigationList
                        items={navigationItems}
                        currentPath={currentPath}
                        userPermissions={menuState.userPermissions}
                        onNavigate={onNavigate}
                    />

                    <div className="burger-menu-actions">
                        <button
                            className="burger-menu-action-btn"
                            onClick={onTogglePermissions}
                            aria-expanded={menuState.isPermissionsOpen}
                        >
                            ⚙️ Permissions
                        </button>
                        <button
                            className="burger-menu-action-btn"
                            onClick={onToggleRoadmap}
                            aria-expanded={menuState.isRoadmapOpen}
                        >
                            🗺️ Roadmap
                        </button>
                    </div>
                </div>
            )}

            {/* Permissions Panel */}
            {menuState.isPermissionsOpen && (
                <PermissionsPanel
                    ref={permissionsRef}
                    permissions={menuState.userPermissions}
                    onPermissionChange={onPermissionChange}
                    onClose={onCloseMenu}
                    onBackToMainMenu={onBackToMainMenu}
                />
            )}

            {/* Roadmap Panel */}
            {menuState.isRoadmapOpen && (
                <RoadmapPanel
                    onClose={onCloseMenu}
                    onBackToMainMenu={onBackToMainMenu}
                />
            )}
        </div>
    );
}
