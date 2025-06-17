import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppState, Page, Component, ImageGroup } from './initialAppTypes';

const initialState: AppState = {
  pages: [],
  components: [],
  images: [],
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
  },
});

export const { setPages, setComponents, setImages } = appSlice.actions;
export default appSlice.reducer;
