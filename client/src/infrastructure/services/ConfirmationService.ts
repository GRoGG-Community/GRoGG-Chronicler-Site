/**
 * ConfirmationService (Infrastructure Layer)
 * Handles user confirmation dialogs through browser APIs.
 * Provides abstraction for presentation layer confirmation needs.
 */

export class ConfirmationService {
    /**
     * Show a confirmation dialog to the user
     */
    static confirm(message: string): boolean {
        return window.confirm(message);
    }

    /**
     * Show a delete confirmation dialog with standard formatting
     */
    static confirmDelete(itemType: string, itemName: string): boolean {
        return window.confirm(`Delete ${itemType} "${itemName}"? This cannot be undone.`);
    }

    /**
     * Show an action confirmation dialog
     */
    static confirmAction(action: string, target?: string): boolean {
        const message = target ? `${action} "${target}"?` : `${action}?`;
        return window.confirm(message);
    }
}
