/**
 * EmpireBusinessService
 * Business layer service for empire operations.
 * Handles business logic, validation, and orchestration.
 * Delegates data operations to EmpireDataService.
 */

import { Empire } from '../../data/models/Empire';
import { EmpireValidator } from '../../data/validators/empire.validator';
import { ValidationResult } from '../../infrastructure/types/common.types';
import { AppError, ErrorCode } from '../../infrastructure/errors/AppError';
import { EmpireDataService } from '../../data/services/EmpireDataService';
import { EmpireCache, EmpireInfoCache } from '../../data/cache/EntityCacheManager';

export class EmpireBusinessService {
    /**
     * Business validation: Validate empire data
     */
    static validateEmpireData(data: Partial<Empire>): ValidationResult {
        return EmpireValidator.validate(data);
    }

    /**
     * Business validation: Validate empire name with business rules
     */
    static validateEmpireName(name: string, existingEmpires: Empire[], currentEmpireId?: string | number): string | null {
        const trimmedName = name.trim();
        
        if (!trimmedName) {
            return 'Empire name is required';
        }
        
        if (trimmedName.length < 2) {
            return 'Empire name must be at least 2 characters';
        }
        
        if (trimmedName.length > 50) {
            return 'Empire name must be less than 50 characters';
        }
        
        // Check for duplicate names (excluding current empire if updating)
        const isDuplicate = existingEmpires.some(empire => 
            empire.id !== currentEmpireId && 
            empire.name.toLowerCase() === trimmedName.toLowerCase()
        );
        
        if (isDuplicate) {
            return 'An empire with this name already exists';
        }
        
        return null; // Valid
    }

    /**
     * Business validation: Validate empire name update
     */
    static validateEmpireNameUpdate(newName: string, currentEmpire: Empire, existingEmpires: Empire[]): string | null {
        const trimmedName = newName.trim();
        
        if (trimmedName === currentEmpire.name) {
            return 'Please enter a different name';
        }
        
        return this.validateEmpireName(newName, existingEmpires, currentEmpire.id);
    }

    /**
     * Business logic: Check if user can edit an empire
     */
    static canEdit(empire: Empire, userAccount?: string): boolean {
        if (!empire || !userAccount) return false;
        return empire.account === userAccount || userAccount === 'GameMaster';
    }

    /**
     * Business logic: Check if user can delete an empire
     */
    static canDelete(empire: Empire, userAccount?: string): boolean {
        return this.canEdit(empire, userAccount);
    }

    /**
     * Business logic: Format empire display name
     */
    static formatDisplayName(empire: Empire): string {
        if (!empire.name) return 'Unnamed Empire';
        return empire.name;
    }

    /**
     * Business logic: Search and filter empires
     */
    static searchEmpires(empires: Empire[], query: string): Empire[] {
        if (!query.trim()) return empires;
        
        const searchTerm = query.toLowerCase();
        return empires.filter(empire =>
            empire.name?.toLowerCase().includes(searchTerm) ||
            empire.account?.toLowerCase().includes(searchTerm) ||
            empire.lore?.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Business operation: Create empire with validation and cache management
     */
    static async createEmpire(empireData: Partial<Empire>): Promise<Empire> {
        const validation = this.validateEmpireData(empireData);
        if (!validation.isValid) {
            throw new AppError(validation.errors?.join(', ') || 'Invalid empire data', ErrorCode.VALIDATION_ERROR);
        }
        
        const response = await EmpireDataService.createEmpire(empireData);
        
        // Business logic: Invalidate cache after successful creation
        EmpireCache.invalidate();
        
        return response;
    }

    /**
     * Business operation: Update empire with validation and cache management
     */
    static async updateEmpire(id: string | number, empireData: Partial<Empire>): Promise<Empire> {
        const validation = this.validateEmpireData(empireData);
        if (!validation.isValid) {
            throw new AppError(validation.errors?.join(', ') || 'Invalid empire data', ErrorCode.VALIDATION_ERROR);
        }
        
        const response = await EmpireDataService.updateEmpire(id, empireData);
        
        // Business logic: Invalidate cache after successful update
        EmpireCache.invalidate();
        
        return response;
    }

    /**
     * Business operation: Save empire info with cache management
     */
    static async saveEmpireInfo(id: string, infoData: any): Promise<any> {
        if (!id?.trim()) {
            throw new AppError('Empire ID is required', ErrorCode.VALIDATION_ERROR);
        }
        
        const response = await EmpireDataService.saveEmpireInfo(id, infoData);
        
        // Business logic: Invalidate cache after successful save
        EmpireInfoCache.invalidate();
        
        return response;
    }

    /**
     * Business operation: Delete empire with validation and cache management
     */
    static async deleteEmpire(id: string | number): Promise<void> {
        if (!id) {
            throw new AppError('Empire ID is required for deletion', ErrorCode.VALIDATION_ERROR);
        }
        
        await EmpireDataService.deleteEmpire(id);
        
        // Business logic: Invalidate cache after successful deletion
        EmpireCache.invalidate();
    }

    /**
     * Business operation: Get all empires
     */
    static async getEmpires(): Promise<Empire[]> {
        return await EmpireDataService.fetchEmpires();
    }

    /**
     * Business operation: Link empire to account
     */
    static async linkEmpireToAccount(empireId: Empire['id'], accountName: string): Promise<Response> {
        if (!empireId || !accountName?.trim()) {
            throw new AppError('Empire ID and account name are required', ErrorCode.VALIDATION_ERROR);
        }
        
        const response = await EmpireDataService.linkEmpireToAccount(empireId, accountName);
        
        // Business logic: Invalidate cache after linking
        EmpireCache.invalidate();
        
        return response;
    }

    /**
     * Business operation: Unlink empire from account
     */
    static async unlinkEmpireFromAccount(empireId: Empire['id']): Promise<Response> {
        if (!empireId) {
            throw new AppError('Empire ID is required', ErrorCode.VALIDATION_ERROR);
        }
        
        const response = await EmpireDataService.unlinkEmpireFromAccount(empireId);
        
        // Business logic: Invalidate cache after unlinking
        EmpireCache.invalidate();
        
        return response;
    }
}
