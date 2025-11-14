import { useGetActiveThemeQuery } from "./features/theme/themeApi";
import { lightenHex } from "./utils/colorUtils";

export const MuiStyleOverider = () => {
  const { data: theme } = useGetActiveThemeQuery();
  if (!theme) return null;

  const style = `
    /* Outline default */
    .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
      border-color: ${theme.neutral.content};
    }

    /* Outline on hover */
    .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${theme.primary.main};
    }

    /* Outline when focused */
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${theme.accent.main};
    }

    /* Label default */
    .MuiInputLabel-root {
      color: ${theme.neutral.content};
    }

    /* Label on focus */
    .MuiInputLabel-root.Mui-focused {
      color: ${theme.accent.main};
    }

    /* Input text color */
    .MuiOutlinedInput-input {
      color: ${theme.neutral.content};
    }

    /* Placeholder color */
    .MuiOutlinedInput-input::placeholder {
      color: ${theme.neutral2.content};
      opacity: 1;
    }

    /* Disabled inputs styling */
    .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline,
    .MuiOutlinedInput-input.Mui-disabled,
    .MuiInputLabel-root.Mui-disabled,
    .MuiFormHelperText-root.Mui-disabled {
      color: ${lightenHex(theme.neutral.content, 0.5)};
      border-color: ${lightenHex(theme.neutral.content, 0.5)};
      opacity: 0.5;
      cursor: not-allowed !important;
    }

    /* Ensure disabled input text is visible */
    .MuiOutlinedInput-input.Mui-disabled {
      -webkit-text-fill-color: ${lightenHex(theme.neutral.content, 0.5)}; /* for Chrome autofill */
    }
  `;

  return <style>{style}</style>;
};
