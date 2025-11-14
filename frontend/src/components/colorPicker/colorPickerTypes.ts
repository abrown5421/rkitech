import type { SxProps } from "@mui/material";

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  sx?: SxProps,
  inputSx?: SxProps
}
