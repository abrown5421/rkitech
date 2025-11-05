import React, { createContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { defaultTheme, createMuiThemes, type ThemeConfig } from './theme';

type ThemeContextType = {
  mode: 'light' | 'dark';
  themeName: string;
  toggleMode: () => void;
  setTheme: (themeName: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  themeName: defaultTheme.name,
  toggleMode: () => {},
  setTheme: () => {},
});

interface Props {
  children: ReactNode;
  themes?: ThemeConfig[]; 
}

export const AppThemeProvider: React.FC<Props> = ({ children, themes = [defaultTheme] }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [themeName, setThemeName] = useState(defaultTheme.name);

  const toggleMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  const setTheme = (name: string) => setThemeName(name);

  const activeConfig = themes.find(t => t.name === themeName) || defaultTheme;
  const { lightTheme, darkTheme } = useMemo(() => createMuiThemes(activeConfig), [activeConfig]);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode, lightTheme, darkTheme]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, themeName, setTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
