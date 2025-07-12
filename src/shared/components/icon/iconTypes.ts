import type { marginMap, paddingMap } from "../../constants/spacingConstants";
import type { AnimationProps } from "../../types/animationTypes";
import * as LucideIcons from 'lucide-react';

export type IconProps = {
  name: keyof typeof LucideIcons;
  color?: string;
  padding?: keyof typeof paddingMap;
  margin?: keyof typeof marginMap;
  width?: string | number;
  cursor?: string; 
  height?: string | number;
  animation?: AnimationProps;
  className?: string;
  onClick?: () => void;
};