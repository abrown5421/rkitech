
export interface IPage {
  _id: string;
  pageName: string;
  pagePath: string;
  pageRenderMethod: 'static' | 'dynamic';
  pageActive: boolean;
  pageColor: string;
  pageFontFamily?: string;
  pageIntensity: boolean;
  pageEntranceAnimation: string;
  pageExitAnimation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageShellProps {
  page: IPage
}

export interface ActivePageProps {
  activePageName: string,
  activePageAnimateIn: boolean
}