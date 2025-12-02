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
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    pageName: "PageNotFound",
    pagePath: "/page-not-found",
    pageRenderMethod: "dynamic" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    pageName: "PrivacyPolicy",
    pagePath: "/privacy-policy",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
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