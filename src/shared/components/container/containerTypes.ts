import type { ReactNode } from "react";

export type AnimationObject = {
  entranceAnimation: string;
  exitAnimation: string;
  isEntering: boolean;
};

export type ContainerProps = {
  children: ReactNode;
  className?: string;
  animationObject?: AnimationObject;
};
