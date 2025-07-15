import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EntranceExitAnimation } from '../../shared/types/animationTypes';
import type { PageShellState, ActivePageShellState } from './pageShellTypes';

const initialPageShell: PageShellState = {
    pageShellRenderMethod: 'dynamic',
    pageShellBackgroundColor: 'bg-white',
    pageShellAnimation: {
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true,
    },
};

const initialState: ActivePageShellState = {
    activePageName: '',
    activePageId: '',
    activePageIn: true,
    activePageShell: initialPageShell,
};

const pageShellSlice = createSlice({
    name: 'pageShell',
    initialState,
    reducers: {
        setActivePage(
            state,
            action: PayloadAction<{ name: string; id: string }>
        ) {
            state.activePageName = action.payload.name;
            state.activePageId = action.payload.id;
        },
        setActivePageIn(state, action: PayloadAction<boolean>) {
            state.activePageIn = action.payload;
        },
        setPageShellRenderMethod(
            state,
            action: PayloadAction<'dynamic' | 'static'>
        ) {
            state.activePageShell.pageShellRenderMethod = action.payload;
        },
        setPageShellBackgroundColor(state, action: PayloadAction<string>) {
            state.activePageShell.pageShellBackgroundColor = action.payload;
        },
        setPageShellAnimation(state, action: PayloadAction<EntranceExitAnimation>) {
            state.activePageShell.pageShellAnimation = action.payload;
        },
        updateEntranceExitAnimation(
            state,
            action: PayloadAction<Partial<EntranceExitAnimation>>
        ) {
            state.activePageShell.pageShellAnimation = {
                ...state.activePageShell.pageShellAnimation,
                ...action.payload,
            };
        },
        resetPageShell(state) {
            state.activePageShell = initialPageShell;
            state.activePageIn = true;
        },
    },
});

export const {
    setActivePage,
    setActivePageIn,
    setPageShellRenderMethod,
    setPageShellBackgroundColor,
    setPageShellAnimation,
    updateEntranceExitAnimation,
    resetPageShell,
} = pageShellSlice.actions;

export default pageShellSlice.reducer;
