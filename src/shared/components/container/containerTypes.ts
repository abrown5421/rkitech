import type { ReactNode } from "react";
import type { Margin, Padding } from "../../types/spacingTypes";

export type AnimationObject = {
  entranceAnimation: string;
  exitAnimation: string;
  isEntering: boolean;
};

export type ContainerBorder = 'none' | 'default' | 'thick' | 'dashed';
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
export type JustifyContent = 'start'| 'center'| 'end'| 'between'| 'around'| 'evenly';
export type AlignItems = 'start'| 'center'| 'end'| 'stretch'| 'baseline';
export type ContainerWidth = 'w-auto'| 'w-full'| 'w-screen'| 'w-min'| 'w-max'| 'fit'| 'w-1/2'| 'w-1/3'| 'w-2/3'| 'w-1/4'| 'w-3/4'| 'w-1/5'| 'w-4/5';
export type ContainerHeight = 'h-auto'| 'h-full'| 'h-screen'| 'h-min'| 'h-max'| 'h-fit'| 'h-1/2'| 'h-1/3'| 'h-2/3'| 'h-1/4'| 'h-3/4'| 'h-1/5'| 'h-4/5';

export interface ContainerProps {
  children: ReactNode;
  padding?: Padding;
  margin?: Margin;
  border?: ContainerBorder;
  rounded?: boolean;
  shadow?: boolean;
  animationObject?: AnimationObject;
  className?: string;
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  width?: ContainerWidth;
  height?: ContainerHeight;
}
