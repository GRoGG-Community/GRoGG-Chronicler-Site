/**
 * EmpireDataService
 * Data layer service for empire HTTP operations and data persistence.
 * Handles all API communication for empire entities and empire info.
 */

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

export class EmpireDataService {
    /**
     * Fetch all empires from API
     */
    static async fetchEmpires(): Promise<Empire[]> {
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
    }

    /**
     * Create a new empire
     */
    static async createEmpire(empireData: Partial<Empire>): Promise<any> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/empires`, {
                method: 'POST',
                headers: ApiConfig.headers,
                body: JSON.stringify(empireData),
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            return await handleApiResponse(response);
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    }

    /**
     * Update an existing empire
     */
    static async updateEmpire(id: string | number, empireData: Partial<Empire>): Promise<any> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/empires/${id}`, {
                method: 'PUT',
                headers: ApiConfig.headers,
                body: JSON.stringify(empireData),
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            return await handleApiResponse(response);
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    }

    /**
     * Delete an empire
     */
    static async deleteEmpire(id: string | number): Promise<any> {
        try {
            const response = await fetch(`${ApiConfig.baseURL}/empires/${id}`, {
                method: 'DELETE',
                headers: ApiConfig.headers,
                signal: AbortSignal.timeout(ApiConfig.timeout)
            });
            return await handleApiResponse(response);
        } catch (error) {
            throw ErrorHandler.handle(error);
        }
    }

    /**
     * Link empire to account
     */
    static async linkEmpireToAccount(empireId: Empire['id'], accountName: string): Promise<Response> {
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

    /**
     * Unlink empire from account
     */
    static async unlinkEmpireFromAccount(empireId: Empire['id']): Promise<Response> {
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
     * Fetch empire info records
     */
    static async fetchEmpireInfoRaw(): Promise<EmpireInfoRecord[]> {
        const res = await fetch('/api/empireinfo?ts=' + Date.now());
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    }

    /**
     * Fetch empire info as a map
     */
    static async fetchEmpireInfoMap(): Promise<Record<string, any>> {
        const data = await this.fetchEmpireInfoRaw();
        const empireInfoMap: Record<string, any> = {};
        data.forEach(item => {
            if (item.empireId && item.info) {
                empireInfoMap[item.empireId] = item.info;
            }
        });
        return empireInfoMap;
    }

    /**
     * Save empire info
     */
    static async saveEmpireInfo(empireId: string, info: any): Promise<Response> {
        return fetch('/api/empireinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ empireId, info })
        });
    }
}
