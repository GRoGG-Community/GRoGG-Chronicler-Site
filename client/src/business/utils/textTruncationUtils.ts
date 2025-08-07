/**
 * Text truncation utility
 * Provides functions for truncating text with ellipsis
 */

export function cutText(str: string, max: number = 18): string {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '…' : str;
}

// Legacy compatibility - maintain the same API as the original component
const cutOffDotter = {
    cut: cutText
};

export default cutOffDotter;
