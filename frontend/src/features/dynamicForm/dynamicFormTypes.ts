import type { SxProps } from "@mui/material";
import type { EntranceAnimation, ExitAnimation } from "../../components/animBox/animBoxTypes";

export interface DynamicFormProps {
    open: boolean;
    screenPercentage: number,
    title: string; 
    entrance?: EntranceAnimation;
    exit?: ExitAnimation;
    backgroundColor: string; 
    isClosing?: boolean; 
    formFields: FieldConfig[];
    formID?: string;
    mode?: 'create' | 'update';
    editingItem?: any;
}

export type FieldType =
  | 'text'
  | 'number'
  | 'password'
  | 'email'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'date'
  | 'textarea'
  | 'switch'
  | 'color'
  | 'font'
  | 'animation'
  | 'group'
  | 'row'
  | 'column';

export interface FieldOption {
  label: string;
  value: string | number;
}

export type FormMode = 'create' | 'update';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  helperText?: string;
  options?: FieldOption[];
  defaultValue?: any;
  inputProps?: any;
  containerSx?: SxProps;  
  children?: FieldConfig[];
  direction?: 'row' | 'column';
  gap?: number | string;
}

export type SubmitCallback = (
  values: Record<string, any>, 
  mode: FormMode,
  item?: any
) => void | Promise<void>;

export type ValidateCallback = (values: Record<string, any>) => Record<string, string> | null;

export interface FormRegistryEntry {
  onSubmit?: SubmitCallback;
  validate?: ValidateCallback;
  mode?: FormMode;
  item?: any;
}