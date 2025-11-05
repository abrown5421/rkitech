import { createTheme, type ThemeOptions } from '@mui/material/styles';

export type PaletteColors = typeof commonPalette;

export const commonPalette = {
  primary: { main: '#FE9A00' },
  secondary: { main: '#101828' },
  accent: { main: '#973C00' },
  info: { main: '#2196f3' },
  success: { main: '#00A63E' },
  warning: { main: '#D08700' },
  error: { main: '#E7000B' },
  light: { main: '#F9FAFB' },
  dark: { main: '#1A1D27' },
};

export interface ThemeConfig {
  name: string; 
  palette: PaletteColors;
  lightOverrides?: Partial<ThemeOptions>;
  darkOverrides?: Partial<ThemeOptions>;
}

export const defaultTheme: ThemeConfig = {
  name: 'Default',
  palette: commonPalette,
  lightOverrides: {
    palette: {
      mode: 'light',
      background: { default: '#F9FAFB', paper: '#fff' },
      text: { primary: '#1A1D27', secondary: '#020618' },
    },
  },
  darkOverrides: {
    palette: {
      mode: 'dark',
      background: { default: '#020618', paper: '#1A1D27' },
      text: { primary: '#F9FAFB', secondary: '#fff' },
    },
  },
};

export const createMuiThemes = (config: ThemeConfig) => {
  const lightTheme = createTheme({
    typography: { fontFamily: 'Inter, Roboto, Arial, sans-serif' },
    palette: { ...config.palette, ...(config.lightOverrides?.palette || {}) },
  });

  const darkTheme = createTheme({
    typography: { fontFamily: 'Inter, Roboto, Arial, sans-serif' },
    palette: { ...config.palette, ...(config.darkOverrides?.palette || {}) },
  });

  return { lightTheme, darkTheme };
};
