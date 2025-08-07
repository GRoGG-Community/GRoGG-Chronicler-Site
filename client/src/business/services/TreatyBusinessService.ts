/**
 * TreatyBusinessService
 * Business layer service for treaty operations.
 * Handles business logic, validation, and orchestration.
 * Delegates data operations to TreatyDataService.
 */

import { Treaty } from '../../data/models/Treaty';
import { AppError, ErrorCode } from '../../infrastructure/errors/AppError';
import { TreatyDataService } from '../../data/services/TreatyDataService';
import { TreatyCache } from '../../data/cache/EntityCacheManager';

export class TreatyBusinessService {
    /**
     * Business validation: Validate treaty data
     */
    static validateTreaty(treaty: Partial<Treaty>): string | null {
        if (!treaty.title?.trim()) {
            return 'Treaty title is required';
        }
        if (treaty.title.length > 100) {
            return 'Treaty title must be less than 100 characters';
        }
        if (!treaty.content?.trim()) {
            return 'Treaty content is required';
        }
        if (!treaty.owner?.trim()) {
            return 'Treaty owner is required';
        }
        return null;
    }

    /**
     * Business logic: Check if user can edit a treaty
     */
    static canEdit(treaty: Treaty, userAccount?: string): boolean {
        if (!treaty || !userAccount) return false;
        return treaty.owner === userAccount || userAccount === 'GameMaster';
    }
    
    /**
     * Business logic: Check if user can delete a treaty
     */
    static canDelete(treaty: Treaty, userAccount?: string): boolean {
        return this.canEdit(treaty, userAccount);
    }
    
    /**
     * Business logic: Format treaty display title
     */
    static formatDisplayTitle(treaty: Treaty): string {
        if (!treaty.title) return 'Untitled Treaty';
        return treaty.title;
    }
    
    /**
     * Business logic: Search and filter treaties
     */
    static searchTreaties(treaties: Treaty[], query: string): Treaty[] {
        if (!query.trim()) return treaties;
        
        const searchTerm = query.toLowerCase();
        return treaties.filter(treaty =>
            treaty.title?.toLowerCase().includes(searchTerm) ||
            treaty.content?.toLowerCase().includes(searchTerm) ||
            treaty.owner?.toLowerCase().includes(searchTerm) ||
            (Array.isArray(treaty.participants) && treaty.participants.some(p => p.toLowerCase().includes(searchTerm)))
        );
    }

    /**
     * Business operation: Create treaty with validation and cache management
     */
    static async createTreaty(treatyData: Partial<Treaty>): Promise<Treaty> {
        // Business validation
        const validationError = this.validateTreaty(treatyData);
        if (validationError) {
            throw new AppError(validationError, ErrorCode.VALIDATION_ERROR);
        }

        const response = await TreatyDataService.createTreaty(treatyData);
        const result = await response.json();
        
        // Business logic: Invalidate cache after successful creation
        TreatyCache.invalidate();
        
        return result;
    }

    /**
     * Business operation: Update treaty with validation and cache management
     */
    static async updateTreaty(id: string, treatyData: Partial<Treaty>): Promise<Treaty> {
        if (!id?.trim()) {
            throw new AppError('Treaty ID is required', ErrorCode.VALIDATION_ERROR);
        }

        // Business validation
        const validationError = this.validateTreaty(treatyData);
        if (validationError) {
            throw new AppError(validationError, ErrorCode.VALIDATION_ERROR);
        }

        const response = await TreatyDataService.updateTreaty(id, treatyData);
        const result = await response.json();
        
        // Business logic: Invalidate cache after successful update
        TreatyCache.invalidate();
        
        return result;
    }

    /**
     * Business operation: Delete treaty with validation and cache management
     */
    static async deleteTreaty(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new AppError('Treaty ID is required for deletion', ErrorCode.VALIDATION_ERROR);
        }

        const response = await TreatyDataService.deleteTreaty(id);
        if (!response.ok) {
            throw new AppError('Failed to delete treaty', ErrorCode.SERVER_ERROR);
        }
        
        // Business logic: Invalidate cache after successful deletion
        TreatyCache.invalidate();
    }

    /**
     * Business operation: Get all treaties
     */
    static async getTreaties(): Promise<Treaty[]> {
        return await TreatyDataService.fetchTreatiesRaw();
    }

    /**
     * Business operation: Get treaties as a map
     */
    static async getTreatiesMap(): Promise<Record<string, Treaty>> {
        return await TreatyDataService.fetchTreatiesMap();
    }
}
