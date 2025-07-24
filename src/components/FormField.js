import React from 'react';

export default function FormField({
    label,
    name,
    value,
    onChange,
    type = 'text',
    as = 'input',
    options = [],
    disabled = false,
    required = false,
    rows,
    className = '',
    ...props
}) {
    return (
        <label className={className}>
            {label}
            {as === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    rows={rows}
                    {...props}
                />
            ) : as === 'select' ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    {...props}
                >
                    {options.map(opt =>
                        <option key={opt.value ?? opt} value={opt.value ?? opt}>
                            {opt.label ?? opt}
                        </option>
                    )}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
            )}
        </label>
    );
}
