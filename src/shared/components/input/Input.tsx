import React, { useState, useRef } from "react";
import clsx from "clsx";
import type { InputProps } from "./inputTypes";
import { getAnimationClasses } from "../../../client/utils/useAnimation";

const Input: React.FC<InputProps> = ({
  label,
  TwClassName,
  animation,
  error = false,
  helperText,
  startAdornment,
  endAdornment,
  value,
  multiline = false,
  rows = 3,
  onFocus,
  onBlur,
  onChange,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const animationClasses = getAnimationClasses(animation, isHovered);

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<any>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange?.(e as React.ChangeEvent<HTMLInputElement>);
  };

  const paddingLeft = startAdornment ? "pl-10" : "pl-3";
  const paddingRight = endAdornment ? "pr-10" : "pr-3";

  const baseInputClasses = clsx(
    "peer w-full text-base placeholder-transparent focus:outline-none",
    paddingLeft,
    paddingRight,
    multiline ? "resize-none pt-2" : "h-12",
    rows === "fill" ? "flex-grow" : null,
    rest.disabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-transparent text-gray-900"
  );

  return (
    <div
      className={clsx("relative w-full", rows === "fill" && "flex-grow", TwClassName, animationClasses)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={clsx(
          "relative flex border rounded-md transition-colors duration-200",
          rest.disabled
            ? "border-gray-200 bg-gray-100"
            : error
              ? "border-red-500"
              : "border-gray-300",
          focused && !rest.disabled ? "ring-2 ring-primary border-primary" : "ring-0",
          rows === "fill" ? "h-full" : "items-center",
        )}
      >
        {startAdornment && (
          <div className="absolute left-2 flex items-center text-gray-500">
            {startAdornment}
          </div>
        )}

        {multiline ? (
          <textarea 
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={baseInputClasses}
            rows={typeof rows === "number" ? rows : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={baseInputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            value={value}
            {...rest}
          />
        )}

        {label && (
          <label
            className={clsx(
              "absolute left-3 transition-all duration-200 bg-gray-50 px-1",
              startAdornment && "left-10",
              (focused || hasValue)
                ? rest.disabled
                  ? "text-xs -top-2.5 text-gray-400"
                  : "text-xs -top-2.5 text-amber-500"
                : rest.disabled
                  ? "text-base top-3 text-gray-400"
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
