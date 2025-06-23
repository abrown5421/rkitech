export interface MenuItem {
  itemName: string;
  itemOrder: number;
  itemSlug: string;
  itemType: string;
}

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
}
