import { createTheme, type ThemeOptions } from '@mui/material/styles';

const commonPalette = {
  primary: { main: '#FE9A00' },
  secondary: { main: '#101828' },
  accent: { main: '#973C00' },
  info: { main: '#2196f3' },
  success: { main: '#00A63E' },
  warning: { main: '#D08700' },
  error: { main: '#E7000B' },
  light: { main: '#F9FAFB'},
  dark: { main: '#1A1D27'}
};

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default: '#F9FAFB',
      paper: '#fff',
    },
    text: {
      primary: '#1A1D27',
      secondary: '#020618',
    },
    ...commonPalette,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
};

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#020618',
      paper: '#1A1D27',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#fff',
    },
    ...commonPalette,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);
