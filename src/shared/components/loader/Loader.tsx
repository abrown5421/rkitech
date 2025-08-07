import React from 'react';
import { animationDelayMap } from './loaderConstants';
import type { LoaderProps } from './loaderTypes';
import { tailwindToHex } from '../../utils/tailwindToHex';

const Loader: React.FC<LoaderProps> = ({
  variant = "flash",
  color = "bg-gray-300",
  size = 16,
}) => {
  if (variant === "spinner") {
    const spinnerSize = size * 1.5;
    const colorRegex = /^(?:bg|text)-([a-z]+)-(\d{3})$/i;
    let strokeColor = '#6b7280';
  
    if (color) {
      const match = color.match(colorRegex);
      if (match) {
        const [, colorName, intensityStr] = match;
        const intensity = parseInt(intensityStr, 10);
        strokeColor = tailwindToHex(colorName, intensity);
      }
    }

    return (
      <div
        className={`border-4 rounded-full animate-spin`}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderTopColor: 'rgba(255, 255, 255, 0.0)', 
          borderRightColor: strokeColor,
          borderBottomColor: strokeColor,
          borderLeftColor: strokeColor,
          borderStyle: 'solid',
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