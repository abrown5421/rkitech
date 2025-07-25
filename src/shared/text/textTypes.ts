import type { AnimationConfig } from "../types/animationTypes";

export interface TextProps {
  text: string;
  twClasses?: string | string[];
  animation?: AnimationConfig;
}