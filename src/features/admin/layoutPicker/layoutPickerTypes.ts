export interface LayoutPickerProps {
  flexDirection?: "row" | "column";
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  onChange: (val: {
    flexDirection?: "row" | "column";
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
  }) => void;
}