import type { ReactNode, MouseEvent } from "react";
import type { AnimationProps } from "../../types/animationTypes";

export interface ButtonProps {
  children: ReactNode;
  onClick?: (() => void) | ((event: MouseEvent<HTMLButtonElement>) => void);
  disabled?: boolean;
  animation?: AnimationProps;
  TwClassName?: string;
  cursor?: string;
  style?: React.CSSProperties;
}