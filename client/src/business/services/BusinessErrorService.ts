/**
 * Business Layer Error Handling Service
 * Integrates with infrastructure error handling
 * Provides proper layer separation for error processing
 */
import { AppError, ErrorHandler } from '../../infrastructure/errors/AppError';

export interface BusinessErrorService {
    processError: (error: unknown) => string;
    createSuccessMessage: (operation: string) => string;
}

export class BusinessErrorServiceImpl implements BusinessErrorService {
    processError(error: unknown): string {
        // Use infrastructure error handling for proper error processing
        const appError = ErrorHandler.handle(error);
        const displayMessage = ErrorHandler.getDisplayMessage(appError);
        
        // Log the original error for debugging
        console.error('Business Error:', appError);
        
        return displayMessage;
    }

    createSuccessMessage(operation: string): string {
        const operationMap: Record<string, string> = {
            'createAccount': 'Account created successfully',
            'updateAccount': 'Account updated successfully',
            'deleteAccount': 'Account deleted successfully',
            'createTreaty': 'Treaty created successfully',
            'updateTreaty': 'Treaty updated successfully',
            'deleteTreaty': 'Treaty deleted successfully',
            'createEmpire': 'Empire created successfully',
            'updateEmpire': 'Empire updated successfully',
            'deleteEmpire': 'Empire deleted successfully',
            'postMessage': 'Message posted successfully',
            'editMessage': 'Message updated successfully',
            'deleteMessage': 'Message deleted successfully'
        };

        return operationMap[operation] || 'Operation completed successfully';
    }
}

// Singleton instance for business layer
export const businessErrorService = new BusinessErrorServiceImpl();
