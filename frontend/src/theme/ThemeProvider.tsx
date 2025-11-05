import React, { createContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleMode: () => {},
});

interface Props {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
