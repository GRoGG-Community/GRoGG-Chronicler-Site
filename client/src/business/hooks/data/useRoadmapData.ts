import { useState, useEffect } from 'react';
import { useEntityState } from '../infrastructure/useEntityState';
import { RoadmapService, type RoadmapItem } from '../../../data/services/RoadmapService';

export function useRoadmapData() {
    const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
    const entityState = useEntityState({ loading: true });

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                entityState.setLoading(true);
                entityState.clearMessages();
                
                const data = await RoadmapService.getRoadmap();
                setRoadmapItems(data);
            } catch (err) {
                entityState.setError(err instanceof Error ? err.message : 'Failed to load roadmap');
            } finally {
                entityState.setLoading(false);
            }
        };

        fetchRoadmap();
    }, []);

    return {
        roadmapItems,
        loading: entityState.loading,
        error: entityState.error,
        refreshRoadmap: () => {
            const fetchRoadmap = async () => {
                try {
                    entityState.setLoading(true);
                    entityState.clearMessages();
                    
                    const data = await RoadmapService.getRoadmap();
                    setRoadmapItems(data);
                } catch (err) {
                    entityState.setError(err instanceof Error ? err.message : 'Failed to load roadmap');
                } finally {
                    entityState.setLoading(false);
                }
            };
            fetchRoadmap();
        }
    };
}
