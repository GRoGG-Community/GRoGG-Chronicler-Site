/**
 * LocalStorage utility for managing persistent state
 * Infrastructure layer - handles browser storage concerns
 */
export class StorageService {
    static setItem(key: string, value: any): void {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.warn(`Failed to save to localStorage:`, error);
            }
        }
    }

    static getItem<T>(key: string, defaultValue: T): T {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(key);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (error) {
                console.warn(`Failed to load from localStorage:`, error);
            }
        }
        return defaultValue;
    }

    static removeItem(key: string): void {
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn(`Failed to remove from localStorage:`, error);
            }
        }
    }

    static clear(): void {
        if (typeof window !== 'undefined') {
            try {
                localStorage.clear();
            } catch (error) {
                console.warn(`Failed to clear localStorage:`, error);
            }
        }
    }
}
