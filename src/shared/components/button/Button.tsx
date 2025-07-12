import React from 'react';
import clsx from 'clsx';
import type { ButtonProps } from './buttonTypes';
import { variantMap, colorMap } from './buttonConstants';
import { paddingMap, marginMap } from '../../constants/spacingConstants';
import { resolveDimension } from '../../constants/sizeConstants';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'solid',
  color = 'primary',
  padding = 'md',
  margin = 'none',
  rounded = true,
  shadow = false,
  disabled = false,
  fullWidth = false,
  animationObject,
  className,
  width,
  height,
}) => {
  const animationClasses = animationObject
    ? clsx(
        'animate__animated',
        animationObject.isEntering
          ? animationObject.entranceAnimation
          : animationObject.exitAnimation
      )
    : '';

  const resolvedWidth = resolveDimension(width, 'width');
  const resolvedHeight = resolveDimension(height, 'height');

  const tailwindWidthClass = typeof resolvedWidth === 'string' ? resolvedWidth : '';
  const tailwindHeightClass = typeof resolvedHeight === 'string' ? resolvedHeight : '';

  const inlineStyle = {
    ...(typeof resolvedWidth === 'object' ? resolvedWidth : {}),
    ...(typeof resolvedHeight === 'object' ? resolvedHeight : {}),
  };

  const classes = clsx(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    variantMap[variant],
    colorMap[color],
    paddingMap[padding],
    marginMap[margin],
    rounded && 'rounded-xl',
    shadow && 'shadow-md',
    fullWidth && 'w-full',
    tailwindWidthClass,
    tailwindHeightClass,
    animationClasses,
    className,
    disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      style={inlineStyle}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
