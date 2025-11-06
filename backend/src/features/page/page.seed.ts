import { seedDatabase } from '../base/base.seed';
import { Page } from './page.model';
import { IPage } from './page.types';

const defaultPages = [
  {
    pageName: "Home",
    pagePath: "/",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageFontFamily: "SecondaryFont",
    pageFontColor: "neutral.content",
    pageIntensity: false,
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    pageName: "PageNotFound",
    pagePath: "/page-not-found",
    pageRenderMethod: "dynamic" as const,
    pageContent: ["690ce4d25c8bf312b9d8af45"],
    pageActive: true,
    pageColor: "neutral.main",
    pageFontFamily: "SecondaryFont",
    pageFontColor: "neutral.content",
    pageIntensity: false,
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    pageName: "PrivacyPolicy",
    pagePath: "/privacy-policy",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageFontFamily: "SecondaryFont",
    pageFontColor: "neutral.content",
    pageIntensity: false,
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  }
];

seedDatabase<IPage>({
  modelName: 'page',
  model: Page,
  data: defaultPages,
  uniqueField: 'pagePath',
  displayField: 'pageName',
});