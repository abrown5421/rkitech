import React from 'react';
import type { SelectFieldProps } from './selectFieldType';

const sizeMap = {
  sm: 'text-sm px-2 py-1',
  md: 'text-base px-3 py-2',
  lg: 'text-lg px-4 py-3',
};

const variantMap = {
  outline: 'border border-gray-300 focus:border-amber-500 focus:ring-amber-500',
  filled: 'bg-gray-100 border border-gray-300 focus:bg-white',
  unstyled: 'border-none bg-transparent focus:ring-0',
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  required,
  error,
  errorText,
  helperText,
  disabled,
  multiple = false,
  options,
  iconStart,
  iconEnd,
  size = 'md',
  variant = 'outline',
  twClasses = [],
  selectClasses = [],
}) => {
  const dynamicSelectClasses = [
    'w-full',
    'rounded-lg',
    'outline-none',
    'transition',
    'duration-150',
    sizeMap[size],
    variantMap[variant],
    error ? 'border-red-500 ring-red-500 focus:ring-red-500' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    iconStart ? 'pl-10' : '',
    iconEnd ? 'pr-10' : '',
    ...selectClasses,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
      onChange?.(selected);
    } else {
      onChange?.(e.target.value);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${twClasses.join(' ')}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative flex items-center">
        {iconStart && <div className="absolute left-3">{iconStart}</div>}
        <select
          id={name}
          name={name}
          multiple={multiple}
          value={value} 
          defaultValue={defaultValue} 
          disabled={disabled}
          onChange={handleChange}
          className={dynamicSelectClasses}
        >
          {!multiple && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {iconEnd && <div className="absolute right-3">{iconEnd}</div>}
      </div>
      {error && errorText ? (
        <p className="text-xs text-red-600">{errorText}</p>
      ) : (
        helperText && <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
