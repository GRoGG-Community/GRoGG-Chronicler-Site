import { useState } from 'react';

export interface EntityState {
  error: string;
  success: string;
  loading: boolean;
}

export interface EntityStateActions {
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  reset: () => void;
}

export interface UseEntityStateReturn extends EntityState, EntityStateActions {}

/**
 * Custom hook for managing common entity state (error, success, loading)
 * Replaces the duplicate useState patterns found across 8+ components
 */
export function useEntityState(initialState?: Partial<EntityState>): UseEntityStateReturn {
  const [error, setError] = useState(initialState?.error || '');
  const [success, setSuccess] = useState(initialState?.success || '');
  const [loading, setLoading] = useState(initialState?.loading || false);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const reset = () => {
    setError('');
    setSuccess('');
    setLoading(false);
  };

  return {
    error,
    success,
    loading,
    setError,
    setSuccess,
    setLoading,
    clearMessages,
    reset
  };
}
