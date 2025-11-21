import type { SxProps, TextFieldProps } from "@mui/material";

export interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  inputProps: TextFieldProps;
  containerSx?: SxProps;
}
