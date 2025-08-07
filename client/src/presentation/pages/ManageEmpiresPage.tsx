import React, { useState } from 'react';
import EmpireManagementController from '../../business/controllers/empire/EmpireManagementController';
import EmpireCreationForm from '../components/empire/management/EmpireCreationForm';
import EmpireNameEdit from '../components/empire/management/EmpireNameEdit';
import type { Empire } from '../../data/models/Empire';

/**
 * ManageEmpiresPage (Migrated to New Architecture)
 * Uses the new EmpireManagementController for consistent architecture.
 * Follows the same pattern as AccountPage structure.
 * Implements proper separation of concerns and controller patterns.
 */
export default function ManageEmpiresPage() {
    const [editingEmpire, setEditingEmpire] = useState<Empire | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleEdit = (empire: Empire) => {
        setEditingEmpire(empire);
        setMessage(null);
    };

    const showSuccess = (text: string) => {
        setMessage({ type: 'success', text });
    };

    const showError = (text: string) => {
        setMessage({ type: 'error', text });
    };

    const clearMessage = () => {
        setMessage(null);
    };
    const handleDelete = (empireId: string) => {
        showSuccess('Empire deleted successfully');
    };

    const handleLink = (empireId: string, accountName: string) => {
        showSuccess(`Empire linked to ${accountName} successfully`);
    };

    const handleUnlink = (empireId: string) => {
        showSuccess('Empire unlinked successfully');
    };

    const handleEmpireCreated = () => {
        showSuccess('Empire created successfully');
    };

    const getEmpireAccount = (empireIdOrName: string): string | null => {
        // This should be handled by the business layer
        return null;
    };

    const clearMessages = () => {
        clearMessage();
    };

    return (
        <section className="empire-manage-section card">
            <h2>Manage Empires</h2>
            
            {/* Success/Error Messages */}
            {message && (
                <div className={`${message.type}-message`} onClick={clearMessage}>
                    {message.text}
                </div>
            )}

            {/* Empire Creation Form - Always visible like AccountPage */}
            <EmpireCreationForm
                existingEmpires={[]} // Let form fetch its own data through business layer
                onEmpireCreated={handleEmpireCreated}
                onCancel={() => {
                    // No cancel action needed since form is always visible
                    clearMessages();
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
                        existingEmpires={[]} // Let component fetch its own data
                        onCancel={() => {
                            setEditingEmpire(null);
                            clearMessages();
                        }}
                        onSuccess={() => {
                            setEditingEmpire(null);
                            showSuccess('Empire name updated successfully');
                        }}
                        onError={(errorMsg: string) => {
                            showError(errorMsg);
                        }}
                    />
                </div>
            )}
        </section>
    );
}
