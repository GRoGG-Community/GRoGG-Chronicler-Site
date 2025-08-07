export interface Treaty {
    id: number | string;
    title: string;
    content?: string;
    owner?: string;
    participants?: string[];
    status?: string;
    [key: string]: any;
}

export function assertTreatyArray(data: any): Treaty[] {
    if (!Array.isArray(data)) throw new Error('Not an array');
    return data.map(t => ({
        id: t.id,
        title: t.title,
        content: t.content,
        owner: t.owner,
        participants: t.participants,
        status: t.status,
        ...t
    }));
}
