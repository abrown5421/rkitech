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
  | 'rotate'
  | 'scale'
  | 'sync';

export type TailwindColor =
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';

export type TailwindIntensity =
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export interface LoaderProps {
  twClasses?: string[];
  variant?: LoaderVariant;
  colorName?: TailwindColor;
  colorIntensity?: TailwindIntensity;
  size?: number;
}