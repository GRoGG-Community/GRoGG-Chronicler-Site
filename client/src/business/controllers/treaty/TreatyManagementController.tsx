import React, { useState, useEffect, ReactNode } from "react";
import { TreatyDataService } from '../../../data/services/TreatyDataService';
import { TreatyBusinessService } from '../../services/TreatyBusinessService';
import { LoadingMessage } from "../../../presentation/components/common/Messages";
import TreatyManagementList from "../../../presentation/components/treaty/management/TreatyManagementList";
import { Treaty } from "../../../data/models/Treaty";

interface TreatyManagementControllerProps {
    treaties?: Treaty[];
    loaded?: boolean;
    onView?: (treaty: Treaty) => void;
    canEditTreaty?: (treaty: Treaty) => boolean | string | null;
    canDeleteTreaty?: (treaty: Treaty) => boolean | null;
    onEdit?: (mode: string, treaty: Treaty) => void;
    onDelete?: (treaty: Treaty) => void;
    search?: string;
    sort?: string;
    children?: (props: {
        treaties: Treaty[];
        loading: boolean;
        error: string | null;
        refreshTreaties: () => void;
    }) => ReactNode;
}

export default function TreatyManagementController({
    treaties: initialTreaties,
    loaded: initialLoaded,
    onView,
    canEditTreaty,
    canDeleteTreaty,
    onEdit,
    onDelete,
    search,
    sort,
    children
}: TreatyManagementControllerProps) {
    const [treaties, setTreaties] = useState<Treaty[] | undefined>(initialTreaties ?? undefined);
    const [loaded, setLoaded] = useState<boolean>(initialLoaded ?? false);
    const [error, setError] = useState<string | null>(null);

    const refreshTreaties = async () => {
        try {
            setError(null);
            const data = await TreatyDataService.fetchTreatiesRaw();
            setTreaties(Array.isArray(data) ? data : []);
            setLoaded(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load treaties');
            setLoaded(true);
        }
    };

    useEffect(() => {
        if (initialTreaties) {
            setTreaties(initialTreaties);
            setLoaded(initialLoaded ?? true);
        }
    }, [initialTreaties, initialLoaded]);

    useEffect(() => {
        if (initialTreaties) return;
        refreshTreaties();
    }, [initialTreaties]);

    // Render prop pattern
    if (children) {
        return (
            <>
                {children({
                    treaties: treaties || [],
                    loading: !loaded,
                    error,
                    refreshTreaties
                })}
            </>
        );
    }

    // Traditional pattern
    if (!loaded || treaties === undefined) {
        return <LoadingMessage>Loading treaties...</LoadingMessage>;
    }

    if (!onView || !canEditTreaty || !canDeleteTreaty || !onEdit || !onDelete) {
        throw new Error('TreatyManagementController: Missing required props when not using render prop pattern');
    }

    const filteredTreaties = search?.trim()
        ? TreatyBusinessService.searchTreaties(treaties, search)
        : treaties;

    const sortedTreaties = [...filteredTreaties].sort((a, b) => {
        if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
        if (sort === 'owner') return (a.owner || '').localeCompare(b.owner || '');
        return 0;
    });

    return (
        <TreatyManagementList
            treaties={sortedTreaties}
            loaded={loaded}
            onView={onView}
            canEditTreaty={(treaty: Treaty) => Boolean(canEditTreaty(treaty))}
            canDeleteTreaty={(treaty: Treaty) => Boolean(canDeleteTreaty(treaty))}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}
