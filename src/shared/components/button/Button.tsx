import React, { useState } from 'react';
import clsx from 'clsx';
import type { ButtonProps } from './buttonTypes';
import { colorStyles, variantBaseMap } from './buttonConstants';
import { paddingMap, marginMap } from '../../constants/spacingConstants';
import { resolveDimension } from '../../constants/sizeConstants';
import { getAnimationClasses } from '../../utils/useAnimation';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  cursor,
  variant = 'solid',
  color = 'primary',
  padding = 'md',
  margin = 'none',
  rounded = true,
  shadow = false,
  disabled = false,
  fullWidth = false,
  animation,
  className,
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
  
  const variantBase = variantBaseMap[variant];

  const colorStyle = colorStyles[variant][color];

  const classes = clsx(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    variantBase,
    colorStyle.bg,
    colorStyle.border,
    colorStyle.text,
    colorStyle.hoverBg,
    colorStyle.hoverText,
    colorStyle.hoverBorder,
    paddingMap[padding],
    marginMap[margin],
    rounded && 'rounded-xl',
    shadow && 'shadow-md',
    fullWidth && 'w-full',
    tailwindWidthClass,
    tailwindHeightClass,
    animationClasses,
    !disabled && `cursor-${cursor || 'pointer'}`, 
    disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
    className
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      style={inlineStyle}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
