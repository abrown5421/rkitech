import type { ReactNode, SelectHTMLAttributes } from "react";
import type { AnimationProps } from "../../types/animationTypes";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  animation?: AnimationProps;
  TwClassName?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  children?: ReactNode;
  creatable?: boolean,
}
