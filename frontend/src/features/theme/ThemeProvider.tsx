import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { createMuiThemeFromConfig } from './createMuiTheme';
import type { RootState } from '../../store/store';
import type { AppThemeProviderProps } from './themeTypes';

const DEFAULT_THEME_CONFIG = {
  name: 'default',
  active: true,
  primary: { main: '#FE9A00', content: '#F9FAFB' },
  secondary: { main: '#101828', content: '#F9FAFB' },
  accent: { main: '#973C00', content: '#F9FAFB' },
  success: { main: '#00A43B', content: '#FFFFFF' },
  warning: { main: '#FDC700', content: '#000000' },
  error: { main: '#FF6266', content: '#000000' },
  neutral: { main: '#F9FAFB', content: '#1A1D27' },
  neutral2: { main: '#F8F8F8', content: '#171a26' },
  neutral3: { main: '#EEEEEE', content: '#151926' },
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const activeTheme = useSelector((state: RootState) => state.theme.activeTheme);

  const muiTheme = useMemo(() => {
    return createMuiThemeFromConfig(activeTheme || DEFAULT_THEME_CONFIG);
  }, [activeTheme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};