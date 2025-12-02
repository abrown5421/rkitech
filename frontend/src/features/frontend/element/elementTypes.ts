export interface IElement {
  _id?: string;
  name?: string;
  component: string;
  props: Record<string, any>;
  childText?: string; 
  styles?: Record<string, any>;
  sx?: Record<string, any>;
  className?: string;
  children?: IElement[];
  createdAt?: Date;
  updatedAt?: Date;
}
