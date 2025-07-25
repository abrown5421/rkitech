import type { ReactNode } from "react";
import type { Padding, Margin } from "../../types/spacingTypes";
import type { SizeValue } from "../../types/sizeTypes";
import type { AnimationProps } from "../../types/animationTypes";

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'black';
export type RoundedSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  color?: ButtonColor;
  customColorClasses?: {
    bg?: string;
    text?: string;
    border?: string;
    hoverBg?: string;
    hoverText?: string;
    hoverBorder?: string;
  };
  padding?: Padding;
  margin?: Margin;
  rounded?: boolean | RoundedSize;
  shadow?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  animation?: AnimationProps;
  className?: string;
  width?: SizeValue;
  height?: SizeValue;
  cursor?: string;
}