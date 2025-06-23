
export interface MarginPickerProps {
  defaultValues?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  onChange?: (className: string) => void;
}