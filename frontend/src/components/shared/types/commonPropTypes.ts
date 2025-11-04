export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'base-100'
  | 'base-200'
  | 'base-300'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type TailwindColorName =
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple'
  | 'fuchsia' | 'pink' | 'rose';

export type TailwindIntensity =
  | '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type TailwindColor = `${TailwindColorName}-${TailwindIntensity}`;

export interface BorderObject {
    width: number;
    color: TailwindColor | ThemeColor
    style: "solid" | "dashed" | "dotted" | "double"
}

export type TextStyle = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type SpacingSize =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64';

export interface SpacingProps {
  m?: SpacingSize;       
  mt?: SpacingSize;
  mr?: SpacingSize;
  mb?: SpacingSize;
  ml?: SpacingSize;
  mx?: SpacingSize;
  my?: SpacingSize;
  p?: SpacingSize;     
  pt?: SpacingSize;
  pr?: SpacingSize;
  pb?: SpacingSize;
  pl?: SpacingSize;
  px?: SpacingSize;
  py?: SpacingSize;
}