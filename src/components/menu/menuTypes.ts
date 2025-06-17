import type { Page } from "../../store/globalSlices/initialApp/initialAppTypes";

export interface MenuProps {
  twClasses?: string[];
  pages: Page[];
  activePageName: string;
  onNavigate: (pageSlug: string, pageName: string, pageID: string) => void;
}