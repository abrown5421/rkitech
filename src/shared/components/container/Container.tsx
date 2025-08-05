import React, { useState } from 'react';
import clsx from 'clsx';
import type { ContainerProps } from './containerTypes';
import { getAnimationClasses } from '../../utils/useAnimation';

const Container: React.FC<ContainerProps> = ({
  children,
  onClick,
  animation,
  TwClassName,
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default Container;
