
import React, { useState } from 'react';
import { useEmpirePage } from '../hooks/useEmpirePage';
import { StandardizedMessage } from '../components/common/StandardizedMessage';
import EmpireInfoListController from '../../business/controllers/empire/EmpireInfoListController';
import SearchSortBar from '../components/common/SearchSortBar';

/**
 * EmpirePage (Presentation Layer)
 * Uses presentation hook to maintain proper separation of concerns.
 * All business logic is delegated through the useEmpirePage hook.
 */
export default function EmpirePage() {
    const {
        empires,
        loading,
        error,
        success,
        refreshEmpires,
        clearError,
        clearSuccess
    } = useEmpirePage();

    const [empireSearch, setEmpireSearch] = useState('');
    const [empireSort, setEmpireSort] = useState('name');

    const handleEmpireInfoSaved = () => {
        refreshEmpires();
    };

    return (
        <div className="empires-info-section card">
            <h2>Empire Information</h2>
            
            {/* Standardized Success/Error Messages */}
            <StandardizedMessage 
                type="error"
                message={error}
                onDismiss={clearError}
            />
            <StandardizedMessage 
                type="success"
                message={success}
                onDismiss={clearSuccess}
            />
            
            <SearchSortBar
                searchValue={empireSearch}
                onSearchChange={setEmpireSearch}
                onClearSearch={() => setEmpireSearch('')}
                sortValue={empireSort}
                onSortChange={setEmpireSort}
                sortOptions={[
                    { value: 'name', label: 'Name' },
                    { value: 'account', label: 'Account' }
                ]}
            />
            
            <EmpireInfoListController
                searchTerm={empireSearch}
                sortBy={empireSort}
                onSaveComplete={handleEmpireInfoSaved}
            />
        </div>
    );
}
