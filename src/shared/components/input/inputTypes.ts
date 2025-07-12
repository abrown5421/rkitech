import type { AnimationProps } from "../../types/animationTypes";
import type { Margin, Padding } from "../../types/spacingTypes";
import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  animation?: AnimationProps;
  className?: string;
  padding?: Padding;
  margin?: Margin;
  label?: string;
  error?: boolean;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}
