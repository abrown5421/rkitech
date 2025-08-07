import type { AnimationProps } from "../../types/animationTypes";
import * as LucideIcons from 'lucide-react';

export type IconProps = {
  name: keyof typeof LucideIcons;
  color?: string; 
  animation?: AnimationProps;
  TwClassName?: string;
  onClick?: () => void;
};