

export type MenuItem =
  | {
      itemType: 'page';
      itemId: string;
      itemName: string;
      itemOrder: number;
    }
  | {
      itemType: 'link';
      itemName: string;
      itemLink: string; 
      itemOrder: number;
    };

export interface Menu {
  menuName: string;
  menuItems: MenuItem[];
}

export interface MenusState {
  menus: Menu[];
}

