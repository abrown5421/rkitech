import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import clsx from 'clsx';
import { getAnimationClasses } from '../../utils/useAnimation';
import { paddingMap, marginMap } from '../../constants/spacingConstants';
import { resolveDimension } from '../../constants/sizeConstants';
import type { IconProps } from './iconTypes';

const Icon: React.FC<IconProps> = ({
  name,
  cursor,
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

  useEffect(()=>{console.log(resolvedWidth, resolvedHeight)}, [resolvedWidth, resolvedHeight])
  
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
    `cursor-${cursor || 'pointer'}`,
    className
  );

  return (
    <div
      onClick={onClick}
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ImportedIcon style={inlineStyle}/>
    </div>
  );
};

export default Icon;
