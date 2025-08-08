import React, { useState } from 'react';
import clsx from 'clsx';
import type { ContainerProps } from './containerTypes';
import { getAnimationClasses } from '../../../client/utils/useAnimation';

const Container: React.FC<ContainerProps> = ({
  children,
  onClick,
  animation,
  TwClassName,
  style,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';
  
  const classes = clsx(
    'flex',
    classString,
    animationClasses,
  );

  return (
    <div 
      className={classes} 
      onClick={onClick}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default Container;
