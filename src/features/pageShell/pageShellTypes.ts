import type { EntranceExitAnimation } from "../../shared/types/animationTypes";

export interface PageShellState {
    pageShellRenderMethod: 'dynamic' | 'static';
    pageShellBackgroundColor: string;
    pageShellAnimation: EntranceExitAnimation;
}

export interface ActivePageShellState {
    activePageName: string;
    activePageIn: boolean;
    activePageId: string;
    activePageShell: PageShellState;
}