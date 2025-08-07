// Cross-cutting utility types
export interface LoadingState {
    loading: boolean;
    error: string;
    success: string;
}

export interface EntityState<T> {
    data: T[];
    loading: boolean;
    error: string;
    lastFetch: Date | null;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationState {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
}

export interface SearchState {
    query: string;
    filters: Record<string, any>;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

export interface UIState {
    isModalOpen: boolean;
    selectedItem: any;
    activeTab: string;
    showSidebar: boolean;
}

// Generic CRUD operation types
export interface CRUDOperations<T> {
    create: (data: Partial<T>) => Promise<T>;
    read: () => Promise<T[]>;
    update: (id: string | number, data: Partial<T>) => Promise<T>;
    delete: (id: string | number) => Promise<void>;
}

// Event handler types
export type EventHandler<T = any> = (data: T) => void;
export type AsyncEventHandler<T = any> = (data: T) => Promise<void>;

// Validation types
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}
