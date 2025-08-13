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
  hovered, 
  onHoverChange,
}) => {
  const [internalHovered, setInternalHovered] = useState(false);
  const isControlled = hovered !== undefined;
  const isHovered = isControlled ? hovered : internalHovered;

  const animationClasses = getAnimationClasses(animation, isHovered);
  const classString = Array.isArray(TwClassName) ? TwClassName.join(' ') : TwClassName || '';

  const classes = clsx(
    'flex',
    classString,
    animationClasses
  );

  const handleMouseEnter = () => {
    if (!isControlled) setInternalHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    if (!isControlled) setInternalHovered(false);
    onHoverChange?.(false);
  };

  return (
    <div
      className={classes}
      onClick={onClick}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Container;
