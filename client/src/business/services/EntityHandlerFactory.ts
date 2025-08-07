import { FormEvent } from 'react';

export interface EntityHandlerConfig<T> {
  entityName: string;
  validateData: (data: Partial<T>) => string | null;
  transformData?: (data: Partial<T>) => Partial<T>;
  onSuccess?: () => void;
  resetForm?: () => void;
  // Use data layer clients instead of direct API calls
  createEntity: (data: Partial<T>) => Promise<Response>;
  updateEntity: (id: string | number, data: Partial<T>) => Promise<Response>;
  deleteEntity: (id: string | number) => Promise<Response>;
}

export interface EntityStateSetters {
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Generic handler factory that eliminates the massive duplication in handlers.js
 * Reduces ~300 lines of similar handler patterns to reusable functions
 */
export class EntityHandlerFactory {
  /**
   * Create a generic create handler
   */
  static createHandler<T>(
    config: EntityHandlerConfig<T>,
    stateSetters: EntityStateSetters,
    refreshData?: () => Promise<void>
  ) {
    return async (e: FormEvent, data: Partial<T>) => {
      e.preventDefault();
      
      const { setError, setSuccess, setLoading } = stateSetters;
      const { entityName, validateData, transformData, onSuccess, resetForm, createEntity } = config;

      // Clear previous messages
      setError('');
      setSuccess('');
      setLoading(true);

      try {
        // Validate data
        const validationError = validateData(data);
        if (validationError) {
          setError(validationError);
          return;
        }

        // Transform data if needed
        const finalData = transformData ? transformData(data) : data;

        // Use data layer client instead of direct HTTP call
        const response = await createEntity({
          id: Date.now(),
          ...finalData
        });

        if (response.ok) {
          setSuccess(`${entityName} created successfully.`);
          resetForm?.();
          onSuccess?.();
          await refreshData?.();
        } else {
          const errorData = await response.json();
          setError(errorData.message || `Failed to create ${entityName.toLowerCase()}.`);
        }
      } catch (error) {
        setError(`Error creating ${entityName.toLowerCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
  }

  /**
   * Create a generic update handler
   */
  static updateHandler<T>(
    config: EntityHandlerConfig<T>,
    stateSetters: EntityStateSetters,
    refreshData?: () => Promise<void>
  ) {
    return async (id: string | number, data: Partial<T>) => {
      const { setError, setSuccess, setLoading } = stateSetters;
      const { entityName, validateData, transformData, onSuccess, updateEntity } = config;

      setError('');
      setSuccess('');
      setLoading(true);

      try {
        const validationError = validateData(data);
        if (validationError) {
          setError(validationError);
          return;
        }

        const finalData = transformData ? transformData(data) : data;

        // Use data layer client instead of direct HTTP call
        const response = await updateEntity(id, finalData);

        if (response.ok) {
          setSuccess(`${entityName} updated successfully.`);
          onSuccess?.();
          await refreshData?.();
        } else {
          const errorData = await response.json();
          setError(errorData.message || `Failed to update ${entityName.toLowerCase()}.`);
        }
      } catch (error) {
        setError(`Error updating ${entityName.toLowerCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
  }

  /**
   * Create a generic delete handler
   */
  static deleteHandler(
    entityName: string,
    deleteEntity: (id: string | number) => Promise<Response>,
    stateSetters: EntityStateSetters,
    refreshData?: () => Promise<void>
  ) {
    return async (id: string | number) => {
      const { setError, setSuccess, setLoading } = stateSetters;

      setError('');
      setSuccess('');
      setLoading(true);

      try {
        // Use data layer client instead of direct HTTP call
        const response = await deleteEntity(id);

        if (response.ok) {
          setSuccess(`${entityName} deleted successfully.`);
          await refreshData?.();
        } else {
          const errorData = await response.json();
          setError(errorData.message || `Failed to delete ${entityName.toLowerCase()}.`);
        }
      } catch (error) {
        setError(`Error deleting ${entityName.toLowerCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
  }
}

// Import data layer clients
import { AccountDataService } from '../../data/services/AccountDataService';
import { EmpireDataService } from '../../data/services/EmpireDataService';
import { TreatyDataService } from '../../data/services/TreatyDataService';

// Predefined configurations for common entities
export const ACCOUNT_HANDLER_CONFIG: EntityHandlerConfig<any> = {
  entityName: 'Account',
  validateData: (data) => {
    const name = data.name?.trim();
    const password = data.password?.trim();
    if (!name || !password) {
      return 'Account name and password are required.';
    }
    return null;
  },
  transformData: (data) => ({
    name: data.name?.trim(),
    password: data.password?.trim()
  }),
  createEntity: (data) => AccountDataService.createAccount(data.name, data.password),
  updateEntity: (id, data) => AccountDataService.editAccount(Number(id), data.name, data.password),
  deleteEntity: async (id) => {
    const result = await AccountDataService.deleteAccount(id.toString());
    return result || new Response();
  }
};

export const EMPIRE_HANDLER_CONFIG: EntityHandlerConfig<any> = {
  entityName: 'Empire',
  validateData: (data) => {
    const name = data.name?.trim();
    if (!name) {
      return 'Empire name is required.';
    }
    return null;
  },
  transformData: (data) => ({
    ...data,
    name: data.name?.trim(),
    account: data.account || "" // Ensure new empires have account field (empty = unlinked)
  }),
  createEntity: (data) => EmpireDataService.createEmpire(data),
  updateEntity: (id, data) => EmpireDataService.updateEmpire(id.toString(), data),
  deleteEntity: (id) => EmpireDataService.deleteEmpire(id.toString())
};

export const TREATY_HANDLER_CONFIG: EntityHandlerConfig<any> = {
  entityName: 'Treaty',
  validateData: (data) => {
    if (!data.parties || !Array.isArray(data.parties) || data.parties.length < 2) {
      return 'At least two parties are required for a treaty.';
    }
    if (!data.title?.trim()) {
      return 'Treaty title is required.';
    }
    return null;
  },
  transformData: (data) => ({
    ...data,
    title: data.title?.trim(),
    content: data.content?.trim()
  }),
  createEntity: (data) => TreatyDataService.createTreaty(data),
  updateEntity: (id, data) => TreatyDataService.updateTreaty(id.toString(), data),
  deleteEntity: (id) => TreatyDataService.deleteTreaty(id.toString())
};
