import React, { useState } from 'react';
import { Empire } from '../../../../data/models/Empire';
import EmpireBusinessController from '../../../../business/controllers/empire/EmpireBusinessController';

interface EmpireNameEditProps {
    empire: Empire;
    existingEmpires: Empire[];
    onCancel: () => void;
    onSuccess: () => void;
    onError: (error: string) => void;
}

/**
 * EmpireNameEdit Component (Presentation Layer Only)
 * Fixed to remove direct service calls and business logic.
 * All business operations now properly delegated to business controller.
 */
export default function EmpireNameEdit({ 
    empire, 
    existingEmpires, 
    onCancel, 
    onSuccess, 
    onError 
}: EmpireNameEditProps) {
    const [newName, setNewName] = useState(empire.name);
    const [loading, setLoading] = useState(false);

    return (
        <EmpireBusinessController onSuccess={onSuccess} onError={onError}>
            {({ validateEmpireNameUpdate, updateEmpire }) => {
                const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    
                    const validationError = validateEmpireNameUpdate(newName, empire, existingEmpires);
                    if (validationError) {
                        onError(validationError);
                        return;
                    }

                    setLoading(true);
                    
                    try {
                        await updateEmpire(empire.id.toString(), { name: newName.trim() });
                    } catch (error) {
                        // Error already handled by business controller
                    } finally {
                        setLoading(false);
                    }
                };

                return (
                    <div className="empire-name-edit">
                        <h3>Edit Empire Name</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="empireName">Empire Name:</label>
                                <input
                                    id="empireName"
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    disabled={loading}
                                    placeholder="Enter empire name..."
                                    autoFocus
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    disabled={loading || !newName.trim()}
                                    className="btn btn-primary"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={onCancel}
                                    disabled={loading}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                );
            }}
        </EmpireBusinessController>
    );
}
