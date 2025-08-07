import { Empire, EmpireModel, EmpireInfoRecord, assertEmpireArray } from '../models/Empire';
import { ApiConfig } from '../../infrastructure/config/api.config';
import { AppError, ErrorCode, ErrorHandler } from '../../infrastructure/errors/AppError';
import { EmpireValidator } from '../validators/empire.validator';
import { EmpireCache } from '../cache/EntityCacheManager';

const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
            errorData.message || `HTTP ${response.status}`,
            ErrorCode.NETWORK_ERROR,
            response.status
        );
    }
    return response.json();
};

export const empireApiClient = {
    async read(): Promise<Empire[]> {
        try {
            // Check cache first
            const cached = EmpireCache.get('all');
            if (cached) return cached;
            
            const response = await fetch(`${ApiConfig.baseURL}/empires?ts=${Date.now()}`, {
                headers: ApiConfig.headers,
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            const data = await handleApiResponse(response);
            const empires = assertEmpireArray(data);
            
            // Cache results
            EmpireCache.set('all', empires);
            return empires;
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    },

    async create(empireDraft: Partial<Empire>): Promise<Empire> {
        try {
            const sanitizedData = EmpireValidator.sanitize(empireDraft);
            EmpireValidator.validateAndThrow(sanitizedData);
            
            const response = await fetch(`${ApiConfig.baseURL}/empires`, {
                method: 'POST',
                headers: ApiConfig.headers,
                body: JSON.stringify(EmpireModel.toAPI(sanitizedData as Empire)),
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            const data = await handleApiResponse(response);
            const empire = EmpireModel.fromAPI(data);
            
            // Invalidate cache
            EmpireCache.invalidate();
            return empire;
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    },

    async update(id: string | number, empireDraft: Partial<Empire>): Promise<Empire> {
        try {
            EmpireValidator.validateAndThrow(empireDraft);
            
            const response = await fetch(`${ApiConfig.baseURL}/empires/${id}`, {
                method: 'PUT',
                headers: ApiConfig.headers,
                body: JSON.stringify(EmpireModel.toAPI(empireDraft as Empire)),
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            const data = await handleApiResponse(response);
            const updatedEmpire = EmpireModel.fromAPI(data);
            
            EmpireCache.invalidate();
            return updatedEmpire;
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    },

    async delete(id: string | number): Promise<void> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/empires/${id}`, {
                method: 'DELETE',
                headers: ApiConfig.headers,
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            
            await handleApiResponse(response);
            EmpireCache.invalidate();
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    }
};

export async function createEmpire(empire: Partial<Empire>): Promise<Response> {
    await empireApiClient.create(empire);
    return new Response('{}', { status: 200 });
}

export async function updateEmpire(id: Empire['id'], data: Partial<Empire>): Promise<Response> {
    // First fetch the current empire data to get the required fields
    const currentEmpire = await fetch(`/api/empires/${id}`).then(res => res.json());
    
    return fetch(`/api/empires/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: currentEmpire.id,
            name: data.name !== undefined ? data.name : currentEmpire.name,
            account: data.account !== undefined ? data.account : currentEmpire.account
        })
    });
}

export async function deleteEmpire(id: Empire['id']): Promise<Response> {
    return fetch(`/api/empires/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function linkEmpireToAccount(empireId: Empire['id'], accountName: string): Promise<Response> {
    // Fetch current empire to get the required fields
    const currentEmpire = await fetch(`/api/empires/${empireId}`).then(res => res.json());
    
    return fetch(`/api/empires/${empireId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: currentEmpire.id,
            name: currentEmpire.name,
            account: accountName
        })
    });
}

export async function unlinkEmpireFromAccount(empireId: Empire['id']): Promise<Response> {
    // Fetch current empire to get the required fields
    const currentEmpire = await fetch(`/api/empires/${empireId}`).then(res => res.json());
    
    return fetch(`/api/empires/${empireId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: currentEmpire.id,
            name: currentEmpire.name,
            account: ""
        })
    });
}

/**
 * Empire Info API functions
 * Handles the separate empire info data that contains detailed empire information
 */

export async function fetchEmpireInfoRaw(): Promise<EmpireInfoRecord[]> {
    const res = await fetch('/api/empireinfo?ts=' + Date.now());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export async function fetchEmpireInfoMap(): Promise<Record<string, any>> {
    const data = await fetchEmpireInfoRaw();
    const empireInfoMap: Record<string, any> = {};
    data.forEach(item => {
        if (item.empireId && item.info) {
            empireInfoMap[item.empireId] = item.info;
        }
    });
    return empireInfoMap;
}

export async function saveEmpireInfo(empireId: string, info: any): Promise<Response> {
    return fetch('/api/empireinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empireId, info })
    });
}
