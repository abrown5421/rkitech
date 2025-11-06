import { Document } from 'mongoose';

export interface IElements extends Document {
  name?: string;
  type: string;
  data: Record<string, any>; 
  styles?: Record<string, any>;
  sx?: Record<string, any>
  className?: string;
  props?: Record<string, any>;
  children?: string[];
  parentId?: string;
  order?: number;
  pageId?: string;
}