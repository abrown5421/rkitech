import type { ITheme } from "../../../theme/themeTypes";

export const COLOR_KEYS = ["primary", "secondary", "accent", "success", "warning", "error"] as const;
export const ALL_COLOR_KEYS = [...COLOR_KEYS, "neutral", "neutral2", "neutral3"] as const;
export const DEFAULT_THEME: Partial<ITheme> = {
  name: "New Theme",
  primary: { main: "#1976d2", content: "#ffffff" },
  secondary: { main: "#dc004e", content: "#ffffff" },
  accent: { main: "#f50057", content: "#ffffff" },
  success: { main: "#4caf50", content: "#ffffff" },
  warning: { main: "#ff9800", content: "#000000" },
  error: { main: "#f44336", content: "#ffffff" },
  neutral: { main: "#ffffff", content: "#000000" },
  neutral2: { main: "#f5f5f5", content: "#000000" },
  neutral3: { main: "#e0e0e0", content: "#000000" },
};

export type ColorKey = typeof ALL_COLOR_KEYS[number];

export interface ThemePreviewProps {
  theme: ITheme | Partial<ITheme>;
  activeTheme?: ITheme;
  isActive?: boolean;
  onActivate?: () => void;
  isLoading?: boolean;
}

export interface ColorGroupEditorProps {
  colorKey: ColorKey;
  colorGroup: { main: string; content: string };
  onChange: (key: ColorKey, type: 'main' | 'content', value: string) => void;
  activeTheme?: ITheme;
}

export interface ThemeCardProps {
  theme: ITheme;
  activeTheme?: ITheme;
  isLoading?: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ThemeEditorProps {
  theme: ITheme | Partial<ITheme>;
  originalTheme?: ITheme;
  activeTheme?: ITheme;
  isNew: boolean;
  onSave: () => void;
  onDelete?: () => void;
  onRevert?: () => void;
  onChange: (theme: ITheme | Partial<ITheme>) => void;
  onActivate?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}