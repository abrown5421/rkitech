import React from 'react';
import clsx from 'clsx';
import type { TextProps, TextSize, TextFont } from './textTypes';

const sizeMap: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2x': 'text-2xl',
  '3x': 'text-3xl',
  '4x': 'text-4xl',
  '5x': 'text-5xl',
  '6x': 'text-6xl',
  '7x': 'text-7xl',
  '8x': 'text-8xl',
  '9x': 'text-9xl',
};

const fontMap: Record<TextFont, string> = {
  primary: 'font-primary',
  secondary: 'font-secondary',
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

const Text: React.FC<TextProps> = ({
  text,
  size,
  bold = false,
  italic = false,
  underline = false,
  font = 'sans',
  color = 'text-gray-900',
  className = '',
}) => {
  const classes = clsx(
    sizeMap[size],
    bold && 'font-bold',
    italic && 'italic',
    underline && 'underline',
    fontMap[font],
    color,
    className
  );

  return <div className={classes}>{text}</div>;
};

export default Text;
