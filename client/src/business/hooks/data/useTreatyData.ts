/**
 * Custom hook for Treaty data management and caching
 * Handles data layer separation for treaty entities
 */

import { useState, useEffect, useCallback } from 'react';
import { Treaty } from '../../../data/models/Treaty';
import { TreatyDataService } from '../../../data/services/TreatyDataService';
import { TreatyCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

export function useTreatyData(autoFetch: boolean = true) {
    const [treaties, setTreaties] = useState<Treaty[]>([]);
    const [lastFetch, setLastFetch] = useState<Date | null>(null);
    const entityState = useEntityState();

    const fetchTreaties = useCallback(async () => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            const cached = TreatyCache.get('treaties');
            if (cached) {
                setTreaties(cached);
                setLastFetch(new Date());
                entityState.setLoading(false);
                return cached;
            }
            
            const data = await TreatyDataService.fetchTreatiesRaw();
            setTreaties(data);
            setLastFetch(new Date());
            TreatyCache.set('treaties', data);
            
            return data;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to fetch treaties';
            entityState.setError(error);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState]);

    const getTreatiesByAccount = useCallback((accountName: string): Treaty[] => {
        return treaties.filter(treaty => 
            treaty.side1?.toLowerCase().includes(accountName.toLowerCase()) ||
            treaty.side2?.toLowerCase().includes(accountName.toLowerCase())
        );
    }, [treaties]);

    const getTreatyById = useCallback((id: string | number): Treaty | undefined => {
        return treaties.find(treaty => treaty.id === id);
    }, [treaties]);

    const searchTreaties = useCallback((searchTerm: string): Treaty[] => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return treaties;
        
        return treaties.filter(treaty => 
            treaty.side1?.toLowerCase().includes(term) ||
            treaty.side2?.toLowerCase().includes(term) ||
            treaty.type?.toLowerCase().includes(term)
        );
    }, [treaties]);

    const refreshTreaties = useCallback(() => {
        TreatyCache.invalidate('treaties');
        return fetchTreaties();
    }, [fetchTreaties]);

    useEffect(() => {
        if (autoFetch) {
            fetchTreaties();
        }
    }, [autoFetch, fetchTreaties]);

    return {
        treaties,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success,
        lastFetch,
        fetchTreaties,
        getTreatiesByAccount,
        getTreatyById,
        searchTreaties,
        refreshTreaties
    };
}
