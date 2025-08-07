/**
 * Service for managing roadmap data operations.
 * Part of the data layer - handles HTTP operations for roadmap items.
 */

interface RoadmapItem {
    id: string;
    title: string;
    status: string;
    description?: string;
    category?: string;
    priority?: string;
}

export class RoadmapService {
    /**
     * Fetches roadmap data from the static JSON file
     */
    static async getRoadmap(): Promise<RoadmapItem[]> {
        const response = await fetch('/roadmap.json');
        if (!response.ok) {
            throw new Error('Failed to load roadmap');
        }
        return await response.json();
    }
}

export type { RoadmapItem };
