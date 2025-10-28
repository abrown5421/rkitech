import { Document } from "mongoose";

export interface IConfiguration extends Document {
  key: string; 
  data: Record<string, any>; 
}
