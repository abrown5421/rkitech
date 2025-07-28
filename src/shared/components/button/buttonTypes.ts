import type { ReactNode } from "react";
import type { AnimationProps } from "../../types/animationTypes";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  animation?: AnimationProps;
  TwClassName?: string;
  cursor?: string;
  style?: React.CSSProperties;
}