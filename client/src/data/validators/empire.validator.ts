import { AppError, ErrorCode } from '../../infrastructure/errors/AppError';
import { Empire } from '../models/Empire';
import { ValidationResult } from '../../infrastructure/types/common.types';

export class EmpireValidator {
    static validate(data: Partial<Empire>): ValidationResult {
        const errors: string[] = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Empire name must be at least 2 characters');
        }
        
        if (data.name && data.name.length > 50) {
            errors.push('Empire name must be less than 50 characters');
        }
        
        if (data.account && data.account.length > 30) {
            errors.push('Account name must be less than 30 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static sanitize(data: Partial<Empire>): Partial<Empire> {
        return {
            ...data,
            name: data.name?.trim(),
            account: data.account?.trim() || undefined,
            lore: data.lore?.trim() || undefined,
            stats: data.stats?.trim() || undefined,
            ethics: data.ethics?.trim() || undefined,
            civics: data.civics?.trim() || undefined,
            special: data.special?.trim() || undefined
        };
    }
    
    static validateAndThrow(data: Partial<Empire>): void {
        const result = this.validate(data);
        if (!result.isValid) {
            throw new AppError(
                result.errors.join(', '),
                ErrorCode.VALIDATION_ERROR,
                400,
                { errors: result.errors }
            );
        }
    }
}
