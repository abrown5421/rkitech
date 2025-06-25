export interface SelectFieldOption {
    label: string;
    value: string | number;
  }
  
  export interface SelectFieldProps {
    label?: string;
    name?: string;
    value?: string | readonly string[];
    defaultValue?: string | readonly string[];
    onChange?: (value: string | string[]) => void;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    errorText?: string;
    helperText?: string;
    disabled?: boolean;
    multiple?: boolean;
    options: SelectFieldOption[];
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'outline' | 'filled' | 'unstyled';
    twClasses?: string[];
    selectClasses?: string[];
  }