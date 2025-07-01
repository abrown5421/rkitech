export type PageWithMenu = EditablePageFields & { menuName?: string };

export type EditablePageFields = {
  pageID: string;
  originalPageName: string,
  pageName: string;
  pageSlug: string;
  originalPageSlug: string;
  pageOrder: string;
  pageActive: boolean;
};

export type PageFormState = {
  pageName: string;
  pageSlug: string;
  pageOrder: string; 
};

export type PageFormErrorState = {
  pageName?: string;
  pageSlug?: string;
  pageOrder?: string;
}

export type PageFormField = keyof PageFormState;

export type PageFormFullState = {
  values: PageFormState;
  errors: PageFormErrorState;
  helpers: Partial<Record<PageFormField, string>>;
};