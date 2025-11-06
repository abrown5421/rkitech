import { Document } from 'mongoose';

export interface IElements extends Document {
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