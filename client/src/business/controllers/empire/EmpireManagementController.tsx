import React from 'react';
import { LoadingMessage } from "../../../presentation/components/common/Messages";
import EmpireList from "../../../presentation/components/empire/EmpireList";
import { Empire } from "../../../data/models/Empire";
import { useEmpireData } from '../../hooks/data/useEmpireData';
import { useEmpireActions } from '../../hooks/business/useEmpireActions';
import { useConfirmDelete } from '../../hooks/infrastructure/useCommonUtilities';

/**
 * EmpireManagementController (Controller Pattern)
 * Refactored to use consolidated hooks for better separation of concerns.
 * Implements 5-layer architecture with proper hook delegation.
 */

interface EmpireManagementControllerProps {
    onEdit?: (empire: Empire) => void;
    onDelete?: (empireId: string) => void;
    onLink?: (empireId: string, accountName: string) => void;
    onUnlink?: (empireId: string) => void;
    getEmpireAccount?: (empireName: string) => string | null;
}

export default function EmpireManagementController({
    onEdit,
    onDelete,
    onLink,
    onUnlink,
    getEmpireAccount
}: EmpireManagementControllerProps) {
    // Use consolidated hooks for separation of concerns
    const { empires, loading: dataLoading, error: dataError, refreshEmpires } = useEmpireData();
    const { deleteEmpire, loading: actionLoading, error: actionError } = useEmpireActions(
        () => refreshEmpires(), // Refresh data on successful operations
        (error) => console.error('Empire action failed:', error)
    );
    
    const { confirmDelete } = useConfirmDelete();

    // Combine loading and error states
    const loading = dataLoading || actionLoading;
    const error = dataError || actionError;

    const handleViewEmpire = (empire: Empire) => {
        console.log('Viewing empire:', empire);
    };

    const handleEditEmpire = (empireName: string) => {
        const empire = empires.find((e: Empire) => e.name === empireName);
        if (empire && onEdit) {
            onEdit(empire);
        }
    };

    const handleDeleteEmpire = (empireId: string) => {
        const empire = empires.find((e: Empire) => e.id.toString() === empireId);
        if (!empire) return;

        const confirmed = confirmDelete('empire', empire.name);
        if (confirmed) {
            deleteEmpire(empireId).then(() => {
                if (onDelete) {
                    onDelete(empireId);
                }
            }).catch((error) => {
                console.error('Failed to delete empire:', error);
            });
        }
    };

    const handleLink = (empireId: string, accountId: string) => {
        if (onLink) {
            onLink(empireId, accountId);
        }
    };

    const handleUnlink = (empireId: string) => {
        if (onUnlink) {
            onUnlink(empireId);
        }
    };

    const handleGetEmpireAccount = (empireId: string) => {
        const empire = empires.find((e: Empire) => e.id.toString() === empireId);
        if (empire && getEmpireAccount) {
            return getEmpireAccount(empire.name);
        }
        return null;
    };

    if (loading && empires.length === 0) {
        return <LoadingMessage />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <EmpireList
            empires={empires}
            loading={loading}
            onEdit={handleEditEmpire}
            onDelete={handleDeleteEmpire}
            onLink={handleLink}
            onUnlink={handleUnlink}
            getEmpireAccount={handleGetEmpireAccount}
        />
    );
}
