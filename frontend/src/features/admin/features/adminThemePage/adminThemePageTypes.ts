import type { ITheme } from "../../../theme/themeTypes";

export const COLOR_KEYS = ["primary", "secondary", "accent", "success", "warning", "error"] as const;
export const ALL_COLOR_KEYS = [...COLOR_KEYS, "neutral", "neutral2", "neutral3"] as const;

export const DEFAULT_PERMISSIONS = {
  read: true,
  update: true,
  delete: true,
};

export type ThemeWithPermissions = ITheme & {
  permissions?: Partial<typeof DEFAULT_PERMISSIONS>;
};

export interface ThemeCardProps {
  themeItem: ThemeWithPermissions;
  onRead?: (item: ThemeWithPermissions) => void;
  onUpdate?: (item: ThemeWithPermissions) => void;
  onDelete?: (item: ThemeWithPermissions) => void;
}