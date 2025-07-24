import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MenusState, Menu } from './menuTypes';

const initialState: MenusState = {
  menus: [],
};

const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<Menu[]>) {
      state.menus = action.payload;
    },
    addMenu(state, action: PayloadAction<Menu>) {
      state.menus.push(action.payload);
    },
    updateMenu(state, action: PayloadAction<Menu>) {
      const index = state.menus.findIndex(menu => menu.menuName === action.payload.menuName);
      if (index !== -1) {
        state.menus[index] = action.payload;
      }
    },
  },
});

export const { setMenus, addMenu, updateMenu } = menusSlice.actions;

export default menusSlice.reducer;