export interface ColorObject {
  main: string;
  content: string;
}

export interface AppThemeProviderProps {
  children: React.ReactNode;
}

export interface ITheme {
  _id?: string;
  name: string;
  active: boolean;
  primary: ColorObject;
  secondary: ColorObject;
  accent: ColorObject;
  success: ColorObject;
  warning: ColorObject;
  error: ColorObject;
  neutral: ColorObject;
  neutral2: ColorObject;
  neutral3: ColorObject;
  createdAt?: Date;
  updatedAt?: Date;
}