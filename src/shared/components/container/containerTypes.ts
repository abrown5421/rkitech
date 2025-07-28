import type { ReactNode } from "react";
import type { AnimationProps } from "../../types/animationTypes";

export type ContainerBorder = 'none' | 'default' | 'thick' | 'dashed';
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
export type JustifyContent = 'start'| 'center'| 'end'| 'between'| 'around'| 'evenly';
export type AlignItems = 'start'| 'center'| 'end'| 'stretch'| 'baseline';

export interface ContainerProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  animation?: AnimationProps;
  TwClassName?: string;
}
