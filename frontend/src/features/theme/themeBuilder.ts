import { createTheme, type Theme } from '@mui/material/styles';
import type { ITheme } from './themeTypes';
import PrimaryFont from '/fonts/Primary.ttf';
import SecondaryFont from '/fonts/secondary.ttf';

declare module '@mui/material/styles' {
  interface Palette {
    accent: { main: string; content: string };
    neutral: { main: string; content: string };
    neutral2: { main: string; content: string };
    neutral3: { main: string; content: string };
  }
  interface PaletteOptions {
    accent?: { main: string; content: string };
    neutral?: { main: string; content: string };
    neutral2?: { main: string; content: string };
    neutral3?: { main: string; content: string };
  }

  interface SimplePaletteColorOptions {
    content?: string;
  }
  
  interface PaletteColor {
    content?: string;
  }
}

export const buildThemeFromData = (themeData: ITheme): Theme => {
  return createTheme({
    palette: {
      primary: {
        main: themeData.primary.main,
        content: themeData.primary.content,
      },
      secondary: {
        main: themeData.secondary.main,
        content: themeData.secondary.content,
      },
      accent: {
        main: themeData.accent.main,
        content: themeData.accent.content,
      },
      success: {
        main: themeData.success.main,
        content: themeData.success.content,
      },
      warning: {
        main: themeData.warning.main,
        content: themeData.warning.content,
      },
      error: {
        main: themeData.error.main,
        content: themeData.error.content,
      },
      info: { 
        main: '#0288d1', 
        content: '#ffffff' 
      },
      neutral: {
        main: themeData.neutral.main,
        content: themeData.neutral.content,
      },
      neutral2: {
        main: themeData.neutral2.main,
        content: themeData.neutral2.content,
      },
      neutral3: {
        main: themeData.neutral3.main,
        content: themeData.neutral3.content,
      },
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
};

export const defaultTheme = createTheme({
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