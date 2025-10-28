import type { IConfiguration } from "../configurations/configurationsTypes";

export interface NavbarProps {
  configs: IConfiguration[];
  loading: boolean;
}

export interface IMenuItem {
  itemId: string;
  itemType: 'page' | 'link';
  itemTitle: string;
  itemPath: string;
}

export interface INavbarConfigData {
  logo: string;
  logoTitle: string;
  backgroundColor: string;
  componentAnimation?: { entranceAnimation?: string; exitAnimation?: string };
  logoAnimation?: { entranceAnimation?: string; exitAnimation?: string };
  menuItems?: IMenuItem[];
}
