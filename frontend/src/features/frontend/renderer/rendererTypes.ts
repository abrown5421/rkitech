export interface ElementDoc {
  _id: string;
  component: string;
  props: {
    [key: string]: any;
    states?: {
      hover?: Record<string, any>;
      active?: Record<string, any>;
      focus?: Record<string, any>;
    };
    responsive?: {
      mobile?: Record<string, any>;
      tablet?: Record<string, any>;
      desktop?: Record<string, any>;
    };
  };
  childText?: string;
  children?: (string | ElementDoc)[]; 
  parentId?: string | null;
  droppable: boolean;
}

export interface RendererProps {
  element: ElementDoc;
  editMode?: boolean;
  parentId?: string;
}

export interface EditorState {
  originalElement: ElementDoc | null;
  draftElement: ElementDoc | null;
  pendingChanges: Record<string, ElementDoc>;
  pendingCreates: Record<string, ElementDoc>;
  pendingDeletes: string[];
  isDirty: boolean;
  hover: boolean;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}