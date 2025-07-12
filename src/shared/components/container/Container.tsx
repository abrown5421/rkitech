import React, { useState } from 'react';
import clsx from 'clsx';
import type { ContainerProps } from './containerTypes';
import { alignItemsMap, flexDirectionMap, justifyContentMap } from '../../constants/flexConstants';
import { marginMap, paddingMap } from '../../constants/spacingConstants';
import { borderMap } from '../../constants/borderConstants';
import { resolveDimension } from '../../constants/sizeConstants';
import { getAnimationClasses } from '../../utils/useAnimation';

const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'none',
  margin = 'none',
  border = 'none',
  rounded = false,
  shadow = false,
  className,
  flexDirection = 'row',
  justifyContent = 'start',
  alignItems = 'stretch',
  animation,
  width,
  height,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
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
    'flex',
    flexDirectionMap[flexDirection],
    justifyContentMap[justifyContent],
    alignItemsMap[alignItems],
    paddingMap[padding],
    marginMap[margin],
    borderMap[border],
    rounded && 'rounded-xl',
    shadow && 'shadow-lg',
    tailwindWidthClass,
    tailwindHeightClass,
    animationClasses,
    className
  );

  return (
    <div 
      className={classes} 
      style={inlineStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default Container;
