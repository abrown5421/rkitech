export type MenuConfig = {
  [key: string]: any; 
};

export type Page = {
  pageID: string;
  pageName: string;
  pageSlug: string;
  show: boolean;
  order: number;
  pageContent: string;
  primaryMenu: MenuConfig;
  auxilaryMenu: MenuConfig;
  menuConfigs: MenuConfig;
};

export type ComponentClass = {
  classProperty: string;
  classDefinition: string;
};

export type Component = {
  componentID: string;
  componentName: string;
  componentClasses: ComponentClass[];
};

export interface AppState {
  pages: Page[];
  components: Component[];
}
