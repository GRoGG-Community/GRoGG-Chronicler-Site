import React from 'react';

interface Option {
    value?: string | number;
    label?: string;
}

interface FormFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    type?: string;
    as?: 'input' | 'textarea' | 'select';
    options?: (Option | string)[];
    disabled?: boolean;
    required?: boolean;
    rows?: number;
    className?: string;
    [key: string]: any;
}

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
}: FormFieldProps) {
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
                    {options.map((opt, index) => {
                        const option = typeof opt === 'string' ? { value: opt, label: opt } : opt;
                        return (
                            <option key={option.value ?? index} value={option.value ?? ''}>
                                {option.label ?? ''}
                            </option>
                        );
                    })}
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
