import type { IConfiguration } from "../configurations/configurationsTypes";

export interface FooterProps {
  configs: IConfiguration[];
  loading: boolean;
}

export interface IFooterMenuItem {
  itemId: string;
  itemType: 'page' | 'link';
  itemTitle: string;
  itemPath: string;
}

export interface IFooterConfigData {
  copyText: string;
  backgroundColor: string;
  menuItems?: IFooterMenuItem[];
}
