import type { ReactNode } from "react";
import type { Margin, Padding } from "../../types/spacingTypes";
import type { SizeValue } from "../../types/sizeTypes";

export type AnimationObject = {
  entranceAnimation: string;
  exitAnimation: string;
  isEntering: boolean;
};

export type ContainerBorder = 'none' | 'default' | 'thick' | 'dashed';
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
export type JustifyContent = 'start'| 'center'| 'end'| 'between'| 'around'| 'evenly';
export type AlignItems = 'start'| 'center'| 'end'| 'stretch'| 'baseline';

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
  width?: SizeValue;
  height?: SizeValue;
}
