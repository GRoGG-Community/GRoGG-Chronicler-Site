/**
 * Presentation Layer Barrel Exports
 * Exports presentation-specific hooks and utilities
 * Follows 5-layer architecture separation of concerns
 */

// Presentation Hooks
export * from './hooks/useAccountSelection';
export * from './hooks/usePageController';
export * from './hooks/useAccountPage';
export * from './hooks/useTreatyPage';
export * from './hooks/useEmpirePage';

// Common UI Components (when needed)
// export * from './components/common';

// Page Components
export { default as AccountPage } from './pages/AccountPage';
export { default as EmpirePage } from './pages/EmpirePage';
export { default as ManageEmpiresPage } from './pages/ManageEmpiresPage';
export { default as MessageBoardPage } from './pages/MessageBoardPage';
export { default as TreatyPage } from './pages/TreatyPage';
