
import React, { useState } from 'react';
import EmpireInfoListController from '../../business/controllers/empire/EmpireInfoListController';
import SearchSortBar from '../components/common/SearchSortBar';

/**
 * EmpirePage (Presentation Layer Only)
 * Fixed to remove direct cache operations and data management.
 * All business logic is now properly delegated to controllers.
 */
export default function EmpirePage() {
    const [empireSearch, setEmpireSearch] = useState('');
    const [empireSort, setEmpireSort] = useState('name');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showSuccess = (text: string) => {
        setMessage({ type: 'success', text });
    };

    const showError = (text: string) => {
        setMessage({ type: 'error', text });
    };

    const clearMessage = () => {
        setMessage(null);
    };

    const handleEmpireInfoSaved = () => {
        showSuccess('Empire information saved successfully');
    };

    return (
        <div className="empires-info-section card">
            <h2>Empire Information</h2>
            
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                    <button onClick={clearMessage}>×</button>
                </div>
            )}
            
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
