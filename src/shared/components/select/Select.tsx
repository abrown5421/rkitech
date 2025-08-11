import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import type { SelectProps } from "./selectTypes";
import { getAnimationClasses } from "../../../client/utils/useAnimation";

const Select: React.FC<SelectProps> = ({
  label,
  TwClassName,
  animation,
  error = false,
  helperText,
  startAdornment,
  endAdornment,
  value,
  onFocus,
  onBlur,
  onChange,
  children,
  creatable = false,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(String(value || ''));
  const [filteredOptions, setFilteredOptions] = useState<Array<{value: string, label: string}>>([]);
  
  const selectRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const animationClasses = getAnimationClasses(animation, isHovered);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  // Extract options from children
  useEffect(() => {
    if (creatable && children) {
      const options: Array<{value: string, label: string}> = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const props = child.props as { value?: string; children?: React.ReactNode };
          options.push({
            value: String(props.value || ''),
            label: String(props.children || props.value || '')
          });
        }
      });
      setFilteredOptions(options);
    }
  }, [children, creatable]);

  // Update input value when prop value changes
  useEffect(() => {
    if (creatable) {
      setInputValue(String(value || ''));
    }
  }, [value, creatable]);

  // Filter options based on input
  useEffect(() => {
    if (creatable && children) {
      const options: Array<{value: string, label: string}> = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const props = child.props as { value?: string; children?: React.ReactNode };
          const optionValue = String(props.value || '');
          const optionLabel = String(props.children || props.value || '');
          if (optionLabel.toLowerCase().includes(inputValue.toLowerCase())) {
            options.push({ value: optionValue, label: optionLabel });
          }
        }
      });
      setFilteredOptions(options);
    }
  }, [inputValue, children, creatable]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFocused(true);
    if (creatable) {
      setShowDropdown(true);
    }
    onFocus?.(e as React.FocusEvent<HTMLSelectElement>);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e as React.FocusEvent<HTMLSelectElement>);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Create a proper synthetic event for the onChange prop
    const syntheticEvent = {
      target: {
        value: newValue,
        name: e.target.name || '',
        type: 'select-one',
        selectedIndex: -1,
        options: [],
        multiple: false
      },
      currentTarget: {
        value: newValue
      },
      type: 'change',
      bubbles: true,
      cancelable: true,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    
    onChange?.(syntheticEvent);
  };

  const handleOptionSelect = (optionValue: string, optionLabel: string) => {
    setInputValue(optionLabel);
    setShowDropdown(false);
    
    // Create a proper synthetic event for the onChange prop
    const syntheticEvent = {
      target: {
        value: optionValue,
        name: '',
        type: 'select-one',
        selectedIndex: -1,
        options: [],
        multiple: false
      },
      currentTarget: {
        value: optionValue
      },
      type: 'change',
      bubbles: true,
      cancelable: true,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    
    onChange?.(syntheticEvent);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (creatable) {
      setShowDropdown(true);
    }
    // Call the original onClick handler if it exists and is for input elements
    const originalOnClick = rest.onClick as React.MouseEventHandler<HTMLInputElement> | undefined;
    originalOnClick?.(e);
  };

  const paddingLeft = startAdornment ? "pl-10" : "pl-3";
  const paddingRight = endAdornment ? "pr-10" : "pr-3";

  if (creatable) {
    // Extract props that are safe for input elements
    const { onClick, ...inputSafeProps } = rest;
    
    return (
      <div
        className={clsx("relative w-full", TwClassName, animationClasses)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={dropdownRef}
      >
        <div
          className={clsx(
            "relative flex items-center border rounded-md transition-colors duration-200",
            error ? "border-red-500" : "border-gray-300",
            focused ? "ring-2 ring-primary border-primary" : "ring-0",
          )}
        >
          {startAdornment && (
            <div className="absolute left-2 flex items-center pointer-events-none text-gray-500">
              {startAdornment}
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            className={clsx(
              "peer w-full h-12 bg-transparent text-base text-black placeholder-transparent focus:outline-none",
              paddingLeft,
              paddingRight,
            )}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleInputClick}
            {...(inputSafeProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />

          {label && (
            <label
              className={clsx(
                "absolute left-3 transition-all duration-200 bg-white px-1 pointer-events-none",
                startAdornment && "left-10",
                (focused || hasValue)
                  ? "text-xs -top-2.5 text-primary"
                  : "text-base top-3 text-gray-500"
              )}
            >
              {label}
            </label>
          )}

          <div className="absolute right-2 flex items-center pointer-events-none text-gray-500">
            {endAdornment}
            <svg 
              className="w-4 h-4 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() => handleOptionSelect(option.value, option.label)}
                >
                  {option.label}
                </div>
              ))
            ) : inputValue.trim() ? (
              <div
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black italic"
                onClick={() => handleOptionSelect(inputValue, inputValue)}
              >
                Create "{inputValue}"
              </div>
            ) : (
              <div className="px-3 py-2 text-gray-500">No options available</div>
            )}
          </div>
        )}

        {helperText && (
          <p className={clsx("text-sm mt-1", error ? "text-red-500" : "text-gray-500")}>
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // Original select implementation for non-creatable mode
  return (
    <div
      className={clsx("relative w-full", TwClassName, animationClasses)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={clsx(
          "relative flex items-center border rounded-md transition-colors duration-200",
          error ? "border-red-500" : "border-gray-300",
          focused ? "ring-2 ring-primary border-primary" : "ring-0",
          TwClassName
        )}
      >
        {startAdornment && (
          <div className="absolute left-2 flex items-center pointer-events-none text-gray-500">
            {startAdornment}
          </div>
        )}

        <select
          ref={selectRef}
          className={clsx(
            "peer w-full h-12 bg-transparent text-base text-black placeholder-transparent focus:outline-none appearance-none",
            paddingLeft,
            paddingRight,
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          value={value}
          {...rest}
        >
          {children}
        </select>

        {label && (
          <label
            className={clsx(
              "absolute left-3 transition-all duration-200 bg-white px-1 pointer-events-none",
              startAdornment && "left-10",
              (focused || hasValue)
                ? "text-xs -top-2.5 text-primary"
                : "text-base top-3 text-gray-500"
            )}
          >
            {label}
          </label>
        )}

        {endAdornment && (
          <div className="absolute right-2 flex items-center pointer-events-none text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && (
        <p className={clsx("text-sm mt-1", error ? "text-red-500" : "text-gray-500")}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;