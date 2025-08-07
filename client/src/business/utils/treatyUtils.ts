// Consolidated treaty utilities - replaces treatyStatuses.js + treatyStatusOptions.js

export const TREATY_STATUSES = {
    discussion: '🗨️ In Discussion',
    active: '✅ Active',
    broken: '❌ Broken',
    expired: '⌛ Expired',
    other: '❓ Other'
} as const;

export type TreatyStatusKey = keyof typeof TREATY_STATUSES;
export type TreatyStatusValue = typeof TREATY_STATUSES[TreatyStatusKey];

export interface TreatyStatusOption {
    value: TreatyStatusKey;
    label: TreatyStatusValue;
}

// Status options for dropdowns and forms
export const TREATY_STATUS_OPTIONS: TreatyStatusOption[] = Object.entries(TREATY_STATUSES).map(
    ([value, label]) => ({ value: value as TreatyStatusKey, label })
);

// Utility functions for treaty status management
export const treatyStatusUtils = {
    /**
     * Get display label for a status key
     */
    getStatusLabel: (status: TreatyStatusKey): TreatyStatusValue => {
        return TREATY_STATUSES[status];
    },

    /**
     * Check if a status is active
     */
    isActive: (status: TreatyStatusKey): boolean => {
        return status === 'active';
    },

    /**
     * Check if a status indicates the treaty is no longer valid
     */
    isInvalid: (status: TreatyStatusKey): boolean => {
        return status === 'broken' || status === 'expired';
    },

    /**
     * Check if a status is still being negotiated
     */
    isInProgress: (status: TreatyStatusKey): boolean => {
        return status === 'discussion';
    },

    /**
     * Get status color for UI styling
     */
    getStatusColor: (status: TreatyStatusKey): string => {
        switch (status) {
            case 'active': return 'var(--success-color, #28a745)';
            case 'discussion': return 'var(--info-color, #17a2b8)';
            case 'broken': return 'var(--danger-color, #dc3545)';
            case 'expired': return 'var(--warning-color, #ffc107)';
            case 'other': return 'var(--secondary-color, #6c757d)';
            default: return 'var(--secondary-color, #6c757d)';
        }
    },

    /**
     * Get status priority for sorting (lower number = higher priority)
     */
    getStatusPriority: (status: TreatyStatusKey): number => {
        switch (status) {
            case 'active': return 1;
            case 'discussion': return 2;
            case 'other': return 3;
            case 'expired': return 4;
            case 'broken': return 5;
            default: return 6;
        }
    },

    /**
     * Sort treaties by status priority
     */
    sortByStatus: <T extends { status: TreatyStatusKey }>(treaties: T[]): T[] => {
        return [...treaties].sort((a, b) => 
            treatyStatusUtils.getStatusPriority(a.status) - treatyStatusUtils.getStatusPriority(b.status)
        );
    }
};
