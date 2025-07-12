import React from 'react';
import clsx from 'clsx';
import type {
  TextProps,
  TextSize,
  TextWeight,
  TextItalic,
  TextUnderline,
  TextFont,
} from './textTypes';

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

const weightMap: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const italicMap: Record<TextItalic, string> = {
  italic: 'italic',
  notitalic: 'not-italic',
};

const underlineMap: Record<TextUnderline, string> = {
  underlined: 'underline',
  notunderlined: 'no-underline',
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
  weight = 'normal',
  italic = 'notitalic',
  underline = 'notunderlined',
  font = 'sans',
  color = 'text-gray-900',
  className = '',
}) => {
  const classes = clsx(
    sizeMap[size],
    weightMap[weight],
    italicMap[italic],
    underlineMap[underline],
    fontMap[font],
    color,
    className
  );

  return <div className={classes}>{text}</div>;
};

export default Text;
