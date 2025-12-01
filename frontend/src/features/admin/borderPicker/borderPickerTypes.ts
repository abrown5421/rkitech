export interface BorderPickerProps {
  value: {
    width: number;
    style: string;
    color: string;
  };
  onChange: (val: { width: number; style: string; color: string }) => void;
}