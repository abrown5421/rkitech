export interface BorderPickerProps {
  defaultWidthIndex?: number;
  defaultStyle?: string;
  defaultColorClass?: string;
  onChange?: (className: string) => void;
  label?: string;
}
