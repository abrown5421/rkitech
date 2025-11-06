export interface IElements {
  _id?: string;
  type: string;
  data: Record<string, any>; 
  styles?: Record<string, any>;
  sx?: Record<string, any>; 
  className?: string;
  props?: Record<string, any>;
  children?: string[];
  parentId?: string;
  order?: number;
  pageId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ElementMapperProps {
  element: IElements;
  children?: React.ReactNode;
}

export interface ElementNodeProps {
  elementId: string;
  onError?: (error: any) => void;
}

export interface ElementWithChildrenProps {
  element: IElements;
  onError?: (error: any) => void;
}