import React, { useState } from 'react';
import EmpireInfoView from './EmpireInfoView';
import EmpireInfoEdit from './EmpireInfoEdit';
import EmpireInfoList from './EmpireInfoList';
import { useSearchFilter } from '../../../../business/hooks/infrastructure/useCommonUtilities';
import { Empire, EmpireInfo, EmpireInfoManagerProps, EmpireViewState, EmpireViewContext } from '../../../../data/models/Empire';

/**
 * EmpireInfoManager (Manager/Coordinator Pattern)
 * Manages the state and flow between different empire info views.
 * Implements the State pattern for view transitions (list -> view -> edit).
 * Follows Single Responsibility: coordinates empire info operations.
 */

export default function EmpireInfoManager({
    empires,
    empireInfo,
    loading,
    onSaveEmpireInfo,
    empireSearch,
    empireSort
}: EmpireInfoManagerProps) {
    const [viewContext, setViewContext] = useState<EmpireViewContext>({
        state: 'list',
        selectedEmpire: null
    });

    // State transition handlers (State Pattern)
    const handleViewEmpire = (empire: Empire) => {
        setViewContext({
            state: 'view',
            selectedEmpire: empire
        });
    };

    const handleEditEmpire = (empire: Empire) => {
        setViewContext({
            state: 'edit',
            selectedEmpire: empire
        });
    };

    const handleBackToList = () => {
        setViewContext({
            state: 'list',
            selectedEmpire: null
        });
    };

    const handleSaveComplete = () => {
        setViewContext({
            state: 'view',
            selectedEmpire: viewContext.selectedEmpire
        });
    };

    // Filter and sort empires (Strategy Pattern)
    const filteredEmpires = useSearchFilter(empires, empireSearch, (empire) => empire.name || '');
    
    const sortedEmpires = [...filteredEmpires].sort((a, b) => {
        if (empireSort === 'name') {
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.localeCompare(nameB);
        }
        return 0;
    });

    // Render appropriate view based on state (State Pattern)
    switch (viewContext.state) {
        case 'view':
            return (
                <EmpireInfoView
                    empire={viewContext.selectedEmpire!}
                    info={empireInfo[viewContext.selectedEmpire!.name] || {}}
                    onEdit={() => handleEditEmpire(viewContext.selectedEmpire!)}
                    onBack={handleBackToList}
                    canEdit={true}
                />
            );

        case 'edit':
            return (
                <EmpireInfoEdit
                    empire={viewContext.selectedEmpire!}
                    empireInfo={empireInfo}
                    onSave={onSaveEmpireInfo}
                    onCancel={() => setViewContext({ state: 'view', selectedEmpire: viewContext.selectedEmpire })}
                    onSaveComplete={handleSaveComplete}
                />
            );

        case 'list':
        default:
            return (
                <EmpireInfoList
                    empires={sortedEmpires}
                    empireInfo={empireInfo}
                    loading={loading}
                    onViewEmpire={handleViewEmpire}
                    onEditEmpire={handleEditEmpire}
                />
            );
    }
}
