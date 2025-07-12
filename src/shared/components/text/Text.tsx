import React, { useState } from 'react';
import clsx from 'clsx';
import type { TextProps } from './textTypes';
import { fontMap, sizeMap } from './textConstants';
import { marginMap, paddingMap } from '../../constants/spacingConstants';
import { getAnimationClasses } from '../../utils/useAnimation';

const Text: React.FC<TextProps> = ({
  text,
  size = 'md',
  bold = false,
  italic = false,
  underline = false,
  font = 'sans',
  color = 'text-gray-900',
  padding = 'none',
  margin = 'none',
  animation,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);
  
  const classes = clsx(
    sizeMap[size],
    bold && 'font-bold',
    italic && 'italic',
    underline && 'underline',
    fontMap[font],
    color,
    animationClasses,
    paddingMap[padding],
    marginMap[margin],
    className
  );

  return (
    <div 
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </div>
  );
};

export default Text;
