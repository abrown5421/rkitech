import type { SxProps } from "@mui/material";

export type FontType =
  | "PrimaryFont"
  | "SecondaryFont"
  | "Arial"
  | "Verdana"
  | "Tahoma"
  | "Trebuchet MS"
  | "Times New Roman"
  | "Georgia"
  | "Garamond"
  | "Courier New"
  | "Brush Script MT";

export interface FontPickerProps {
  font: FontType;
  onChange: (font: FontType) => void;
  label?: string;
  sx?: SxProps;
  inputSx?: SxProps;
}
