export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextItalic = 'italic' | 'notitalic';
export type TextUnderline = 'underlined' | 'notunderlined';
export type TextFont = 'sans' | 'serif' | 'mono';

export interface TextProps {
  text: string;
  size: TextSize;
  weight?: TextWeight;
  italic?: TextItalic;
  underline?: TextUnderline;
  font?: TextFont;
  color?: string;
  className?: string;
}