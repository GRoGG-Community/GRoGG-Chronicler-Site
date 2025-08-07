import { MenuState, UserPermissions } from '../../../data/types/BurgerMenuTypes';
import { UserPreferencesController } from '../../../business/controllers/UserPreferencesController';

/**
 * BurgerMenuState (State Pattern, Immutable State)
 * Manages the state of the burger menu using immutable state transitions.
 * Implements the State pattern for clean state management.
 * Follows immutability principles for predictable state changes.
 */

export default class BurgerMenuState implements MenuState {
    public readonly isMenuOpen: boolean;
    public readonly isPermissionsOpen: boolean;
    public readonly isRoadmapOpen: boolean;
    public readonly userPermissions: UserPermissions;

    constructor(
        userPermissions: UserPermissions = {},
        isMenuOpen: boolean = false,
        isPermissionsOpen: boolean = false,
        isRoadmapOpen: boolean = false
    ) {
        this.userPermissions = { ...userPermissions };
        this.isMenuOpen = isMenuOpen;
        this.isPermissionsOpen = isPermissionsOpen;
        this.isRoadmapOpen = isRoadmapOpen;

        // Persist permissions to storage via business layer controller
        UserPreferencesController.saveUserPermissions(this.userPermissions);
    }

    /**
     * Factory method to create initial state from storage
     */
    static createInitialState(): BurgerMenuState {
        const savedPermissions = UserPreferencesController.getUserPermissions();

        return new BurgerMenuState(savedPermissions);
    }

    /**
     * State transition methods (State Pattern)
     */
    toggleMenu(): BurgerMenuState {
        return new BurgerMenuState(
            this.userPermissions,
            !this.isMenuOpen,
            false, // Close other panels when opening menu
            false
        );
    }

    closeAll(): BurgerMenuState {
        return new BurgerMenuState(
            this.userPermissions,
            false,
            false,
            false
        );
    }

    togglePermissions(): BurgerMenuState {
        return new BurgerMenuState(
            this.userPermissions,
            this.isMenuOpen,
            !this.isPermissionsOpen,
            false // Close roadmap when opening permissions
        );
    }

    toggleRoadmap(): BurgerMenuState {
        return new BurgerMenuState(
            this.userPermissions,
            this.isMenuOpen, // Keep menu open state when toggling roadmap
            false, // Close permissions when opening roadmap
            !this.isRoadmapOpen
        );
    }

    backToMainMenu(): BurgerMenuState {
        return new BurgerMenuState(
            this.userPermissions,
            true, // Keep main menu open
            false, // Close permissions panel
            false  // Close roadmap panel
        );
    }

    updatePermission(key: string, value: boolean): BurgerMenuState {
        const updatedPermissions = {
            ...this.userPermissions,
            [key]: value
        };

        return new BurgerMenuState(
            updatedPermissions,
            this.isMenuOpen,
            this.isPermissionsOpen,
            this.isRoadmapOpen
        );
    }

    /**
     * Utility methods
     */
    hasPermission(key: string): boolean {
        return Boolean(this.userPermissions[key]);
    }

    isAnyPanelOpen(): boolean {
        return this.isMenuOpen || this.isPermissionsOpen || this.isRoadmapOpen;
    }
}
