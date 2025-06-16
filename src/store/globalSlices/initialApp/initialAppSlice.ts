import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppState, Page, Component } from './initialAppTypes';

const initialState: AppState = {
  pages: [],
  components: [],
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
  },
});

export const { setPages, setComponents } = appSlice.actions;
export default appSlice.reducer;
