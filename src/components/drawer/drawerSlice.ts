import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DrawerState } from './drawerTypes';

const initialState: DrawerState = {};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    closeDrawer: (state, action: PayloadAction<string>) => {
      state[action.payload] = false;
    },
    toggleDrawer: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state[id] = !state[id];
    }
  },
});

export const { openDrawer, closeDrawer, toggleDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
