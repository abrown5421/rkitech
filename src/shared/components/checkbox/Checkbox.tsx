import React, { useState } from "react";
import clsx from "clsx";
import type { CheckboxProps } from "./checkboxTypes";
import { getAnimationClasses } from "../../../client/utils/useAnimation";

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  TwClassName,
  animation,
  error = false,
  helperText,
  checked,
  onChange,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);

  return (
    <div
      className={clsx("relative", TwClassName, animationClasses)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="flex items-center space-x-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={clsx(
            "form-checkbox h-5 w-5 rounded border transition duration-150",
            error ? "border-red-500 text-red-500" : "border-gray-300 text-amber-500",
            "focus:ring-2 focus:ring-offset-1 focus:ring-primary"
          )}
          {...rest}
        />
        {label && (
          <span
            className={clsx(
              "text-base",
              error ? "text-red-500" : "text-gray-700"
            )}
          >
            {label}
          </span>
        )}
      </label>

      {helperText && (
        <p
          className={clsx(
            "text-sm mt-1",
            error ? "text-red-500" : "text-gray-500"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
