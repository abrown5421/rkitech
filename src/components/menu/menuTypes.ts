import type { MenuItem } from "../../store/globalSlices/initialApp/initialAppTypes";

export interface MenuDocument {
  menuName: string;
  menuItems: MenuItem[];
}

export interface MenuProps {
  menuID?: string;
  menuObject?: MenuDocument;
  routingID: string;
  twClasses?: string[];
  activeClasses?: { classProperty: string; classDefinition: string }[];
  secondaryClasses?: string[];
  requirePageMatch?: boolean; 
}
