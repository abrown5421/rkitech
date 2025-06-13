export interface ImageProps {
  src: string;
  alt: string;
  width?: number | '100%';
  height?: number | '100%';
}

export interface ImageComponentProps {
  props: ImageProps;
  twClasses?: string[];
}