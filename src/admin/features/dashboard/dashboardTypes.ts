import type { IconProps } from "../../../components/Icon/Icon";

export interface DashboardItem {
  itemName: string;
  icon: IconProps['name'];
  itemType: string;
  itemSlug: string;
  itemOrder: number;
  itemDescription: string;
}