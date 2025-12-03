export interface CustomPalette {
  accent: { main: string; content: string };
  info: { main: string; content: string };
  success: { main: string; content: string };
  warning: { main: string; content: string };
  error: { main: string; content: string };
  neutral: { main: string; content: string };
  neutral2: { main: string; content: string };
  neutral3: { main: string; content: string };
}

export interface ColorObject {
  main: string;
  content: string;
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