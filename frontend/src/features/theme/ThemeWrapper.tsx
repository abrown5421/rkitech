import React, { useEffect, useState } from 'react';
import { ThemeProvider, type Theme } from '@mui/material/styles';
import { useGetActiveThemeQuery } from './themeApi';
import { buildThemeFromData, defaultTheme } from './themeBuilder';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { data: activeTheme } = useGetActiveThemeQuery();
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    if (activeTheme) {
      const builtTheme = buildThemeFromData(activeTheme);
      setCurrentTheme(builtTheme);
    }
  }, [activeTheme]);

  return (
    <ThemeProvider theme={currentTheme}>
      {children}
    </ThemeProvider>
  );
};