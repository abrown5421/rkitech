import React from 'react';
import type { InputFieldProps } from './inputTypes';

const sizeMap = {
  sm: 'text-sm px-2 py-1',
  md: 'text-base px-3 py-2',
  lg: 'text-lg px-4 py-3',
};

const variantMap = {
  outline: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  filled: 'bg-gray-100 border border-gray-300 focus:bg-white',
  unstyled: 'border-none bg-transparent focus:ring-0',
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onClick,
  onFocus,
  placeholder,
  required,
  error,
  errorText,
  helperText,
  disabled,
  iconStart,
  iconEnd,
  multiline = false,
  rows = 3,
  size = 'md',
  variant = 'outline',
  twClasses = [],
  inputClasses = [],
}) => {
  const Wrapper = multiline ? 'textarea' : 'input';

  const dynamicInputClasses = [
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
    ...inputClasses,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`flex flex-col gap-1 ${twClasses.join(' ')}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative flex items-center">
        {iconStart && <div className="absolute left-3">{iconStart}</div>}
        <Wrapper
          id={name}
          name={name}
          type={type}
          rows={multiline ? rows : undefined}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onClick={onClick as React.MouseEventHandler<any>}
          onFocus={onFocus as React.FocusEventHandler<any>}
          placeholder={placeholder}
          disabled={disabled}
          className={dynamicInputClasses}
        />
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
