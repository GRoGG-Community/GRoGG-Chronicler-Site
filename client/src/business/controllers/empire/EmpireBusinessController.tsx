import React from 'react';
import { EmpireBusinessService } from '../../services/EmpireBusinessService';
import type { Empire } from '../../../data/models/Empire';

/**
 * EmpireBusinessController (Business Layer)
 * Handles all empire business operations and validation.
 * Provides clean interface to presentation layer without exposing business logic.
 */

interface EmpireBusinessControllerProps {
    children: (operations: {
        validateEmpireName: (name: string, existingEmpires: Empire[]) => string | null;
        validateEmpireNameUpdate: (newName: string, empire: Empire, existingEmpires: Empire[]) => string | null;
        createEmpire: (empireName: string, account?: string) => Promise<void>;
        updateEmpire: (empireId: string, updates: Partial<Empire>) => Promise<void>;
        saveEmpireInfo: (empireId: string, info: any) => Promise<void>;
    }) => React.ReactNode;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function EmpireBusinessController({
    children,
    onSuccess,
    onError
}: EmpireBusinessControllerProps) {
    const handleError = (error: unknown, defaultMessage: string) => {
        const message = error instanceof Error ? error.message : defaultMessage;
        if (onError) {
            onError(message);
        } else {
            console.error(message, error);
        }
    };

    const handleSuccess = () => {
        if (onSuccess) {
            onSuccess();
        }
    };

    const operations = {
        validateEmpireName: (name: string, existingEmpires: Empire[]) => {
            return EmpireBusinessService.validateEmpireName(name, existingEmpires);
        },
        
        validateEmpireNameUpdate: (newName: string, empire: Empire, existingEmpires: Empire[]) => {
            return EmpireBusinessService.validateEmpireNameUpdate(newName, empire, existingEmpires);
        },
        
        createEmpire: async (empireName: string, account?: string) => {
            try {
                await EmpireBusinessService.createEmpire({ 
                    id: Date.now(),
                    name: empireName.trim(),
                    account: account || ''
                });
                handleSuccess();
            } catch (error) {
                handleError(error, 'Failed to create empire');
                throw error;
            }
        },
        
        updateEmpire: async (empireId: string, updates: Partial<Empire>) => {
            try {
                await EmpireBusinessService.updateEmpire(empireId, updates);
                handleSuccess();
            } catch (error) {
                handleError(error, 'Failed to update empire');
                throw error;
            }
        },
        
        saveEmpireInfo: async (empireId: string, info: any) => {
            try {
                await EmpireBusinessService.saveEmpireInfo(empireId, info);
                handleSuccess();
            } catch (error) {
                handleError(error, 'Failed to save empire info');
                throw error;
            }
        }
    };

    return <>{children(operations)}</>;
}
