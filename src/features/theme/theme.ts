import { createTheme } from '@mui/material/styles';
import type { CustomPalette } from './themeTypes';

declare module '@mui/material/styles' {
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends Partial<CustomPalette> {}

  interface SimplePaletteColorOptions {
    content?: string;
  }
  
  interface PaletteColor {
    content?: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#FE9A00",
      content: "#F9FAFB"
    },
    secondary: {
      main: "#183164",
      content: "#F9FAFB"
    },
    accent: {
      main: "#973C00",
      content: "#F9FAFB"
    },
    success: {
      main: "#00A43B",
      content: "#FFFFFF"
    },
    warning: {
      main: "#FDC700",
      content: "#000000"
    },
    error: {
      main: "#ff383f",
      content: "#fff0f0"
    },
    info: { 
      main: '#0288d1', 
      content: '#ffffff' 
    },
    neutral: {
      main: "#F9FAFB",
      content: "#1f1f1f"
    },
    neutral2: {
      main: "#F8F8F8",
      content: "#373e57"
    },
    neutral3: {
      main: "#EEEEEE",
      content: "#2f3852"
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;