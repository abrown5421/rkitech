import type { ReactNode } from "react";
import type { AnimationObject } from "../shared/types/animationTypes";

export type AvatarShape = "circle" | "square";

export interface AvatarProps {
  src?: string; 
  alt?: string;
  sizeClass?: string;
  shape?: AvatarShape; 
  placeholder?: ReactNode;
  showIndicator?: boolean;
  indicatorClass?: string;
  borderClass?: string;
  bgColorClass?: string;
  textColorClass?: string;
  className?: string;
  animationObject?: AnimationObject;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface AvatarGroupProps {
  avatars: AvatarProps[];
  maxDisplay?: number; 
  counterClass?: string;
  sizeClass?: string; 
  spacingClass?: string;
  className?: string;
  animationObject?: AnimationObject;
  style?: React.CSSProperties;
}