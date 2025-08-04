import type { AnimationProps } from "../../types/animationTypes";
import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  animation?: AnimationProps;
  TwClassName?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  multiline?: boolean;
  rows?: number | 'fill';
}
