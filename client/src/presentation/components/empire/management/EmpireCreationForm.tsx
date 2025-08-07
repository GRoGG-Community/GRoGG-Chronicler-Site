import React, { useState } from 'react';
import EmpireBusinessController from '../../../../business/controllers/empire/EmpireBusinessController';
import { Empire, EmpireCreationFormProps } from '../../../../data/models/Empire';
import { useEntityState } from '../../../../business/hooks/infrastructure/useEntityState';

/**
 * EmpireCreationForm (Presentation Layer Only)
 * Fixed to remove direct service calls and business logic.
 * All business operations now properly delegated to business controller.
 */

export default function EmpireCreationForm({
    existingEmpires,
    onEmpireCreated,
    onCancel
}: EmpireCreationFormProps) {
    const [empireName, setEmpireName] = useState('');
    const entityState = useEntityState();

    const handleBusinessSuccess = () => {
        entityState.setSuccess('Empire created successfully!');
        setEmpireName('');
        onEmpireCreated();
    };

    const handleBusinessError = (error: string) => {
        entityState.setError(error);
    };

    return (
        <EmpireBusinessController onSuccess={handleBusinessSuccess} onError={handleBusinessError}>
            {({ validateEmpireName, createEmpire }) => {
                const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    
                    const validationError = validateEmpireName(empireName, existingEmpires);
                    if (validationError) {
                        entityState.setError(validationError);
                        return;
                    }

                    entityState.setLoading(true);
                    entityState.clearMessages();

                    try {
                        await createEmpire(empireName);
                    } catch (err) {
                        // Error already handled by business controller
                    } finally {
                        entityState.setLoading(false);
                    }
                };

                const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmpireName(e.target.value);
                    if (entityState.error) entityState.clearMessages(); // Clear error when user starts typing
                };

                return (
                    <>
                        <form
                            onSubmit={handleSubmit}
                            className="empire-form"
                        >
                            <div className="empire-form-fields">
                                <input
                                    placeholder="Empire name"
                                    value={empireName}
                                    onChange={handleNameChange}
                                    required
                                    className="login-input"
                                    disabled={entityState.loading}
                                    maxLength={50}
                                />
                                <div className="empire-form-button-container">
                                    <button
                                        type="submit"
                                        className="login-btn empire-create-btn"
                                        onClick={e => e.stopPropagation()}
                                        disabled={!empireName.trim() || entityState.loading}
                                    >Create Empire</button>
                                </div>
                            </div>
                        </form>
                        {entityState.error && <div className="error-message">{entityState.error}</div>}
                        {entityState.success && <div className="success-message">{entityState.success}</div>}
                    </>
                );
            }}
        </EmpireBusinessController>
    );
}
