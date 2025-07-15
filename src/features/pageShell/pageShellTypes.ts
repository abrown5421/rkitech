import type { EntranceExitAnimation } from "../../shared/types/animationTypes";

export interface PageShellState {
    pageShellRenderMethod: 'dynamic' | 'static';
    pageShellBackgroundColor: string;
    pageShellAnimation: EntranceExitAnimation;
}