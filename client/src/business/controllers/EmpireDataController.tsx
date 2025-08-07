import React, { useState, useEffect } from 'react';
import { EmpireDataService } from '../../data/services/EmpireDataService';
import { Empire } from '../../data/models/Empire';
import { LoadingMessage } from '../../presentation/components/common/Messages';

/**
 * EmpireDataController (Business Layer)
 * Manages empire data loading for components that need empire information.
 * Provides a bridge between business layer data access and presentation components.
 */

interface EmpireDataControllerProps {
    children: (data: { empires: Empire[]; loading: boolean }) => React.ReactNode;
}

export default function EmpireDataController({ children }: EmpireDataControllerProps) {
    const [empires, setEmpires] = useState<Empire[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmpires = async () => {
            try {
                const empiresData = await EmpireDataService.fetchEmpires();
                setEmpires(empiresData);
            } catch (error) {
                console.error('Failed to load empires:', error);
                setEmpires([]);
            } finally {
                setLoading(false);
            }
        };

        loadEmpires();
    }, []);

    return <>{children({ empires, loading })}</>;
}
