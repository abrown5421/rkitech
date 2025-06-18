import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppState, Page, Component, ImageGroup, MenuGroup } from './initialAppTypes';

const initialState: AppState = {
  pages: [],
  components: [],
  images: [],
  menus: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload;
    },
    setComponents: (state, action: PayloadAction<Component[]>) => {
      state.components = action.payload;
    },
    setImages: (state, action: PayloadAction<ImageGroup[]>) => {
      state.images = action.payload;
    },
    setMenus: (state, action: PayloadAction<MenuGroup[]>) => {
      state.menus = action.payload;
    },
  },
});

export const { setPages, setComponents, setImages, setMenus } = appSlice.actions;
export default appSlice.reducer;
