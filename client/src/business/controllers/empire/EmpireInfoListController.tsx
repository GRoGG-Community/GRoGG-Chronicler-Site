import React from 'react';
import EmpireInfoManager from '../../../presentation/components/empire/info/EmpireInfoManager';
import { EmpireBusinessService } from '../../services/EmpireBusinessService';
import { useEmpireData } from '../../hooks/data/useEmpireData';
import { useEmpireInfo } from '../../hooks/data/useEmpireInfo';
import type { Empire, EmpireInfo } from '../../../data/models/Empire';

/**
 * EmpireInfoListController (Business Layer)
 * Manages data loading and operations for empire info display.
 * Provides a bridge between presentation layer and business logic.
 * Handles all cache operations internally, exposing clean interface to presentation.
 */

interface EmpireInfoListControllerProps {
    searchTerm: string;
    sortBy: string;
    onSaveComplete?: () => void;
}

export default function EmpireInfoListController({
    searchTerm,
    sortBy,
    onSaveComplete
}: EmpireInfoListControllerProps) {
    // Use consolidated hooks for separation of concerns
    const { empires, loading: empiresLoading, error: empiresError } = useEmpireData();
    const { empireInfo, loading: infoLoading, error: infoError, updateLocalEmpireInfo } = useEmpireInfo();

    // Combine loading states
    const loading = empiresLoading || infoLoading;
    const error = empiresError || infoError;

    const handleSaveEmpireInfo = async (empireName: string, info: EmpireInfo): Promise<void> => {
        // Find empire by name to get ID
        const empire = empires.find((e: Empire) => e.name === empireName);
        if (!empire) {
            throw new Error('Empire not found');
        }

        await EmpireBusinessService.saveEmpireInfo(empire.id.toString(), info);
        
        // Update local state through the hook
        updateLocalEmpireInfo(empire.id, empire.name, info);

        // Notify parent of successful save
        if (onSaveComplete) {
            onSaveComplete();
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <EmpireInfoManager
            empires={empires}
            empireInfo={empireInfo}
            loading={loading}
            onSaveEmpireInfo={handleSaveEmpireInfo}
            empireSearch={searchTerm}
            empireSort={sortBy}
        />
    );
}
