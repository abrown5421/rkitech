import React from 'react';
import { animationDelayMap } from './loaderConstants';
import type { LoaderProps } from './loaderTypes';

const Loader: React.FC<LoaderProps> = ({
  variant = "flash",
  color = "bg-gray-300",
  size = 16,
}) => {
  if (variant === "spinner") {
    const spinnerSize = size * 1.5;
    return (
      <div
        className={`border-4 rounded-full animate-spin`}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderColor: color.replace("bg-", "border-"),
          borderTopColor: "transparent",
          borderStyle: "solid",
        }}
        role="status"
        aria-label="Loading"
      />
    );
  }

  const delays = animationDelayMap[variant];

  return (
    <div className="flex flex-row gap-1 m-4">
      {delays.map((delay, i) => (
        <div
          key={i}
          className={`${color} rounded-full animate__animated animate__infinite animate__${variant}`}
          style={{ width: size, height: size, animationDelay: delay }}
        />
      ))}
    </div>
  );
};

export default Loader;