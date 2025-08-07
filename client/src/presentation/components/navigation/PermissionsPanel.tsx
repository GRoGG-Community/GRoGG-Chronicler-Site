import React, { forwardRef } from 'react';
import { UserPermissions } from '../../../data/types/BurgerMenuTypes';

/**
 * PermissionsPanel (Presentational Component, Template Method Pattern)
 * Renders user permissions management interface.
 * Implements Template Method pattern for consistent panel structure.
 * Uses forwardRef for outside click detection.
 */

interface PermissionsPanelProps {
    permissions: UserPermissions;
    onPermissionChange: (key: string, value: boolean) => void;
    onClose: () => void;
    onBackToMainMenu: () => void;
}

const permissionDefinitions = [
    {
        key: 'canDeleteMessages',
        label: 'Delete Messages',
        description: 'Allow deletion of chat messages'
    },
    {
        key: 'canManageAccounts',
        label: 'Manage Accounts',
        description: 'Create, edit, and delete user accounts'
    },
    {
        key: 'canManageEmpires',
        label: 'Manage Empires',
        description: 'Create, edit, and delete empire information'
    },
    {
        key: 'canViewRoadmap',
        label: 'View Roadmap',
        description: 'Access development roadmap and features'
    }
];

const PermissionsPanel = forwardRef<HTMLDivElement | null, PermissionsPanelProps>(
    ({ permissions, onPermissionChange, onClose, onBackToMainMenu }, ref) => {
        const handleTogglePermission = (key: string) => {
            const currentValue = Boolean(permissions[key]);
            onPermissionChange(key, !currentValue);
        };

        const handleKeyDown = (event: React.KeyboardEvent, key: string) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleTogglePermission(key);
            }
        };

        return (
            <div 
                ref={ref}
                className="burger-permissions-panel"
                role="dialog"
                aria-label="User permissions"
            >
                <div className="burger-panel-header">
                    <h3>User Permissions</h3>
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
                            aria-label="Close permissions panel"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="burger-panel-content">
                    <p className="permissions-description">
                        Manage your user permissions and access levels.
                    </p>

                    <div className="permissions-list">
                        {permissionDefinitions.map(permission => {
                            const isEnabled = Boolean(permissions[permission.key]);
                            
                            return (
                                <div 
                                    key={permission.key}
                                    className="permission-item"
                                >
                                    <div className="permission-info">
                                        <label 
                                            htmlFor={`permission-${permission.key}`}
                                            className="permission-label"
                                        >
                                            {permission.label}
                                        </label>
                                        <p className="permission-description">
                                            {permission.description}
                                        </p>
                                    </div>

                                    <button
                                        id={`permission-${permission.key}`}
                                        className={`permission-toggle ${isEnabled ? 'enabled' : 'disabled'}`}
                                        onClick={() => handleTogglePermission(permission.key)}
                                        onKeyDown={(e) => handleKeyDown(e, permission.key)}
                                        aria-pressed={isEnabled}
                                        aria-label={`${permission.label}: ${isEnabled ? 'enabled' : 'disabled'}`}
                                    >
                                        <span className="toggle-indicator" aria-hidden="true">
                                            {isEnabled ? '✓' : '✗'}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
);

PermissionsPanel.displayName = 'PermissionsPanel';

export default PermissionsPanel;
