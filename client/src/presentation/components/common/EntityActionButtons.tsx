import React from 'react';
import ActionButton from './ActionButton';

export interface EntityAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  loading?: boolean;
}

export interface EntityActionButtonsProps {
  actions: EntityAction[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'compact' | 'normal' | 'wide';
}

/**
 * Generic component for entity action buttons
 * Replaces the 20+ ActionButton repetitions found across components
 */
export default function EntityActionButtons({ 
  actions, 
  className = '', 
  orientation = 'horizontal',
  spacing = 'normal'
}: EntityActionButtonsProps) {
  const baseClasses = `entity-action-buttons ${orientation} ${spacing} ${className}`;

  return (
    <div className={baseClasses}>
      {actions.map((action, index) => (
        <ActionButton
          key={`${action.label}-${index}`}
          onClick={action.onClick}
          variant={action.variant}
          disabled={action.disabled || action.loading}
        >
          {action.label}
        </ActionButton>
      ))}
    </div>
  );
}

// Predefined action sets for common patterns
export const createCRUDActions = (
  onEdit: () => void,
  onDelete: () => void,
  onView?: () => void,
  options?: {
    editDisabled?: boolean;
    deleteDisabled?: boolean;
    viewDisabled?: boolean;
    loading?: boolean;
  }
): EntityAction[] => {
  const actions: EntityAction[] = [];
  
  if (onView) {
    actions.push({
      label: 'View',
      onClick: onView,
      variant: 'secondary',
      disabled: options?.viewDisabled || options?.loading
    });
  }
  
  actions.push({
    label: 'Edit',
    onClick: onEdit,
    variant: 'primary',
    disabled: options?.editDisabled || options?.loading
  });
  
  actions.push({
    label: 'Delete',
    onClick: onDelete,
    variant: 'danger',
    disabled: options?.deleteDisabled || options?.loading
  });
  
  return actions;
};

export const createFormActions = (
  onSubmit: () => void,
  onCancel: () => void,
  submitLabel = 'Save',
  options?: {
    submitDisabled?: boolean;
    cancelDisabled?: boolean;
    loading?: boolean;
  }
): EntityAction[] => [
  {
    label: 'Cancel',
    onClick: onCancel,
    variant: 'secondary',
    disabled: options?.cancelDisabled || options?.loading
  },
  {
    label: submitLabel,
    onClick: onSubmit,
    variant: 'primary',
    disabled: options?.submitDisabled,
    loading: options?.loading
  }
];
