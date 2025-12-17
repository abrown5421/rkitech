import { Document } from 'mongoose';

export interface IElements extends Document {
  name?: string;
  component: string;
  props: Record<string, any>;
  childText?: string; 
  styles?: Record<string, any>;
  sx?: Record<string, any>;
  className?: string;
  droppable: boolean;
  children?: String[];
}
