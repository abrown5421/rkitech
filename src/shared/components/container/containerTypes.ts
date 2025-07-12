import type { ReactNode } from "react";

export type AnimationObject = {
  entranceAnimation: string;
  exitAnimation: string;
  isEntering: boolean;
};

export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerMargin = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerBorder = 'none' | 'default' | 'thick' | 'dashed';

export interface ContainerProps {
  children: ReactNode;
  padding?: ContainerPadding;
  margin?: ContainerMargin;
  border?: ContainerBorder;
  rounded?: boolean;
  shadow?: boolean;
  animationObject?: AnimationObject;
  className?: string;
}
