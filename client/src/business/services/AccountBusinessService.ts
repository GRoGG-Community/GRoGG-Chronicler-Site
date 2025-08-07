/**
 * AccountBusinessService
 * Business layer service for account operations.
 * Handles business logic, validation, and orchestration.
 * Delegates data operations to AccountDataService.
 */

import Account from '../../data/models/Account';
import { AppError, ErrorCode } from '../../infrastructure/errors/AppError';
import { AccountDataService } from '../../data/services/AccountDataService';
import { AccountCache } from '../../data/cache/EntityCacheManager';

export class AccountBusinessService {
    /**
     * Business logic: Check if user can edit an account
     */
    static canEdit(account: Account, userAccount?: string): boolean {
        if (!account || !userAccount) return false;
        return account.name === userAccount || userAccount === 'GameMaster';
    }
    
    /**
     * Business logic: Check if user can delete an account
     */
    static canDelete(account: Account, userAccount?: string): boolean {
        return this.canEdit(account, userAccount);
    }
    
    /**
     * Business logic: Format account display name
     */
    static formatDisplayName(account: Account): string {
        if (!account.name) return 'Unnamed Account';
        return account.name;
    }
    
    /**
     * Business logic: Search and filter accounts
     */
    static searchAccounts(accounts: Account[], query: string): Account[] {
        if (!query.trim()) return accounts;
        
        const searchTerm = query.toLowerCase();
        return accounts.filter(account =>
            account.name?.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Business logic: Get empires linked to an account
     */
    static getLinkedEmpires(accountName: string, empires: any[]): any[] {
        return empires.filter(empire => empire.account === accountName);
    }

    /**
     * Business operation: Create account with validation and cache management
     */
    static async createAccount(name: Account["name"], password: Account["password"]): Promise<Response> {
        // Business validation
        if (!name?.trim()) {
            throw new AppError('Account name is required', ErrorCode.VALIDATION_ERROR);
        }
        if (!password?.trim()) {
            throw new AppError('Password is required', ErrorCode.VALIDATION_ERROR);
        }

        const response = await AccountDataService.createAccount(name, password);
        
        // Business logic: Invalidate cache after successful creation
        AccountCache.invalidate();
        
        return response;
    }

    /**
     * Business operation: Update account with validation and cache management
     */
    static async updateAccount(id: Account["id"], name: Account["name"], password: Account["password"]): Promise<Response> {
        // Business validation
        if (!name?.trim()) {
            throw new AppError('Account name is required', ErrorCode.VALIDATION_ERROR);
        }
        if (!password?.trim()) {
            throw new AppError('Password is required', ErrorCode.VALIDATION_ERROR);
        }

        const response = await AccountDataService.editAccount(id, name, password);
        
        // Business logic: Invalidate cache after successful update
        AccountCache.invalidate();
        
        return response;
    }

    /**
     * Business operation: Delete account with validation and cache management
     */
    static async deleteAccount(name: string): Promise<void> {
        if (!name?.trim()) {
            throw new AppError('Account name is required for deletion', ErrorCode.VALIDATION_ERROR);
        }

        const response = await AccountDataService.deleteAccount(name);
        if (response && !response.ok) {
            throw new AppError('Failed to delete account', ErrorCode.SERVER_ERROR);
        }
        
        // Business logic: Invalidate cache after successful deletion
        AccountCache.invalidate();
    }

    /**
     * Business operation: Get all accounts
     */
    static async getAccounts(): Promise<Account[]> {
        return await AccountDataService.fetchAccountsRaw();
    }
}
