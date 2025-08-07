import React, { ChangeEvent, MouseEvent } from 'react';
import Dropdown from '../common/Dropdown';

interface SortOption {
    value: string;
    label: string;
}

interface SearchSortBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    sortValue: string;
    onSortChange: (value: string) => void;
    sortOptions: SortOption[];
    placeholder?: string;
    searchClass?: string;
    sortClass?: string;
}

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
}: SearchSortBarProps) {
    return (
        <div className="search-sort-bar" style={{display: 'flex', gap: '0.7rem', alignItems: 'center', marginBottom: '1rem'}}>
            <input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                className={searchClass || "search-input"}
            />
            {searchValue && (
                <button
                    className="search-clear-btn"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => onClearSearch()}
                    title="Clear search"
                >✕</button>
            )}
            <Dropdown
                value={sortValue}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value)}
                options={sortOptions}
                placeholder="Sort by..."
                className={sortClass || "sort-select"}
            />
        </div>
    );
}

