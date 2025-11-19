export interface AdminFeatureManagerProps<TItem = any> {
  editorName?: string;
  editorItems?: TItem[];
  orientation?: 'row' | 'column'
  renderItem?: (item: TItem, index: number) => React.ReactNode;
  onSpecialAction?: (item: TItem) => void;
  onRead?: (item: TItem) => void;
  onUpdate?: (item: TItem) => void;
  onDelete?: (item: TItem) => void;
  onCreate?: () => void;
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

