export interface ActionPickerProps {
  value?: Record<string, any>;
  onChange: (action: Record<string, any>) => void;
}