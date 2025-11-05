import { Document } from 'mongoose';

export interface ColorObject {
  main: string;
  content: string;
}

export interface ITheme extends Document {
  name: string;
  active: boolean;
  primary: ColorObject;
  secondary: ColorObject;
  accent: ColorObject;
  success: ColorObject;
  warning: ColorObject;
  error: ColorObject;
  nuetral: ColorObject;
}
