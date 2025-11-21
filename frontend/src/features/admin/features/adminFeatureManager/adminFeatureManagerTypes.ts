import type { FieldConfig } from "../../../dynamicForm/dynamicFormTypes";

export interface AdminFeatureManagerProps<TItem = any> {
  editorName?: string;
  editorBody?: string;
  editorItems?: TItem[];
  orientation?: 'row' | 'column'
  renderItem?: (item: TItem, index: number, openForm?: (item?: TItem) => void) => React.ReactNode;
  onSpecialAction?: (item: TItem) => void;
  onRead?: (item: TItem) => void;
  onUpdate?: (item: TItem) => void;
  onDelete?: (item: TItem) => void;
  onCreate?: () => void;
  formConfig?: {
    fields: FieldConfig[];
    getInitialValues?: (item?: TItem) => Record<string, any>;
    onSubmit?: (values: Record<string, any>, item?: TItem) => void | Promise<void>;
    validate?: (values: Record<string, any>) => Record<string, string> | null;
  };
}

export interface CrudControlsProps<TItem> {
  item: TItem;
  permissions?: { read?: boolean; update?: boolean; delete?: boolean; onSpecialAction?: boolean };
  specialAction?: {
    title: string;
    icon: React.ReactNode;
    color?: string;
  };
  onSpecialAction?: (item: TItem) => void;
  onRead?: (item: TItem) => void;
  onUpdate?: (item: TItem) => void;
  onDelete?: (item: TItem) => void;
}