import type { AnimationProps } from "../../types/animationTypes";
import type { Margin, Padding } from "../../types/spacingTypes";

export type ObjectFit =
  | "cover"
  | "contain"
  | "fill"
  | "none"
  | "scale-down";

export interface ImageProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  objectFit?: ObjectFit;
  animation?: AnimationProps;
  className?: string;
  padding?: Padding;
  margin?: Margin;
}