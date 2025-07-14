import type { ReactNode } from "react";
import type { Margin, Padding } from "../../types/spacingTypes";
import type { SizeValue } from "../../types/sizeTypes";
import type { AnimationProps } from "../../types/animationTypes";

export type ContainerBorder = 'none' | 'default' | 'thick' | 'dashed';
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
export type JustifyContent = 'start'| 'center'| 'end'| 'between'| 'around'| 'evenly';
export type AlignItems = 'start'| 'center'| 'end'| 'stretch'| 'baseline';

export interface ContainerProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  padding?: Padding;
  margin?: Margin;
  border?: ContainerBorder;
  rounded?: boolean;
  shadow?: boolean;
  animation?: AnimationProps;
  className?: string;
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  width?: SizeValue;
  height?: SizeValue;
}
