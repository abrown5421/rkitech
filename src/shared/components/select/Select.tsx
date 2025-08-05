import React, { useState, useRef } from "react";
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
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const animationClasses = getAnimationClasses(animation, isHovered);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const paddingLeft = startAdornment ? "pl-10" : "pl-3";
  const paddingRight = endAdornment ? "pr-10" : "pr-3";

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
