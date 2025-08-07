import { AppError, ErrorCode } from '../../infrastructure/errors/AppError';
import type Account from './Account';

export interface Empire {
    id: number | string;
    name: string;
    account?: string;
    lore?: string;
    stats?: string;
    ethics?: string;
    civics?: string;
    special?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: string | number | boolean | undefined;
}

export interface EmpireInfo {
    lore?: string;
    stats?: string;
    ethics?: string;
    civics?: string;
    special?: string;
    [key: string]: string | undefined;
}

export interface EmpireInfoRecord {
    empireId: string | number;
    info: EmpireInfo;
    id: number;
    empireName?: string;
    lastUpdated?: Date | string;
    updatedBy?: string;
}

export interface EmpireFormData {
    name: string;
    account?: string;
    lore?: string;
    stats?: string;
    ethics?: string;
    civics?: string;
    special?: string;
}

export interface EmpireCreateRequest {
    name: string;
    account?: string;
    lore?: string;
    stats?: string;
    ethics?: string;
    civics?: string;
    special?: string;
}

export interface EmpireUpdateRequest {
    id: string | number;
    name?: string;
    account?: string;
    lore?: string;
    stats?: string;
    ethics?: string;
    civics?: string;
    special?: string;
}

export interface EmpireDeleteRequest {
    id: string | number;
    name?: string;
}

export interface EmpireLinkRequest {
    empireId: string | number;
    accountId: string | number;
}

export interface EmpireUnlinkRequest {
    empireId: string | number;
}

// Component Props Interfaces - Management
export interface EmpireManagementPanelProps {
    empires: Empire[];
    loading: boolean;
    onRefresh: () => void;
    onEditEmpire: (empireName: string) => void;
    onLink: (empireId: string, accountId: string) => void;
    onUnlink: (empireId: string) => void;
    onDelete: (empireId: string) => void;
    getEmpireAccount: (empireId: string) => any | null;
}

export interface EmpireManagementListProps {
    empires: Empire[];
    loading: boolean;
    onEditEmpire: (empireName: string) => void;
    onLink: (empireId: string, accountId: string) => void;
    onUnlink: (empireId: string) => void;
    onDelete: (empireId: string) => void;
    getEmpireAccount: (empireId: string) => any | null;
}

export interface EmpireCreationFormProps {
    existingEmpires: Empire[];
    onEmpireCreated: () => void;
    onCancel: () => void;
}

// Component Props Interfaces - Info
export interface EmpireInfoManagerProps {
    empires: Empire[];
    empireInfo: Record<string, EmpireInfo>;
    loading: boolean;
    onSaveEmpireInfo: (empireName: string, info: EmpireInfo) => Promise<void>;
    empireSearch: string;
    empireSort: string;
}

export interface EmpireInfoViewProps {
    empire: Empire;
    info: EmpireInfo;
    onEdit: () => void;
    onBack: () => void;
    canEdit: boolean;
}

export interface EmpireInfoEditProps {
    empire: Empire;
    info: EmpireInfo;
    onSave: (info: EmpireInfo) => Promise<void>;
    onCancel: () => void;
    error: string | null;
    saving: boolean;
}

export interface EmpireInfoListProps {
    empires: Empire[];
    empireInfo: Record<string, EmpireInfo>;
    onSelectEmpire: (empire: Empire) => void;
    searchQuery: string;
    sortOrder: string;
    loading: boolean;
}

export interface EmpireListProps {
    empires: Empire[];
    onEdit: (empireName: string) => void;
    onDelete: (empireId: string) => void;
    onLink: (empireId: string, accountId: string) => void;
    onUnlink: (empireId: string) => void;
    getEmpireAccount: (empireId: string) => any | null;
    loading: boolean;
}

// State Management Types
export interface EmpireState {
    empires: Empire[];
    loading: boolean;
    error: string | null;
    success: string | null;
    currentEmpire: Empire | null;
    editingEmpire: Empire | null;
}

export interface EmpireInfoState {
    empireInfo: Record<string, EmpireInfo>;
    loading: boolean;
    error: string | null;
    success: string | null;
    currentInfo: EmpireInfo | null;
    editingInfo: EmpireInfo | null;
}

export interface EmpirePageState {
    empires: Empire[];
    empireInfo: Record<string, EmpireInfo>;
    loading: boolean;
    error: string | null;
    success: string | null;
    selectedEmpire: Empire | null;
    empireSearch: string;
    empireSort: string;
}

// View State Types
export type EmpireViewState = 'list' | 'view' | 'edit' | 'create';

export interface EmpireViewContext {
    state: EmpireViewState;
    empire?: Empire;
    info?: EmpireInfo;
    selectedEmpire?: Empire | null;
}

