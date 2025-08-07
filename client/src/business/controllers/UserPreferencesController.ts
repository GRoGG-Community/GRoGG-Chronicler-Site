import { StorageService } from '../../infrastructure/storage/StorageService';
import { UserPermissions } from '../../data/types/BurgerMenuTypes';

/**
 * UserPreferencesController (Business Layer)
 * Handles user preferences storage operations.
 * Provides abstraction between presentation layer and infrastructure storage.
 */

export class UserPreferencesController {
    /**
     * Get user permissions from storage
     */
    static getUserPermissions(): UserPermissions {
        return StorageService.getItem<UserPermissions>(
            'stellarisGmPermissions', 
            { canDeleteMessages: true }
        );
    }

    /**
     * Save user permissions to storage
     */
    static saveUserPermissions(permissions: UserPermissions): void {
        StorageService.setItem('stellarisGmPermissions', permissions);
    }

    /**
     * Clear user preferences
     */
    static clearUserPreferences(): void {
        StorageService.removeItem('stellarisGmPermissions');
    }
}
