export enum ErrorCode {
    NETWORK_ERROR = 'NETWORK_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTH_ERROR = 'AUTH_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    SERVER_ERROR = 'SERVER_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export class AppError extends Error {
    constructor(
        message: string,
        public code: ErrorCode,
        public statusCode: number = 500,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }

    static fromNetworkError(error: any): AppError {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return new AppError('Network connection failed', ErrorCode.NETWORK_ERROR, 0);
        }
        return new AppError(error.message || 'Network error', ErrorCode.NETWORK_ERROR);
    }

    static fromValidationError(message: string, details?: any): AppError {
        return new AppError(message, ErrorCode.VALIDATION_ERROR, 400, details);
    }

    static fromServerError(message: string, statusCode: number = 500): AppError {
        return new AppError(message, ErrorCode.SERVER_ERROR, statusCode);
    }
}

export const ErrorHandler = {
    handle: (error: unknown): AppError => {
        if (error instanceof AppError) return error;
        if (error instanceof Error) {
            return new AppError(error.message, ErrorCode.NETWORK_ERROR);
        }
        return new AppError('Unknown error occurred', ErrorCode.NETWORK_ERROR);
    },

    isNetworkError: (error: AppError): boolean => {
        return error.code === ErrorCode.NETWORK_ERROR;
    },

    isValidationError: (error: AppError): boolean => {
        return error.code === ErrorCode.VALIDATION_ERROR;
    },

    getDisplayMessage: (error: AppError): string => {
        switch (error.code) {
            case ErrorCode.NETWORK_ERROR:
                return 'Connection failed. Please check your internet connection.';
            case ErrorCode.VALIDATION_ERROR:
                return error.message;
            case ErrorCode.AUTH_ERROR:
                return 'Authentication failed. Please log in again.';
            case ErrorCode.NOT_FOUND:
                return 'The requested resource was not found.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    }
};
