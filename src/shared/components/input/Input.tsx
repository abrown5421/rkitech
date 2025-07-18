import React, { useState, useRef } from "react";
import clsx from "clsx";
import type { InputProps } from "./inputTypes";
import { marginMap, paddingMap } from "../../constants/spacingConstants";
import { getAnimationClasses } from "../../utils/useAnimation";

const Input: React.FC<InputProps> = ({
  label,
  className,
  animation,
  padding,
  margin,
  error = false,
  helperText,
  startAdornment,
  endAdornment,
  value,
  onFocus,
  onBlur,
  onChange,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const animationClasses = getAnimationClasses(animation, isHovered);
  
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const paddingLeft = startAdornment ? "pl-10" : "pl-3";
  const paddingRight = endAdornment ? "pr-10" : "pr-3";

  return (
    <div className={clsx("relative w-full", margin && marginMap[margin], animationClasses)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div
        className={clsx(
          "relative flex items-center border rounded-md transition-colors duration-200",
          error ? "border-red-500" : "border-gray-300",
          focused ? "ring-2 ring-blue-500 border-blue-500" : "ring-0",
          className
        )}
      >
        {startAdornment && (
          <div className="absolute left-2 flex items-center text-gray-500">
            {startAdornment}
          </div>
        )}

        <input
          ref={inputRef}
          className={clsx(
            "peer w-full h-12 bg-transparent text-base placeholder-transparent focus:outline-none",
            paddingLeft,
            paddingRight,
            padding && paddingMap[padding]
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          value={value}
          {...rest}
        />

        {label && (
          <label
            className={clsx(
              "absolute left-3 transition-all duration-200 bg-white px-1",
              startAdornment && "left-10",
              (focused || hasValue)
                ? "text-xs -top-2.5 text-blue-600"
                : "text-base top-3 text-gray-500"
            )}
          >
            {label}
          </label>
        )}

        {endAdornment && (
          <div className="absolute right-2 flex items-center text-gray-500">
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

export default Input;
