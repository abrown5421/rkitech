import type { ReactNode } from "react";
import type { AnimationObject } from "../shared/types/animationTypes";
import type { BorderObject, SpacingProps, TailwindColor, TextStyle, ThemeColor } from "../shared/types/commonPropTypes";

export interface PodProps extends SpacingProps {
  textColor?: ThemeColor | TailwindColor;
  bgColor?: ThemeColor | TailwindColor;
  border?: BorderObject;
  textStyle?: TextStyle;
  children: ReactNode;
  className?: string;
  animationObject?: AnimationObject;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}