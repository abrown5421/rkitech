
import type { EntranceExitAnimation } from "../../../shared/types/animationTypes";

export interface ActivePageShellState {
    activePageShellName: string;
    activePageShellIn: boolean;
    activePageShellId: string;
}

export interface PageShellState {
    activePageShellBgColor: string;
    activePageShellAnimation: EntranceExitAnimation;
}

export interface Page {
  pageName: string;
  pageID: string;
  pagePath: string;
  pageBg: string;
  pageEntranceAnimation: string;
  pageExitAnimation: string;
  pageRenderMethod: string;
  pageActive: boolean;
  componentKey: string;
  content: LocalPageComponent[] | [];
}

export interface PagesState {
  pages: Page[];
  activePageId: string | null;
}

export interface LocalPageComponent {
  type: string;
  props?: {
    [key: string]: any; 
    children?: LocalPageComponent[]; 
  };
}

export interface PagesShellSubState {
  localPageRef: string | undefined;
  localPageType: 'static' | 'dynamic';
  localPageContent: LocalPageComponent[] | [] | undefined;
}