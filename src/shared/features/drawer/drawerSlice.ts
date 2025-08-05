import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DrawerState, DrawerContentType } from './drawerTypes';
import type { EntranceExitAnimation } from '../../../shared/types/animationTypes';

const initialState: DrawerState = {
  drawerOpen: false,
  drawertitle: '',
  draweranchor: 'right',
  draweranimation: {
    entranceAnimation: 'animate__fadeInRight animate__faster',
    exitAnimation: 'animate__fadeOutRight animate__faster',
    isEntering: false,
  },
  drawerContentType: null,
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (
      state,
      action: PayloadAction<{
        title?: string;
        anchor?: 'left' | 'right' | 'top' | 'bottom';
        animation?: EntranceExitAnimation;
        contentType: DrawerContentType;
      }>
    ) => {
      state.drawerOpen = true;
      state.drawertitle = action.payload.title || '';
      state.draweranchor = action.payload.anchor ?? 'right';
      state.draweranimation = action.payload.animation || initialState.draweranimation;
      state.draweranimation.isEntering = true;
      state.drawerContentType = action.payload.contentType;
    },
    preCloseDrawer: (state) => {
      state.draweranimation.isEntering = false;
    },
    closeDrawer: () => initialState,
  },
});

export const { openDrawer, preCloseDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;