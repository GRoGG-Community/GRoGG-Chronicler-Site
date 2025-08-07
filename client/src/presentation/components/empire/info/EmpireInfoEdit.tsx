import React, { useState } from 'react';
import { useEntityState } from '../../../../business/hooks/infrastructure/useEntityState';
import { useFormHelpers } from '../../../../business/hooks/infrastructure/useCommonUtilities';
import EntityActionButtons, { createFormActions } from '../../common/EntityActionButtons';
import type { Empire, EmpireInfo } from '../../../../data/models/Empire';

/**
 * EmpireInfoEdit (Form Component, Command Pattern)
 * Handles editing of empire information.
 * Implements the Command pattern for save operations.
 * Uses controlled components for form state management.
 */

interface EmpireInfoEditProps {
    empire: Empire;
    empireInfo: Record<string, EmpireInfo>;
    onSave: (empireName: string, info: EmpireInfo) => Promise<void>;
    onCancel: () => void;
    onSaveComplete: () => void;
}

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea';
    rows?: number;
    placeholder?: string;
}

// Configuration for form fields (Strategy Pattern)
const FORM_FIELDS: FormField[] = [
    {
        name: 'lore',
        label: 'Lore',
        type: 'textarea',
        rows: 4,
        placeholder: 'Enter empire background and history...'
    },
    {
        name: 'stats',
        label: 'Stats',
        type: 'text',
        placeholder: 'Enter empire statistics...'
    },
    {
        name: 'ethics',
        label: 'Ethics',
        type: 'text',
        placeholder: 'Enter empire ethics...'
    },
    {
        name: 'civics',
        label: 'Civics',
        type: 'text',
        placeholder: 'Enter empire civics...'
    },
    {
        name: 'special',
        label: 'Special Info',
        type: 'text',
        placeholder: 'Enter special information...'
    }
];

export default function EmpireInfoEdit({
    empire,
    empireInfo,
    onSave,
    onCancel,
    onSaveComplete
}: EmpireInfoEditProps) {
    // Get existing info, preferring ID-based lookup
    const existingInfo = empireInfo[empire.id] || empireInfo[empire.name] || {};
    const [formData, setFormData] = useState<EmpireInfo>(existingInfo);
    const entityState = useEntityState();
    const { createChangeHandler } = useFormHelpers<EmpireInfo>();

    const handleFieldChange = createChangeHandler(setFormData);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        entityState.setLoading(true);
        entityState.clearMessages();

        try {
            await onSave(empire.name, formData);
            entityState.setSuccess('Empire information saved successfully!');
            onSaveComplete();
        } catch (err) {
            entityState.setError('Failed to save empire information');
            console.error('Save error:', err);
        } finally {
            entityState.setLoading(false);
        }
    };

    const renderField = (field: FormField) => {
        const value = formData[field.name] || '';
        
        return (
            <label key={field.name} className="empire-form-field">
                {field.label}:
                {field.type === 'textarea' ? (
                    <textarea
                        name={field.name}
                        value={value}
                        onChange={handleFieldChange(field.name)}
                        rows={field.rows}
                        placeholder={field.placeholder}
                        disabled={entityState.loading}
                    />
                ) : (
                    <input
                        type="text"
                        name={field.name}
                        value={value}
                        onChange={handleFieldChange(field.name)}
                        placeholder={field.placeholder}
                        disabled={entityState.loading}
                    />
                )}
            </label>
        );
    };

    return (
        <div className="empire-edit-container">
            <div className="empire-edit-header">
                <h3>Edit Empire Information: {empire.name}</h3>
            </div>
            
            <form className="empire-edit-form" onSubmit={handleSave}>
                {entityState.error && (
                    <div className="error-message" style={{ marginBottom: '1rem' }}>
                        {entityState.error}
                    </div>
                )}

                {entityState.success && (
                    <div className="success-message" style={{ marginBottom: '1rem' }}>
                        {entityState.success}
                    </div>
                )}
                
                {FORM_FIELDS.map(renderField)}
                
                <div className="empire-form-actions">
                    <EntityActionButtons 
                        actions={createFormActions(
                            () => handleSave({ preventDefault: () => {} } as React.FormEvent),
                            onCancel,
                            'Save Information',
                            {
                                loading: entityState.loading
                            }
                        )}
                    />
                </div>
            </form>
        </div>
    );
}
