/**
 * Burger Menu Types
 * Type definitions for the burger menu navigation system.
 * Contains interfaces for navigation items, user permissions, and menu state.
 */

export interface NavigationItem {
    key: string;
    label: string;
    path: string;
    icon?: string;
    requiresPermission?: string;
    isSpecial?: boolean;
}

export interface UserPermissions {
    canDeleteMessages?: boolean;
    canManageAccounts?: boolean;
    canManageEmpires?: boolean;
    canViewRoadmap?: boolean;
    [key: string]: boolean | undefined;
}

export interface MenuState {
    isMenuOpen: boolean;
    isPermissionsOpen: boolean;
    isRoadmapOpen: boolean;
    userPermissions: UserPermissions;
}

export type MenuAction = 
    | 'TOGGLE_MENU'
    | 'CLOSE_ALL'
    | 'TOGGLE_PERMISSIONS'
    | 'TOGGLE_ROADMAP'
    | 'UPDATE_PERMISSION';

export interface MenuActionPayload {
    type: MenuAction;
    key?: string;
    value?: boolean;
}
