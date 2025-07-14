import type { ReactNode, SelectHTMLAttributes } from "react";
import type { AnimationProps } from "../../types/animationTypes";
import type { Margin, Padding } from "../../types/spacingTypes";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  animation?: AnimationProps;
  className?: string;
  padding?: Padding;
  margin?: Margin;
  label?: string;
  error?: boolean;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  children?: ReactNode;
}
