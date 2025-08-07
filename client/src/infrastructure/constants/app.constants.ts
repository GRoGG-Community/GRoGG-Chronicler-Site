export const APP_CONSTANTS = {
    POLLING_INTERVAL: 30000, // General polling (30 seconds)
    MESSAGE_POLLING_INTERVAL: 2000, // Real-time message polling (2 seconds)
    MAX_MESSAGE_LENGTH: 1000,
    DEBOUNCE_DELAY: 300,
    DEFAULT_PAGE_SIZE: 10
};

export const TEXT_LIMITS = {
    TREATY_TITLE_PREVIEW: 48,
    TREATY_OWNER_PREVIEW: 24,
    TREATY_PARTICIPANTS_PREVIEW: 46,
    TREATY_CONTENT_PREVIEW: 220,
    EMPIRE_LORE_PREVIEW: 100,
    PARTICIPANT_DROPDOWN_PREVIEW: 12,
    PARTICIPANT_ITEM_PREVIEW: 32
};

export const ENTITY_LIMITS = {
    MAX_EMPIRES: 50,
    MAX_TREATIES: 100,
    MAX_ACCOUNTS: 20
};

export const UI_CONSTANTS = {
    BURGER_MENU_ANIMATION_DURATION: 200,
    MODAL_OVERLAY_Z_INDEX: 1000,
    NOTIFICATION_TIMEOUT: 5000
};

// Note: Treaty statuses moved to business/utils/treatyUtils.ts for better organization
export const STATUS_CONSTANTS = {
    EMPIRE_STATUSES: ['Active', 'Inactive', 'Locked']
};
