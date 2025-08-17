/**
 * StandardizedMessage Component
 * Provides consistent error and success message display across the application
 * Follows presentation layer principles with proper styling and accessibility
 */
import React from 'react';

export interface MessageProps {
    type: 'error' | 'success' | 'warning' | 'info';
    message: string;
    onDismiss?: () => void;
    dismissible?: boolean;
    autoHide?: boolean;
    duration?: number;
}

export function StandardizedMessage({ 
    type, 
    message, 
    onDismiss, 
    dismissible = true,
    autoHide = false,
    duration = 5000 
}: MessageProps) {
    // Auto-hide functionality
    React.useEffect(() => {
        if (autoHide && onDismiss) {
            const timer = setTimeout(onDismiss, duration);
            return () => clearTimeout(timer);
        }
    }, [autoHide, onDismiss, duration]);

    // Don't render if message is empty
    if (!message || message.trim() === '') {
        return null;
    }

    const getMessageIcon = () => {
        switch (type) {
            case 'error': return '❌';
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '';
        }
    };

    const getAriaRole = () => {
        switch (type) {
            case 'error': return 'alert';
            case 'success': return 'status';
            case 'warning': return 'alert';
            case 'info': return 'status';
            default: return 'status';
        }
    };

    return (
        <div 
            className={`standardized-message ${type}-message`}
            role={getAriaRole()}
            aria-live="polite"
        >
            <div className="message-content">
                <span className="message-icon" aria-hidden="true">
                    {getMessageIcon()}
                </span>
                <span className="message-text">
                    {message}
                </span>
            </div>
            
            {dismissible && onDismiss && (
                <button
                    className="message-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss message"
                    type="button"
                >
                    ×
                </button>
            )}
        </div>
    );
}

/**
 * Convenience components for specific message types
 */
export function ErrorMessage({ message, onDismiss, dismissible }: Omit<MessageProps, 'type'>) {
    return (
        <StandardizedMessage
            type="error"
            message={message}
            onDismiss={onDismiss}
            dismissible={dismissible}
        />
    );
}

export function SuccessMessage({ message, onDismiss, dismissible, autoHide }: Omit<MessageProps, 'type'>) {
    return (
        <StandardizedMessage
            type="success"
            message={message}
            onDismiss={onDismiss}
            dismissible={dismissible}
            autoHide={autoHide}
        />
    );
}

export function WarningMessage({ message, onDismiss, dismissible }: Omit<MessageProps, 'type'>) {
    return (
        <StandardizedMessage
            type="warning"
            message={message}
            onDismiss={onDismiss}
            dismissible={dismissible}
        />
    );
}

export function InfoMessage({ message, onDismiss, dismissible }: Omit<MessageProps, 'type'>) {
    return (
        <StandardizedMessage
            type="info"
            message={message}
            onDismiss={onDismiss}
            dismissible={dismissible}
        />
    );
}
