import { useState, useEffect, useCallback } from 'react';
import { Empire } from '../../../data/models/Empire';
import { EmpireDataService } from '../../../data/services/EmpireDataService';
import { EmpireCache } from '../../../data/cache/EntityCacheManager';
import { useEntityState } from '../infrastructure/useEntityState';

/**
 * Hook for empire data management following 5-layer architecture
 * Data Layer: Handles empire fetching, caching, and state management
 * Separates data concerns from business logic and presentation
 */
export function useEmpireData() {
    const [empires, setEmpires] = useState<Empire[]>([]);
    const entityState = useEntityState();
    const [lastFetch, setLastFetch] = useState<Date | null>(null);

    const fetchEmpires = useCallback(async () => {
        try {
            entityState.setLoading(true);
            entityState.clearMessages();
            
            // Try cache first
            const cached = EmpireCache.get('empires');
            if (cached) {
                setEmpires(cached);
                setLastFetch(new Date());
                entityState.setLoading(false);
                return cached;
            }

            const data = await EmpireDataService.fetchEmpires();
            setEmpires(data);
            setLastFetch(new Date());
            
            // Cache the result
            EmpireCache.set('empires', data);
            
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to fetch empires';
            entityState.setError(error);
            setEmpires([]);
            throw err;
        } finally {
            entityState.setLoading(false);
        }
    }, [entityState]);

    const refreshEmpires = useCallback(async () => {
        EmpireCache.invalidate('empires'); // Clear cache before refresh
        return fetchEmpires();
    }, [fetchEmpires]);

    const getEmpireById = useCallback((id: string | number): Empire | undefined => {
        return empires.find(empire => empire.id === id);
    }, [empires]);

    const getEmpireByName = useCallback((name: string): Empire | undefined => {
        return empires.find(empire => empire.name.toLowerCase() === name.toLowerCase());
    }, [empires]);

    const getEmpiresByAccount = useCallback((accountName: string): Empire[] => {
        return empires.filter(empire => 
            empire.account?.toLowerCase() === accountName.toLowerCase()
        );
    }, [empires]);

    const searchEmpires = useCallback((searchTerm: string): Empire[] => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return empires;
        
        return empires.filter(empire => 
            empire.name.toLowerCase().includes(term) ||
            empire.account?.toLowerCase().includes(term)
        );
    }, [empires]);

    // Auto-fetch on mount
    useEffect(() => {
        fetchEmpires();
    }, [fetchEmpires]);

    return {
        empires,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success,
        lastFetch,
        fetchEmpires,
        refreshEmpires,
        getEmpireById,
        getEmpireByName,
        getEmpiresByAccount,
        searchEmpires
    };

    useEffect(() => {
        fetchEmpires();
    }, [fetchEmpires]);

    return {
        empires,
        loading: entityState.loading,
        error: entityState.error,
        success: entityState.success,
        lastFetch,
        fetchEmpires,
        refreshEmpires,
        getEmpireById,
        getEmpireByName,
        getEmpiresByAccount,
        searchEmpires
    };
}
