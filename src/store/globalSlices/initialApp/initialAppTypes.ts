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
  pageActive: boolean;
  pageContent: JSONNode;
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
  componentContent: JSONNode;
};

export interface AppState {
  pages: Page[];
  components: Component[];
}

export type Image = {
  imageName: string;
  imageURL: string;
};

export type ImageGroup = {
  imageGroupName: string;
  images: Image[];
};

export type Menu = {
  itemName: string;
  itemOrder: number;
  itemSlug: string;
  itemType: string; 
};

export type MenuGroup = {
  menuName: string;
  menuItems: Menu[];
};

export type FormField = {
  formFieldLabel: string;
  formFieldName: string;
  formFieldPlaceholder: string;
  formFieldRequired: boolean; 
  formFieldType: string;
};

export type FormGroup = {
  formName: string;
  formFields: FormField[];
  requireCaptcha: boolean;
};

export interface AppState {
  pages: Page[];
  components: Component[];
  images: ImageGroup[]; 
  menus: MenuGroup[];
  forms: FormGroup[];
}