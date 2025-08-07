/**
 * TreatyDataService
 * Data layer service for treaty HTTP operations and data persistence.
 * Handles all API communication for treaty entities.
 */

import { Treaty, assertTreatyArray } from '../models/Treaty';

export class TreatyDataService {
    /**
     * Fetch all treaties from API
     */
    static async fetchTreatiesRaw(): Promise<Treaty[]> {
        const res = await fetch('/api/treaties?ts=' + Date.now());
        return assertTreatyArray(await res.json());
    }

    /**
     * Fetch treaties as a map by title
     */
    static async fetchTreatiesMap(): Promise<Record<string, Treaty>> {
        const treaties = await this.fetchTreatiesRaw();
        return treaties.reduce((acc, t) => {
            acc[t.title] = t;
            return acc;
        }, {} as Record<string, Treaty>);
    }

    /**
     * Create a new treaty
     */
    static async createTreaty(treaty: Partial<Treaty>): Promise<Response> {
        return fetch('/api/treaties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(treaty)
        });
    }

    /**
     * Update an existing treaty
     */
    static async updateTreaty(id: Treaty['id'], data: Partial<Treaty>): Promise<Response> {
        // First fetch the current treaty data to get the required fields
        const currentTreaty = await fetch(`/api/treaties/${id}`).then(res => res.json());
        
        return fetch(`/api/treaties/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: currentTreaty.id,
                title: data.title !== undefined ? data.title : currentTreaty.title,
                content: data.content !== undefined ? data.content : currentTreaty.content,
                owner: data.owner !== undefined ? data.owner : currentTreaty.owner,
                participants: data.participants !== undefined ? data.participants : currentTreaty.participants,
                status: data.status !== undefined ? data.status : currentTreaty.status
            })
        });
    }

    /**
     * Delete a treaty
     */
    static async deleteTreaty(id: Treaty['id']): Promise<Response> {
        return fetch(`/api/treaties/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
