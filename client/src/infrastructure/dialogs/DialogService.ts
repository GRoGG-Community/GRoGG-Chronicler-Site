/**
 * Confirmation Dialog utility for user confirmation
 * Infrastructure layer - handles browser dialog concerns
 */
export class DialogService {
    static confirm(message: string): boolean {
        if (typeof window !== 'undefined') {
            return window.confirm(message);
        }
        return false;
    }

    static alert(message: string): void {
        if (typeof window !== 'undefined') {
            window.alert(message);
        }
    }

    static prompt(message: string, defaultValue?: string): string | null {
        if (typeof window !== 'undefined') {
            return window.prompt(message, defaultValue);
        }
        return null;
    }
}
