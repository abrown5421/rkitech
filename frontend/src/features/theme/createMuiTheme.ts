import { createTheme, type Theme } from '@mui/material/styles';
import type { ITheme } from './themeTypes';

export const createMuiThemeFromConfig = (themeConfig: ITheme): Theme => {
  return createTheme({
    palette: {
      primary: {
        main: themeConfig.primary.main,
        contrastText: themeConfig.primary.content,
      },
      secondary: {
        main: themeConfig.secondary.main,
        contrastText: themeConfig.secondary.content,
      },
      error: {
        main: themeConfig.error.main,
        contrastText: themeConfig.error.content,
      },
      warning: {
        main: themeConfig.warning.main,
        contrastText: themeConfig.warning.content,
      },
      success: {
        main: themeConfig.success.main,
        contrastText: themeConfig.success.content,
      },
      info: {
        main: themeConfig.accent.main,
        contrastText: themeConfig.accent.content,
      },
      background: {
        default: themeConfig.nuetral.main,
        paper: themeConfig.nuetral.main,
      },
      text: {
        primary: themeConfig.nuetral.content,
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
  });
};