import React, { useState } from 'react';
import clsx from 'clsx';
import type { ButtonProps } from './buttonTypes';
import { getAnimationClasses } from '../../../client/utils/useAnimation';

const Button: React.FC<ButtonProps & { buttonText?: string }> = ({
  children,
  onClick,
  cursor,
  disabled = false,
  animation,
  TwClassName,
  style,
  buttonText,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const animationClasses = getAnimationClasses(animation, isHovered);

  const classes = clsx(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    animationClasses,
    !disabled && `cursor-${cursor || 'pointer'}`,
    disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
    TwClassName
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      style={style}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {buttonText || children}
    </button>
  );
};

export default Button;
