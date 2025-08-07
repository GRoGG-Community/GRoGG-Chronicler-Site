import { Treaty, assertTreatyArray } from '../models/Treaty';

export async function fetchTreatiesRaw(): Promise<Treaty[]> {
    const res = await fetch('/api/treaties?ts=' + Date.now());
    return assertTreatyArray(await res.json());
}

export async function fetchTreatiesMap(): Promise<Record<string, Treaty>> {
    const treaties = await fetchTreatiesRaw();
    return treaties.reduce((acc, t) => {
        acc[t.title] = t;
        return acc;
    }, {} as Record<string, Treaty>);
}

export async function createTreaty(treaty: Partial<Treaty>): Promise<Response> {
    return fetch('/api/treaties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treaty)
    });
}

export async function updateTreaty(id: Treaty['id'], data: Partial<Treaty>): Promise<Response> {
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

export async function deleteTreaty(id: Treaty['id']): Promise<Response> {
    return fetch(`/api/treaties/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
}
