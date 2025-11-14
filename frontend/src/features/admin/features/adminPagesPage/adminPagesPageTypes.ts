import type { IPage } from "../../../page/pageTypes";

export const DEFAULT_PAGE: Partial<IPage> = {
  pageName: "New Page",
  pagePath: "/new-page",
  pageRenderMethod: 'static',
  pageActive: true,
  pageColor: "neutral.main",
  pageFontFamily: "PrimaryFont",
  pageFontColor: "neutral.content",
  pageContent: [],
  pageEntranceAnimation: "animate__fadeIn",
  pageExitAnimation: "animate__fadeOut"
};
