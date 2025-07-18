export interface MenuItem {
  itemId: string;
  itemName: string;
  itemType: 'page' | 'link';
  itemPath?: string;
}

export interface Menu {
  menuName: string;
  menuItems: MenuItem[];
}

export interface MenusState {
  menus: Menu[];
}