export interface SpacingPickerProps {
  margin: string; 
  padding: string;
  onChange: (val: { margin: string; padding: string }) => void;
}
