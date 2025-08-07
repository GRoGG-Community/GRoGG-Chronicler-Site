import React, { useState } from 'react';
import { TreatyBusinessService } from '../../services/TreatyBusinessService';
import type { Treaty } from '../../../data/models/Treaty';
import type { CurrentAccount } from '../../../data/types/AccountTypes';

/**
 * TreatyBusinessController (Business Layer)
 * Handles all treaty business operations and permission checking.
 * Provides clean interface to presentation layer without exposing business logic.
 */

interface TreatyBusinessControllerProps {
    children: (operations: {
        canEdit: (treaty: Treaty) => boolean | string | null;
        canDelete: (treaty: Treaty) => boolean | null;
        deleteTreaty: (treaty: Treaty) => Promise<void>;
        updateTreaty: (treaty: Treaty, form: Partial<Treaty>) => Promise<void>;
        createTreaty: (form: Partial<Treaty>) => Promise<void>;
    }) => React.ReactNode;
    account: CurrentAccount | null;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function TreatyBusinessController({
    children,
    account,
    onSuccess,
    onError
}: TreatyBusinessControllerProps) {
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
        canEdit: (treaty: Treaty) => TreatyBusinessService.canEdit(treaty, account?.username),
        
        canDelete: (treaty: Treaty) => TreatyBusinessService.canDelete(treaty, account?.username),
        
        deleteTreaty: async (treaty: Treaty) => {
            if (!TreatyBusinessService.canDelete(treaty, account?.username)) {
                throw new Error('You do not have permission to delete this treaty');
            }
            
            try {
                await TreatyBusinessService.deleteTreaty(treaty.id.toString());
                handleSuccess();
            } catch (error) {
                handleError(error, 'Failed to delete treaty');
                throw error;
            }
        },
        
        updateTreaty: async (treaty: Treaty, form: Partial<Treaty>) => {
            if (!TreatyBusinessService.canEdit(treaty, account?.username)) {
                throw new Error('You do not have permission to edit this treaty');
            }
            
            try {
                await TreatyBusinessService.updateTreaty(treaty.id.toString(), form);
                handleSuccess();
            } catch (error) {
                handleError(error, 'Failed to update treaty');
                throw error;
            }
        },
        
        createTreaty: async (form: Partial<Treaty>) => {
            try {
                await TreatyBusinessService.createTreaty(form);
                handleSuccess();
            } catch (error) {
                handleError(error, 'Failed to create treaty');
                throw error;
            }
        }
    };

    return <>{children(operations)}</>;
}
