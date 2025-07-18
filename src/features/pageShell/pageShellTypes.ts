import type { EntranceExitAnimation } from "../../shared/types/animationTypes";

export interface ActivePageShellState {
    activePageShellName: string;
    activePageShellIn: boolean;
    activePageShellId: string;
}

export interface PageShellState {
    activePageShellBgColor: string;
    activePageShellAnimation: EntranceExitAnimation;
}