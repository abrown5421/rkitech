import React from 'react';
import type { CheckboxFieldProps } from './checkboxFieldTypes';

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  required = false,
  error = false,
  errorText,
  helperText,
  twClasses = [],
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="inline-flex items-center space-x-2 text-sm font-medium text-gray-700">
        {label && <span>{label}{required && ' *'}</span>}
        <span className="relative flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`peer h-4 w-4 appearance-none rounded border 
              focus:outline-none transition duration-150 ease-in-out
              ${error ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}
              ${twClasses.join(' ')}`}
          />
          
          <svg
            className="pointer-events-none absolute left-0 top-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </label>
      {error && errorText ? (
        <p className="text-xs text-red-600">{errorText}</p>
      ) : (
        helperText && <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default CheckboxField;
