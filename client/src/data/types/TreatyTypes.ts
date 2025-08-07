/**
 * Type definitions for Treaty-related entities
 * Contains interfaces for treaties, treaty management, and treaty operations.
 * Centralizes all treaty-related types to maintain consistency across components.
 */

import { Empire } from '../models/Empire';
import Account from '../models/Account';

export interface Treaty {
    id: number | string;
    title: string;
    content?: string;
    owner?: string;
    participants?: string[];
    status?: string;
    [key: string]: any;
}

export interface TreatyFormData {
    title: string;
    content: string;
    participants: string[];
    status: string;
    owner: string;
}

export interface TreatyCreateRequest {
    title: string;
    content?: string;
    participants?: string[];
    status?: string;
    owner: string;
}

export interface TreatyUpdateRequest {
    id: string | number;
    title?: string;
    content?: string;
    participants?: string[];
    status?: string;
    owner?: string;
}

export interface TreatyDeleteRequest {
    id: string | number;
}

// Treaty Status Types
export type TreatyStatus = 
    | 'discussion'
    | 'pending'
    | 'active'
    | 'expired'
    | 'cancelled'
    | 'breached';

export interface TreatyStatusOption {
    value: TreatyStatus;
    label: string;
    color?: string;
}

// Component Props Interfaces
export interface TreatyManagementListProps {
    treaties: Treaty[];
    loaded: boolean;
    onView: (treaty: Treaty) => void;
    canEditTreaty: (treaty: Treaty) => boolean;
    onEdit: (mode: string, treaty: Treaty) => void;
}

export interface TreatyManagementControllerProps {
    treaties?: Treaty[];
    loaded?: boolean;
    onView: (treaty: Treaty) => void;
    canEditTreaty: (treaty: Treaty) => boolean;
    onEdit: (mode: string, treaty: Treaty) => void;
    search?: string;
    sort?: string;
}

export interface TreatyInfoViewProps {
    treaty: Treaty | null;
    onBack: () => void;
    onEdit: () => void;
    canEdit: boolean;
    canTransfer: boolean;
}

export interface TreatyInfoEditProps {
    open: boolean;
    mode: 'create' | 'edit';
    data: Treaty | null;
    onSave: (treatyData: TreatyFormData) => void;
    onClose: () => void;
    error: string | null;
    saving: boolean;
    empires: Empire[];
    accounts: Account[];
    account: Account | null;
}

// State Management Types
export interface TreatyState {
    treaties: Treaty[];
    loading: boolean;
    error: string | null;
    success: string | null;
    currentTreaty: Treaty | null;
    editingTreaty: Treaty | null;
}

export interface TreatyPageState {
    treaties: Treaty[];
    loading: boolean;
    error: string | null;
    viewTreaty: Treaty | null;
    editTreaty: Treaty | null;
    dialogOpen: boolean;
    dialogMode: 'create' | 'edit';
    dialogError: string | null;
    dialogSaving: boolean;
    search: string;
    sort: string;
}

// Action Types for Treaty Management
export type TreatyAction = 
    | 'LOAD_TREATIES_START'
    | 'LOAD_TREATIES_SUCCESS'
    | 'LOAD_TREATIES_ERROR'
    | 'CREATE_TREATY_START'
    | 'CREATE_TREATY_SUCCESS'
    | 'CREATE_TREATY_ERROR'
    | 'UPDATE_TREATY_START'
    | 'UPDATE_TREATY_SUCCESS'
    | 'UPDATE_TREATY_ERROR'
    | 'DELETE_TREATY_START'
    | 'DELETE_TREATY_SUCCESS'
    | 'DELETE_TREATY_ERROR'
    | 'SET_CURRENT_TREATY'
    | 'SET_EDITING_TREATY'
    | 'CLEAR_MESSAGES'
    | 'RESET_STATE';

export interface TreatyActionPayload {
    type: TreatyAction;
    treaty?: Treaty;
    treaties?: Treaty[];
    error?: string;
    success?: string;
}

// Form Validation Types
export interface TreatyFormErrors {
    title?: string;
    content?: string;
    participants?: string;
    status?: string;
    owner?: string;
    general?: string;
}

export interface TreatyFormValidation {
    isValid: boolean;
    errors: TreatyFormErrors;
}

// API Response Types
export interface TreatyApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface TreatyListResponse extends TreatyApiResponse<Treaty[]> {
    data: Treaty[];
}

export interface TreatyResponse extends TreatyApiResponse<Treaty> {
    data: Treaty;
}

// Search and Filter Types
export interface TreatySearchParams {
    query?: string;
    status?: TreatyStatus;
    owner?: string;
    participant?: string;
    sortBy?: 'title' | 'id' | 'status' | 'owner' | 'created';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface TreatyFilterOptions {
    searchQuery: string;
    statusFilter: TreatyStatus | 'all';
    ownerFilter: string;
    participantFilter: string;
    sortBy: keyof Treaty;
    sortOrder: 'asc' | 'desc';
}

// Permission Types specific to Treaties
export interface TreatyPermissions {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
    canManageOthers: boolean;
    canChangeStatus: boolean;
    canModifyParticipants: boolean;
}

// Utility Types
export type TreatyField = keyof Treaty;
export type RequiredTreatyFields = 'title' | 'owner';
export type OptionalTreatyFields = Exclude<TreatyField, RequiredTreatyFields>;

// Treaty History and Audit Types
export interface TreatyHistoryEntry {
    id: string | number;
    treatyId: string | number;
    action: string;
    field?: string;
    oldValue?: string | number | boolean;
    newValue?: string | number | boolean;
    changedBy: string;
    timestamp: Date | string;
    reason?: string;
}

export interface TreatyAuditLog {
    treatyId: string | number;
    history: TreatyHistoryEntry[];
    totalChanges: number;
}
