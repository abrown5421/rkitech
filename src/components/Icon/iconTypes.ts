import * as Icons from 'lucide-react';
import type { TailwindColor, TailwindIntensity } from "../../utils/tailwindToHex/tailwindToHexTypes";
import type { LucideProps } from 'lucide-react';

export type IconComponent = React.FC<LucideProps>;

export type IconName = {
  [K in keyof typeof Icons]: typeof Icons[K] extends IconComponent ? K : never;
}[keyof typeof Icons];

export interface IconProps {
  name: IconName;
  size?: number;
  colorName?: TailwindColor;
  colorIntensity?: TailwindIntensity;
}