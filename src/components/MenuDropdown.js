import React from 'react';

export default function MenuDropdown({
    showMenu,
    showPermissions,
    showRoadmap,
    handleMenuToggle,
    handleLogout,
    account,
    handlePermissionsToggle,
    gmPermissions,
    handlePermissionChange,
    handleRoadmapToggle,
    menuDropdownRef,
    permissionsDropdownRef
}) {
    return (
        <div className="menu-dropdown-container">
            <button
                className="menu-btn"
                aria-label="Open menu"
                onClick={handleMenuToggle}
            >
                <span className="menu-icon">&#9776;</span>
            </button>
            {showMenu && (
                <div
                    className="menu-dropdown"
                    ref={menuDropdownRef}
                >
                    <button className="menu-dropdown-item" onClick={handleRoadmapToggle}>
                        <span role="img" aria-label="Roadmap">🗺️</span> Roadmap
                    </button>
                    <button className="menu-dropdown-item logout-btn" onClick={handleLogout}>
                        <span className="logout-icon">&#x1F511;</span> Logout
                    </button>
                    {account && account.username === "GameMaster" && (
                        <button className="menu-dropdown-item" onClick={handlePermissionsToggle}>
                            Manage Permissions
                        </button>
                    )}
                </div>
            )}
            {showPermissions && (
                <div
                    className="menu-permissions-dropdown"
                    ref={permissionsDropdownRef}
                >
                    <div className="menu-permissions-title">GameMaster Permissions</div>
                    <label className="menu-permissions-option">
                        <input
                            type="checkbox"
                            checked={!!gmPermissions.canDeleteMessages}
                            onChange={e => handlePermissionChange('canDeleteMessages', e.target.checked)}
                        />
                        Allow deleting messages
                    </label>
                </div>
            )}
        </div>
    );
}
