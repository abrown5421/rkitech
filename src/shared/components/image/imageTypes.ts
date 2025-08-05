import type { AnimationProps } from "../../types/animationTypes";

export interface ImageProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  animation?: AnimationProps;
  TwClassName?: string;
}