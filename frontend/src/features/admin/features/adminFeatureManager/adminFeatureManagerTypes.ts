export type FieldType = 
  | 'text' 
  | 'number' 
  | 'boolean' 
  | 'date'
  | 'select'
  | 'color'
  | 'colorObject'
  | 'nested';

export interface FieldDescriptor {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[]; 
  nestedFields?: FieldDescriptor[];
  placeholder?: string;
  helperText?: string;
  validation?: (value: any) => string | null; 
  hidden?: boolean;
  disabled?: boolean;
}

export interface FormSchema<TItem = any> {
  fields: FieldDescriptor[];
  initialValues?: Partial<TItem>;
  onSubmit: (values: TItem) => Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export interface AdminFeatureManagerProps<TItem = any> {
  editorName?: string;
  editorItems?: TItem[];
  renderItem?: (item: TItem, index: number) => React.ReactNode;
  onRead?: (item: TItem) => void;
  onUpdate?: (item: TItem) => void;
  onDelete?: (item: TItem) => void;
  onCreate?: () => void;
  permissionsKey?: keyof TItem;
  formSchema?: FormSchema<TItem>;
  getItemById?: (id: string) => TItem | undefined;
  createMutation?: (data: Partial<TItem>) => Promise<any>;
  updateMutation?: (id: string, data: Partial<TItem>) => Promise<any>;
}
export interface CrudControlsProps<TItem> {
  item: TItem;
  permissions?: { read?: boolean; update?: boolean; delete?: boolean };
  onRead?: (item: TItem) => void;
  onUpdate?: (item: TItem) => void;
  onDelete?: (item: TItem) => void;
}

