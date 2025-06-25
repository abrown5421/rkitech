import type { IconProps } from "../../../components/Icon/iconTypes";

export interface DashboardItem {
  itemName: string;
  icon: IconProps['name'];
  itemType: string;
  itemSlug: string;
  itemOrder: number;
}