export interface ElementDoc {
  _id: string;
  component: string;
  props: Record<string, any>;
  childText?: string;
  children?: ElementDoc[];
}

export interface RendererProps {
  element: ElementDoc;
}