import React from 'react';
import { NavigationItem, UserPermissions } from '../../../data/types/BurgerMenuTypes';

/**
 * NavigationList (Presentational Component, Strategy Pattern)
 * Renders navigation items with permission-based filtering.
 * Implements Strategy pattern for different navigation behaviors.
 * Follows Single Responsibility: only handles navigation item rendering.
 */

interface NavigationListProps {
    items: NavigationItem[];
    currentPath: string;
    userPermissions: UserPermissions;
    onNavigate: (path: string) => void;
}

export default function NavigationList({
    items,
    currentPath,
    userPermissions,
    onNavigate
}: NavigationListProps) {
    
    // Filter items based on permissions (Strategy Pattern)
    const visibleItems = items.filter(item => {
        if (!item.requiresPermission) return true;
        return Boolean(userPermissions[item.requiresPermission]);
    });

    const handleNavigation = (item: NavigationItem) => {
        onNavigate(item.path);
    };

    const handleKeyDown = (event: React.KeyboardEvent, item: NavigationItem) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleNavigation(item);
        }
    };

    return (
        <ul className="burger-nav-list" role="list">
            {visibleItems.map(item => {
                const isActive = currentPath === item.path;
                const itemClasses = [
                    'burger-nav-item',
                    isActive ? 'active' : '',
                    item.isSpecial ? 'special' : ''
                ].filter(Boolean).join(' ');

                return (
                    <li key={item.key} className={itemClasses}>
                        <button
                            className="burger-nav-link"
                            onClick={() => handleNavigation(item)}
                            onKeyDown={(e) => handleKeyDown(e, item)}
                            aria-current={isActive ? 'page' : undefined}
                            title={item.label}
                        >
                            {item.icon && (
                                <span className="burger-nav-icon" aria-hidden="true">
                                    {item.icon}
                                </span>
                            )}
                            <span className="burger-nav-label">
                                {item.label}
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
