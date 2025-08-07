/**
 * Custom hook for Empire Info management
 * Data Layer: Handles empire info fetching, caching, and persistence
 * Manages empire-specific information beyond basic empire data
 */

import { useState, useEffect, useCallback } from 'react';
import { EmpireDataService } from '../../../data/services/EmpireDataService';
import { EmpireInfo } from '../../../data/models/Empire';

export function useEmpireInfo(empireId?: string | number, empireName?: string) {
    const [empireInfo, setEmpireInfo] = useState<Record<string, EmpireInfo>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const fetchEmpireInfo = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const empireInfoMap = await EmpireDataService.fetchEmpireInfoMap();
            setEmpireInfo(empireInfoMap);
        } catch (err) {
            setError('Failed to fetch empire info');
            setEmpireInfo({});
            console.error('Failed to fetch empire info:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getInfoForEmpire = useCallback((id: string | number): EmpireInfo | undefined => {
        return empireInfo[id] || empireInfo[empireName || ''];
    }, [empireInfo, empireName]);

    const refreshEmpireInfo = useCallback(async () => {
        return fetchEmpireInfo();
    }, [fetchEmpireInfo]);

    const saveEmpireInfo = useCallback(async (empireId: string, info: any) => {
        try {
            setLoading(true);
            setError('');
            
            await EmpireDataService.saveEmpireInfo(empireId, info);
            
            // Update local state
            setEmpireInfo(prev => ({
                ...prev,
                [empireId]: info
            }));
            
            return true;
        } catch (err) {
            setError('Failed to save empire info');
            console.error('Failed to save empire info:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateLocalEmpireInfo = useCallback((id: string | number, name: string, info: EmpireInfo) => {
        setEmpireInfo(prev => ({
            ...prev,
            [id]: info,
            [name]: info // Support both ID and name-based lookups
        }));
    }, []);

    const hasInfoForEmpire = useCallback((id: string | number) => !!empireInfo[id], [empireInfo]);

    useEffect(() => {
        fetchEmpireInfo();
    }, [fetchEmpireInfo]);

    return {
        empireInfo,
        loading,
        error,
        getInfoForEmpire,
        refreshEmpireInfo,
        saveEmpireInfo,
        updateLocalEmpireInfo,
        hasInfoForEmpire
    };
}