// Action Types for Empire Management
export type EmpireAction = 
    | 'LOAD_EMPIRES_START'
    | 'LOAD_EMPIRES_SUCCESS'
    | 'LOAD_EMPIRES_ERROR'
    | 'CREATE_EMPIRE_START'
    | 'CREATE_EMPIRE_SUCCESS'
    | 'CREATE_EMPIRE_ERROR'
    | 'UPDATE_EMPIRE_START'
    | 'UPDATE_EMPIRE_SUCCESS'
    | 'UPDATE_EMPIRE_ERROR'
    | 'DELETE_EMPIRE_START'
    | 'DELETE_EMPIRE_SUCCESS'
    | 'DELETE_EMPIRE_ERROR'
    | 'LINK_EMPIRE_START'
    | 'LINK_EMPIRE_SUCCESS'
    | 'LINK_EMPIRE_ERROR'
    | 'UNLINK_EMPIRE_START'
    | 'UNLINK_EMPIRE_SUCCESS'
    | 'UNLINK_EMPIRE_ERROR'
    | 'SET_CURRENT_EMPIRE'
    | 'SET_EDITING_EMPIRE'
    | 'CLEAR_MESSAGES'
    | 'RESET_STATE';

export interface EmpireActionPayload {
    type: EmpireAction;
    empire?: Empire;
    empires?: Empire[];
    info?: EmpireInfo;
    error?: string;
    success?: string;
}

// Form Validation Types
export interface EmpireFormErrors {
    name?: string;
    account?: string;
    lore?: string;
    stats?: string;
    ethics?: string;
    civics?: string;
    special?: string;
    general?: string;
}

export interface EmpireInfoFormErrors {
    lore?: string;
    stats?: string;
    ethics?: string;
    civics?: string;
    special?: string;
    general?: string;
}

export interface EmpireFormValidation {
    isValid: boolean;
    errors: EmpireFormErrors;
}

export interface EmpireInfoFormValidation {
    isValid: boolean;
    errors: EmpireInfoFormErrors;
}

// API Response Types
export interface EmpireApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface EmpireListResponse extends EmpireApiResponse<Empire[]> {
    data: Empire[];
}

export interface EmpireResponse extends EmpireApiResponse<Empire> {
    data: Empire;
}

export interface EmpireInfoResponse extends EmpireApiResponse<EmpireInfo> {
    data: EmpireInfo;
}

// Search and Filter Types
export interface EmpireSearchParams {
    query?: string;
    account?: string;
    hasInfo?: boolean;
    sortBy?: 'name' | 'id' | 'account' | 'created';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

export interface EmpireFilterOptions {
    searchQuery: string;
    accountFilter: string;
    hasInfoFilter: boolean | 'all';
    sortBy: keyof Empire;
    sortOrder: 'asc' | 'desc';
}

// Permission Types specific to Empires
export interface EmpirePermissions {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
    canManageOthers: boolean;
    canLink: boolean;
    canUnlink: boolean;
    canEditInfo: boolean;
}

// Utility Types
export type EmpireField = keyof Empire;
export type EmpireInfoField = keyof EmpireInfo;
export type RequiredEmpireFields = 'name';
export type OptionalEmpireFields = Exclude<EmpireField, RequiredEmpireFields>;

// Empire Statistics and Analytics Types
export interface EmpireStats {
    totalEmpires: number;
    linkedEmpires: number;
    unlinkedEmpires: number;
    empiresWithInfo: number;
    empiresWithoutInfo: number;
    mostActiveAccount: string;
    recentlyCreated: Empire[];
    recentlyUpdated: Empire[];
}

export class EmpireModel {
    static fromAPI(apiData: any): Empire {
        try {
            return {
                id: apiData.id,
                name: apiData.name,
                account: apiData.account || undefined,
                lore: apiData.lore,
                stats: apiData.stats,
                ethics: apiData.ethics,
                civics: apiData.civics,
                special: apiData.special,
                createdAt: apiData.created_at || undefined,
                updatedAt: apiData.updated_at || undefined
            };
        } catch (error) {
            throw new AppError('Failed to parse Empire data', ErrorCode.VALIDATION_ERROR);
        }
    }
    
    static toAPI(empire: Empire): any {
        return {
            id: empire.id,
            name: empire.name,
            account: empire.account,
            lore: empire.lore,
            stats: empire.stats,
            ethics: empire.ethics,
            civics: empire.civics,
            special: empire.special,
            created_at: empire.createdAt,
            updated_at: empire.updatedAt
        };
    }
}

export function assertEmpireArray(data: any): Empire[] {
    if (!Array.isArray(data)) {
        throw new AppError('Expected array of empires', ErrorCode.VALIDATION_ERROR);
    }
    return data.map(EmpireModel.fromAPI);
}
