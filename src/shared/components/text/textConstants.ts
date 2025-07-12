import type { TextFont, TextSize } from "./textTypes";

export const sizeMap: Record<TextSize, string> = {
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

export const fontMap: Record<TextFont, string> = {
  primary: 'font-primary',
  secondary: 'font-secondary',
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};