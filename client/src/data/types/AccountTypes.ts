/**
 * Type definitions for Account-related entities
 * Contains interfaces for accounts, account management, and account operations.
 * Centralizes all account-related types to maintain consistency across components.
 */

export interface Account {
    id: string | number;
    name: string;
    password?: string;
}

// Interface for the current logged-in account (from context)
export interface CurrentAccount {
    username: string;
}

export interface AccountFormData {
    name: string;
    password: string;
    confirmPassword?: string;
}

export interface AccountEditFormData extends AccountFormData {
    id: string | number;
}

export interface AccountCreateRequest {
    name: string;
    password: string;
}

export interface AccountUpdateRequest {
    id: string | number;
    name?: string;
    password?: string;
}

export interface AccountDeleteRequest {
    id: string | number;
    name: string;
}

// Component Props Interfaces
export interface AccountManagementListProps {
    accounts: Account[];
    onEdit: (accountName: string) => void;
    onDelete: (accountName: string) => void;
    editAccountLoading: boolean;
    empires?: { id: string | number; name: string; account: string }[];
}

export interface AccountManagementControllerProps {
    onEdit: (accountName: string) => void;
    onDelete: (accountName: string) => void;
    editAccountLoading: boolean;
}

export interface AccountInfoEditProps {
    error: string;
    success: string;
    accountName: string;
    accountPass: string;
    loading: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onNameChanged: (newName: string) => void;
    onPasswordChanged: (newPassword: string) => void;
    buttonLabel: string;
    isEditing?: boolean;
    onCancel?: () => void;
}

export interface AccountInfoControllerProps {
    updateAccounts: () => void;
    accountName?: string;
    accountPass?: string;
    accountId?: string | number;
    onCancel?: () => void;
}

export interface AccountDropdownProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    accounts?: Account[];
}

// State Management Types
export interface AccountState {
    accounts: Account[];
    loading: boolean;
    error: string | null;
    success: string | null;
    editingAccount: Account | null;
}

export interface AccountPageState {
    accounts: Account[];
    loading: boolean;
    error: string | null;
    success: string | null;
    editAccount: Account | null;
    editAccountName: string;
    editAccountPass: string;
    editAccountLoading: boolean;
}

// Action Types for Account Management
export type AccountAction = 
    | 'LOAD_ACCOUNTS_START'
    | 'LOAD_ACCOUNTS_SUCCESS'
    | 'LOAD_ACCOUNTS_ERROR'
    | 'CREATE_ACCOUNT_START'
    | 'CREATE_ACCOUNT_SUCCESS'
    | 'CREATE_ACCOUNT_ERROR'
    | 'UPDATE_ACCOUNT_START'
    | 'UPDATE_ACCOUNT_SUCCESS'
    | 'UPDATE_ACCOUNT_ERROR'
    | 'DELETE_ACCOUNT_START'
    | 'DELETE_ACCOUNT_SUCCESS'
    | 'DELETE_ACCOUNT_ERROR'
    | 'SET_EDITING_ACCOUNT'
    | 'CLEAR_MESSAGES'
    | 'RESET_STATE';

export interface AccountActionPayload {
    type: AccountAction;
    account?: Account;
    accounts?: Account[];
    error?: string;
    success?: string;
}

// Form Validation Types
export interface AccountFormErrors {
    name?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export interface AccountFormValidation {
    isValid: boolean;
    errors: AccountFormErrors;
}

// API Response Types
export interface AccountApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface AccountListResponse extends AccountApiResponse<Account[]> {
    data: Account[];
}

export interface AccountResponse extends AccountApiResponse<Account> {
    data: Account;
}

// Search and Filter Types
export interface AccountSearchParams {
    query?: string;
    sortBy?: 'name' | 'id' | 'created';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface AccountFilterOptions {
    searchQuery: string;
    sortBy: keyof Account;
    sortOrder: 'asc' | 'desc';
}

// Permission Types specific to Accounts
export interface AccountPermissions {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
    canManageOthers: boolean;
}

// Utility Types
export type AccountField = keyof Account;
export type RequiredAccountFields = 'name' | 'password';
export type OptionalAccountFields = Exclude<AccountField, RequiredAccountFields>;

/**
 * @deprecated Use Account from AccountTypes instead
 */
export type AccountMap = {
    [name: string]: string;
};
