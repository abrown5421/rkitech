import type { ReactNode } from "react";
import type { AnimationObject } from "../shared/types/animationTypes";

export interface PodProps {
  children: ReactNode;
  className?: string;
  animationObject?: AnimationObject;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}