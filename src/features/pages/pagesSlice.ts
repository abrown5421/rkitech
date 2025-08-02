import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Page, PagesState } from './pageTypes';

const initialState: PagesState = {
  pages: [],
  activePageId: null
};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    setPages(state, action: PayloadAction<Page[]>) {
      state.pages = action.payload;
    },
    setActivePage(state, action: PayloadAction<string>) {
      state.activePageId = action.payload;
    }
  }
});

export const { setPages, setActivePage } = pagesSlice.actions;
export default pagesSlice.reducer;
