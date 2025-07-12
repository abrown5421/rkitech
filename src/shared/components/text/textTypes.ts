import type { AnimationProps } from "../../types/animationTypes";
import type { Margin, Padding } from "../../types/spacingTypes";

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x';
export type TextFont = 'primary' | 'secondary' | 'sans' | 'serif' | 'mono';

export interface TextProps {
  text: string;
  size?: TextSize;
  bold?: boolean;    
  italic?: boolean;
  underline?: boolean;
  font?: TextFont;
  color?: string;
  animation?: AnimationProps;
  className?: string;
  padding?: Padding;
  margin?: Margin;
}
