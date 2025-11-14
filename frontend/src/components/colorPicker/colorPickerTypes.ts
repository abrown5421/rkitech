import type { SxProps, TextFieldProps } from "@mui/material";

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  inputProps: TextFieldProps;
  containerSx?: SxProps
}
