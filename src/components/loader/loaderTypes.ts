import type { TailwindColor, TailwindIntensity } from "../../utils/tailwindToHex/tailwindToHexTypes";


export type LoaderVariant =
  | 'clip'
  | 'circle'
  | 'pulse'
  | 'beat'
  | 'bar'
  | 'bounce'
  | 'dot'
  | 'grid'
  | 'hash'
  | 'moon'
  | 'pacman'
  | 'puff'
  | 'ring'
  | 'rotate'
  | 'scale'
  | 'sync';

export interface LoaderProps {
  twClasses?: string[];
  variant?: LoaderVariant;
  colorName?: TailwindColor;
  colorIntensity?: TailwindIntensity;
  size?: number;
}