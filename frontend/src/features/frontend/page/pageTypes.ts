export interface IPage {
  _id: string;
  pageUniqueId: string;
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
  activePageUid: string,
  activePageAnimateIn: boolean,
  activePageObj?: IPage
}