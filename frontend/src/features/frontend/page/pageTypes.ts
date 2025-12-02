export interface IPage {
  _id: string;
  pageName: string;
  pagePath: string;
  pageRenderMethod: 'static' | 'dynamic';
  rootElement?: string;
  pageActive: boolean;
  pageColor: string;
  pageEntranceAnimation: string;
  pageExitAnimation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageProps {
  page: IPage
}

export interface ActivePageProps {
  activePageName: string,
  activePageAnimateIn: boolean,
  activePageObj?: IPage
}