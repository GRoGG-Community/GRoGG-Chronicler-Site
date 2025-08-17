import React, { useState } from 'react';
import { useEmpirePage } from '../hooks/useEmpirePage';
import { StandardizedMessage } from '../components/common/StandardizedMessage';
import EmpireManagementController from '../../business/controllers/empire/EmpireManagementController';
import EmpireCreationForm from '../components/empire/management/EmpireCreationForm';
import EmpireNameEdit from '../components/empire/management/EmpireNameEdit';
import type { Empire } from '../../data/models/Empire';

/**
 * ManageEmpiresPage (Presentation Layer)
 * Uses presentation hook to maintain proper separation of concerns.
 * All business logic is delegated through the useEmpirePage hook.
 */
export default function ManageEmpiresPage() {
    const {
        empires,
        loading,
        error,
        success,
        refreshEmpires,
        clearError,
        clearSuccess
    } = useEmpirePage();

    const [editingEmpire, setEditingEmpire] = useState<Empire | null>(null);

    const handleEdit = (empire: Empire) => {
        setEditingEmpire(empire);
    };

    const handleDelete = (empireId: string) => {
        refreshEmpires();
    };

    const handleLink = (empireId: string, accountName: string) => {
        refreshEmpires();
    };

    const handleUnlink = (empireId: string) => {
        refreshEmpires();
    };

    const handleEmpireCreated = () => {
        refreshEmpires();
    };

    const getEmpireAccount = (empireIdOrName: string): string | null => {
        // Find empire by ID or name and return its account
        const empire = empires.find(emp => 
            emp.id === empireIdOrName || emp.name === empireIdOrName
        );
        return empire?.account || null;
    };

    const handleEmpireUpdated = () => {
        setEditingEmpire(null);
        refreshEmpires();
    };

    const handleCancelEdit = () => {
        setEditingEmpire(null);
    };

    return (
        <section className="empire-manage-section card">
            <h2>Manage Empires</h2>
            
            {/* Standardized Success/Error Messages */}
            <StandardizedMessage 
                type="error"
                message={error}
                onDismiss={clearError}
            />
            <StandardizedMessage 
                type="success"
                message={success}
                onDismiss={clearSuccess}
            />

            {/* Empire Creation Form */}
            <EmpireCreationForm
                existingEmpires={empires}
                onEmpireCreated={handleEmpireCreated}
                onCancel={() => {
                    // No cancel action needed since form is always visible
                }}
            />

            <h3>All Empires</h3>
            <EmpireManagementController
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLink={handleLink}
                onUnlink={handleUnlink}
                getEmpireAccount={getEmpireAccount}
            />

            {/* Empire Name Editing */}
            {editingEmpire && (
                <div className="empire-edit-section">
                    <h3>Edit Empire: {editingEmpire.name}</h3>
                    <EmpireNameEdit
                        empire={editingEmpire}
                        existingEmpires={empires}
                        onCancel={handleCancelEdit}
                        onSuccess={handleEmpireUpdated}
                        onError={(errorMsg: string) => {
                            // Error handled by the hook
                        }}
                    />
                </div>
            )}
        </section>
    );
}
