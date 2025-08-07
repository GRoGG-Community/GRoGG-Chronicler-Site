import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BurgerMenuManager from './BurgerMenuManager';
import { NavigationItem } from '../../../data/types/BurgerMenuTypes';

/**
 * NavigationManager (Facade Pattern, Integration Component)
 * Integrates the burger menu system with the existing navigation.
 * Implements Facade pattern to simplify complex navigation operations.
 * Provides a clean interface between routing and menu systems.
 */

// Navigation configuration (Strategy Pattern)
const navigationItems: NavigationItem[] = [
    {
        key: 'channels',
        label: 'Channels',
        path: '/channels',
        icon: '💬'
    },
    {
        key: 'empires',
        label: 'Empires',
        path: '/empires',
        icon: '🏛️'
    },
    {
        key: 'treaties',
        label: 'Treaties',
        path: '/treaties',
        icon: '📜'
    },
    {
        key: 'accounts',
        label: 'Manage Accounts',
        path: '/accounts',
        icon: '👥',
        requiresPermission: 'canManageAccounts'
    },
    {
        key: 'manage-empires',
        label: 'Manage Empires',
        path: '/manage-empires',
        icon: '⚔️',
        requiresPermission: 'canManageEmpires',
        isSpecial: true
    }
];

interface NavigationManagerProps {
    className?: string;
}

export default function NavigationManager({ className }: NavigationManagerProps) {
    const navigate = useNavigate();
    const location = useLocation();

    // Navigation handler (Strategy Pattern)
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // Permission change handler (Observer Pattern)
    const handlePermissionChange = (key: string, value: boolean) => {
        // Could integrate with a global permission context here
        // Permission change logic would go here
    };

    return (
        <div className={`navigation-manager ${className || ''}`}>
            <BurgerMenuManager
                navigationItems={navigationItems}
                currentPath={location.pathname}
                onNavigate={handleNavigation}
                onPermissionChange={handlePermissionChange}
            />
        </div>
    );
}
