export type MenuConfig = {
  show: boolean;
  order: number;
};

export type JSONNode = {
  type: string;
  props?: Record<string, any>;
  children?: JSONNode[];
};

export type Page = {
  pageID: string;
  pageName: string;
  pageSlug: string;
  pageContent: JSONNode; 
  menuConfigs: {
    pageSlug: string;
    primaryMenu: MenuConfig;
    auxilaryMenu: MenuConfig;
  };
  animationConfig: AnimationConfig;
};

export type AnimationConfig = {
  entranceAnimation: string;
  exitAnimation: string;
  isEntering: boolean;
}

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
