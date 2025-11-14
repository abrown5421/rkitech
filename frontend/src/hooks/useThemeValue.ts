import { useGetActiveThemeQuery } from "../features/theme/themeApi";

export function useThemeValue(path: string): string | undefined {
  const { data: theme } = useGetActiveThemeQuery();

  if (!theme) return undefined;

  const value = path.split('.').reduce((obj: any, key: string) => {
    return obj?.[key];
  }, theme);

  return value;
}

export function resolveThemeValue(value: any, theme: any) {
  if (typeof value === 'string' && value.startsWith('$theme.')) {
    const path = value.replace('$theme.', '');
    return path.split('.').reduce((obj: any, key: string) => {
      return obj?.[key];
    }, theme);
  }
  return value;
}