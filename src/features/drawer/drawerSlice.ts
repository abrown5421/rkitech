import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DrawerState } from './drawerTypes';

const initialState: DrawerState = {
  drawerOpen: false,
  drawertitle: '',
  draweranchor: 'right', 
  draweranimation: {
    entranceAnimation: 'animate__fadeInRight animate__faster',
    exitAnimation: 'animate__fadeOutRight animate__faster',
    isEntering: false,
  },
  drawerchildren: null,
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<DrawerState>) => {
      state.drawerOpen = true;
      state.drawertitle = action.payload.drawertitle;
      state.draweranchor = action.payload.draweranchor ?? 'right';
      state.drawerchildren = action.payload.drawerchildren ?? null;
      state.draweranimation = action.payload.draweranimation;
    },
    preCloseDrawer: (state) => {
      state.draweranimation.isEntering = false;
    },
    closeDrawer: () => {
      return initialState;
    },
  },
});


export const { openDrawer, preCloseDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
