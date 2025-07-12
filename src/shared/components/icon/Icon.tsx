import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';
import type { LucideProps } from 'lucide-react';
import type { AnimationProps } from '../../types/animationTypes';
import { getAnimationClasses } from '../../utils/useAnimation';
import { paddingMap, marginMap } from '../../constants/spacingConstants';
import { resolveDimension } from '../../constants/sizeConstants';

export type IconProps = {
  name: keyof typeof LucideIcons;
  color?: string;
  padding?: keyof typeof paddingMap;
  margin?: keyof typeof marginMap;
  width?: string | number;
  height?: string | number;
  animation?: AnimationProps;
  className?: string;
  onClick?: () => void;
};

const Icon: React.FC<IconProps> = ({
  name,
  color = 'text-gray-900',
  padding = 'none',
  margin = 'none',
  width,
  height,
  animation,
  className,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const ImportedIcon = LucideIcons[name] as React.FC<LucideProps> | undefined;

  if (!ImportedIcon) {
    console.warn(`Lucide icon "${name}" not found.`);
    return null;
  }

  const animationClasses = getAnimationClasses(animation, isHovered);
  const resolvedWidth = resolveDimension(width, 'width');
  const resolvedHeight = resolveDimension(height, 'height');

  const tailwindWidthClass = typeof resolvedWidth === 'string' ? resolvedWidth : '';
  const tailwindHeightClass = typeof resolvedHeight === 'string' ? resolvedHeight : '';

  const inlineStyle = {
    ...(typeof resolvedWidth === 'object' ? resolvedWidth : {}),
    ...(typeof resolvedHeight === 'object' ? resolvedHeight : {}),
  };

  const classes = clsx(
    color,
    paddingMap[padding],
    marginMap[margin],
    tailwindWidthClass,
    tailwindHeightClass,
    animationClasses,
    className
  );

  return (
    <div
      onClick={onClick}
      className={classes}
      style={inlineStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImportedIcon />
    </div>
  );
};

export default Icon;
