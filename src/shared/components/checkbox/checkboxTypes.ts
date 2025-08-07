import type { AnimationProps } from "../../types/animationTypes";
import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  animation?: AnimationProps;
  TwClassName?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
}