import React from 'react';

export default function Dropdown({
    value,
    onChange,
    options,
    placeholder = "Select...",
    disabled = false,
    className = "",
    style = {},
    ...props
}) {
    return (
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={className}
            style={style}
            {...props}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(opt =>
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                    {opt.label ?? opt}
                </option>
            )}
        </select>
    );
}
