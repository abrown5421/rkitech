

export type MenuItem =
  | {
      itemType: 'page';
      itemId: string;
      itemName: string;
      itemOrder: number;
    }
  | {
      itemType: 'dropdown';
      itemName: string;
      itemId: string; 
      itemOrder: number;
      itemChildren: MenuItem[];
    }
  | {
      itemType: 'link';
      itemName: string;
      itemLink: string; 
      itemOrder: number;
    };

export interface Menu {
  menuName: string;
  menuEnv: string;
  menuItems: MenuItem[];
}

export interface MenusState {
  menus: Menu[];
}

