import React from 'react';
import Dropdown from './Dropdown';

export default function SearchSortBar({
    searchValue,
    onSearchChange,
    onClearSearch,
    sortValue,
    onSortChange,
    sortOptions,
    placeholder = "Search...",
    searchClass = "",
    sortClass = ""
}) {
    return (
        <div className="search-sort-bar" style={{display: 'flex', gap: '0.7rem', alignItems: 'center', marginBottom: '1rem'}}>
            <input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={e => onSearchChange(e.target.value)}
                className={searchClass || "search-input"}
            />
            {searchValue && (
                <button
                    className="search-clear-btn"
                    onClick={onClearSearch}
                    title="Clear search"
                >✕</button>
            )}
            <Dropdown
                value={sortValue}
                onChange={e => onSortChange(e.target.value)}
                options={sortOptions}
                placeholder="Sort by..."
                className={sortClass || "sort-select"}
            />
        </div>
    );
}

