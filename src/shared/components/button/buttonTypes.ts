import type { ReactNode } from "react";
import type { Padding, Margin } from "../../types/spacingTypes";
import type { SizeValue } from "../../types/sizeTypes";
import type { AnimationProps } from "../../types/animationTypes";

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  color?: ButtonColor;
  padding?: Padding;
  margin?: Margin;
  rounded?: boolean;
  shadow?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  animation?: AnimationProps;
  className?: string;
  width?: SizeValue;
  height?: SizeValue;
  cursor?: string; 
}
