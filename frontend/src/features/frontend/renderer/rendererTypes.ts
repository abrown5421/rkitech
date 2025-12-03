export interface ElementDoc {
  _id: string;
  component: string;
  props: Record<string, any>;
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
}