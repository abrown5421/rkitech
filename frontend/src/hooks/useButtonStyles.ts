import { useGetActiveThemeQuery } from "../features/theme/themeApi";

type ButtonVariant = 'primary' | 'secondary' | 'error' | 'success' | 'warning';

export const useThemedButtonStyles = (variant: ButtonVariant = 'primary') => {
  const { data: theme } = useGetActiveThemeQuery();

  const colorMap = {
    primary: theme?.primary,
    secondary: theme?.secondary,
    error: theme?.error,
    success: theme?.success,
    warning: theme?.warning,
  };

  const color = colorMap[variant];

  return {
    backgroundColor: color?.main,
    color: color?.content,
    border: '1px solid transparent',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme?.neutral.main,
      color: color?.main,
      borderColor: color?.main,
    },
  };
};