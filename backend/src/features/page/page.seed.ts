import { seedDatabase } from '../base/base.seed';
import { Page } from './page.model';
import { IPage } from './page.types';

const defaultPages = [
  {
    _seedKey: 'page-home',
    pageUniqueId: 'page_id_home',
    pageName: "Home",
    pagePath: "/",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    _seedKey: 'page-404',
    pageUniqueId: 'page_id_page_not_found',
    pageName: "Page Not Found",
    pagePath: "/page-not-found",
    pageRenderMethod: "dynamic" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
    _relationFields: {
      rootElement: '404-root' 
    }
  },
  {
    _seedKey: 'page-privacy',
    pageUniqueId: 'page_id_home_privacy_policy',
    pageName: "Privacy Policy",
    pagePath: "/privacy-policy",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    _seedKey: 'page-admin-dash',
    pageUniqueId: 'page_id_admin_dash',
    pageName: "Admin Dashboard",
    pagePath: "/admin/dashboard",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    _seedKey: 'page-admin-auth',
    pageUniqueId: 'page_id_admin_auth',
    pageName: "Admin Auth",
    pagePath: "/admin/auth",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.content",
    pageEntranceAnimation: "animate__fadeInUpBig",
    pageExitAnimation: "animate__fadeOutDownBig",
  },
  {
    _seedKey: 'page-admin-editor',
    pageUniqueId: 'page_id_admin_page_editor',
    pageName: "Admin Page Editor",
    pagePath: "/admin/page-editor",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  },
  {
    _seedKey: 'page-admin-pages',
    pageUniqueId: 'page_id_admin_pages',
    pageName: "Admin Pages",
    pagePath: "/admin/pages",
    pageRenderMethod: "static" as const,
    pageActive: true,
    pageColor: "neutral.main",
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
  }
];

export default async () => {
  await seedDatabase<IPage>({
    modelName: 'page',
    model: Page,
    data: [], 
    dataWithKeys: defaultPages,
    uniqueField: 'pagePath',
    displayField: 'pageName',
  });
};