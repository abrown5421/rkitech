import type { SxProps } from "@mui/material";

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  sx: SxProps,
  inputSx: SxProps
}
