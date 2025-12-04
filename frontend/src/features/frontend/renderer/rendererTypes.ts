export interface ElementDoc {
  _id: string;
  component: string;
  props: {
    [key: string]: any;
    states?: {
      hover?: Record<string, any>;
      active?: Record<string, any>;
      focus?: Record<string, any>;
    }
  };
  childText?: string;
  children?: ElementDoc[];
}

export interface RendererProps {
  element: ElementDoc;
  editMode?: boolean;
}

export interface EditorState {
  originalElement: ElementDoc | null;
  draftElement: ElementDoc | null;
  isDirty: boolean;
  hover: boolean;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}