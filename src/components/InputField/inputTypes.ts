export interface InputFieldProps {
  label?: string;
  name?: string;
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  helperText?: string;
  disabled?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'unstyled';
  twClasses?: string[];
  inputClasses?: string[];
}
