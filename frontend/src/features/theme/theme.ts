import { createTheme } from '@mui/material/styles';
import type { CustomPalette } from './themeTypes';
import PrimaryFont from '/fonts/Primary.ttf';
import SecondaryFont from '/fonts/secondary.ttf';

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
    fontFamily: 'Roboto, Arial, Primary, Secondary',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Primary';
          src: url(${PrimaryFont}) format('truetype');
        }
        @font-face {
          font-family: 'Secondary';
          src: url(${SecondaryFont}) format('truetype');
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        outlined: ({ ownerState, theme }) => {
          type CustomPaletteKeys =
            | 'primary'
            | 'secondary'
            | 'accent'
            | 'success'
            | 'warning'
            | 'error'
            | 'info'
            | 'neutral'
            | 'neutral2'
            | 'neutral3';

          const color = (ownerState.color || 'primary') as CustomPaletteKeys;
          const palette = theme.palette[color];

          return {
            color: palette.main,
            borderColor: palette.main,
            backgroundColor: theme.palette.neutral.main,

            "&:hover": {
              color: palette.content,
              backgroundColor: palette.main,
              borderColor: palette.main,
            }
          };
        }
      }
    }
  }
});

export default theme;