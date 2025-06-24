export interface CheckboxFieldProps {
  label?: string;
  name?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  helperText?: string;
  twClasses?: string[];
}
