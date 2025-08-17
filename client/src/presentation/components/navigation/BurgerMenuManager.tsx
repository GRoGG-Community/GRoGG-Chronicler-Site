import React, { useState, useRef, useEffect } from 'react';
import BurgerMenuView from './BurgerMenuView';
import BurgerMenuState from '../../../business/state/BurgerMenuState';
import { NavigationItem } from '../../../data/types/BurgerMenuTypes';

/**
 * BurgerMenuManager (Manager Pattern, Singleton, Observer Pattern)
 * Manages the state and behavior of the burger menu system.
 * Implements the Manager pattern for complex state coordination.
 * Uses Observer pattern for navigation state changes.
 * Follows Single Responsibility: coordinates burger menu operations.
 */

interface BurgerMenuManagerProps {
    navigationItems: NavigationItem[];
    currentPath: string;
    onNavigate: (path: string) => void;
    userPermissions?: Record<string, boolean>;
    onPermissionChange?: (key: string, value: boolean) => void;
}

export default function BurgerMenuManager({
    navigationItems,
    currentPath,
    onNavigate,
    userPermissions = {},
    onPermissionChange
}: BurgerMenuManagerProps) {
    // State Management (State Pattern)
    const [menuState, setMenuState] = useState(() => 
        new BurgerMenuState(userPermissions)
    );

    // Refs for outside click detection
    const menuRef = useRef<HTMLDivElement>(null);
    const permissionsRef = useRef<HTMLDivElement>(null);

    // State transition handlers (State Pattern)
    const handleToggleMenu = () => {
        setMenuState((prev: BurgerMenuState) => prev.toggleMenu());
    };

    const handleCloseMenu = () => {
        setMenuState((prev: BurgerMenuState) => prev.closeAll());
    };

    const handleTogglePermissions = () => {
        setMenuState((prev: BurgerMenuState) => prev.togglePermissions());
    };

    const handleToggleRoadmap = () => {
        setMenuState((prev: BurgerMenuState) => prev.toggleRoadmap());
    };

    const handleBackToMainMenu = () => {
        setMenuState((prev: BurgerMenuState) => prev.backToMainMenu());
    };

    const handlePermissionChange = (key: string, value: boolean) => {
        setMenuState((prev: BurgerMenuState) => prev.updatePermission(key, value));
        onPermissionChange?.(key, value);
    };

    // Navigation handler (Strategy Pattern)
    const handleNavigation = (path: string) => {
        onNavigate(path);
        handleCloseMenu();
    };

    // Outside click detection (Observer Pattern)
    useEffect(() => {
        if (!menuState.isMenuOpen && !menuState.isPermissionsOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            
            if (
                menuRef.current &&
                permissionsRef.current &&
                !menuRef.current.contains(target) &&
                !permissionsRef.current.contains(target)
            ) {
                handleCloseMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuState.isMenuOpen, menuState.isPermissionsOpen]);

    // Keyboard navigation (Accessibility Pattern)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleCloseMenu();
            }
        };

        if (menuState.isMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [menuState.isMenuOpen]);

    return (
        <BurgerMenuView
            navigationItems={navigationItems}
            currentPath={currentPath}
            menuState={menuState}
            onToggleMenu={handleToggleMenu}
            onCloseMenu={handleCloseMenu}
            onTogglePermissions={handleTogglePermissions}
            onToggleRoadmap={handleToggleRoadmap}
            onBackToMainMenu={handleBackToMainMenu}
            onNavigate={handleNavigation}
            onPermissionChange={handlePermissionChange}
            menuRef={menuRef}
            permissionsRef={permissionsRef}
        />
    );
}
