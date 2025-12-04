export type DimensionPickerProps = {
  value: { width: string; height: string };
  onChange: (val: { width: string; height: string }) => void;
  labelWidth?: string;
  labelHeight?: string;
};