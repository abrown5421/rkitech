export interface IPage {
  pageName: string;
  pagePath: string;
  pageRenderMethod: 'static' | 'dynamic';
  pageActive: boolean;
  pageColor: string;
  pageIntensity: boolean;
  pageEntranceAnimation: string;
  pageExitAnimation: string;
  pageID: string;
}