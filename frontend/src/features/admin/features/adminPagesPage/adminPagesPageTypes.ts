import type { IPage } from "../../../page/pageTypes";

export const DEFAULT_PERMISSIONS = {
  onSpecialAction: true,
  read: true,
  update: true,
  delete: true,
};

export type PageWithPermissions = IPage & {
  permissions?: Partial<typeof DEFAULT_PERMISSIONS>;
};

export interface PageMapItemProps {
  pageItem: PageWithPermissions;
  theme?: any;
  onSpecialAction?: (item: PageWithPermissions) => void;
  onRead?: (item: PageWithPermissions) => void;
  onUpdate?: (item: PageWithPermissions) => void;
  onDelete?: (item: PageWithPermissions) => void;
}