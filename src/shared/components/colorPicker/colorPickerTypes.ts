export type TailwindColor =
  | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald"
  | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple"
  | "fuchsia" | "pink" | "rose" | "slate" | "gray" | "zinc" | "neutral" | "stone";

export type TailwindIntensity =
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export interface ColorPickerProps {
  defaultColor?: TailwindColor;
  defaultIntensity?: TailwindIntensity;
  defaultOpacity?: number;
  base?: string;
  onChange?: (className: string) => void;
  label?: string;
  helperText?: string;
  TwClassName?: string;
}