import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import clsx from 'clsx';
import { getAnimationClasses } from '../../../client/utils/useAnimation';
import type { IconProps } from './iconTypes';
import { tailwindToHex } from '../../utils/tailwindToHex';

const Icon: React.FC<IconProps> = ({
  name,
  color,       
  animation,
  TwClassName,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const ImportedIcon = LucideIcons[name] as React.FC<LucideProps> | undefined;

  if (!ImportedIcon) {
    console.warn(`Lucide icon "${name}" not found.`);
    return null;
  }

  const colorRegex = /^text-([a-z]+)-(\d{3})$/i;
  let strokeColor = undefined;

  if (color) {
    const match = color.match(colorRegex);
    if (match) {
      const [, colorName, intensityStr] = match;
      const intensity = parseInt(intensityStr, 10);
      strokeColor = tailwindToHex(colorName, intensity);
    }
  }

  const animationClasses = getAnimationClasses(animation, isHovered);

  const classes = clsx(animationClasses, TwClassName);

  return (
    <div
      onClick={onClick}
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pass stroke color as prop */}
      <ImportedIcon stroke={strokeColor} />
    </div>
  );
};

export default Icon;
