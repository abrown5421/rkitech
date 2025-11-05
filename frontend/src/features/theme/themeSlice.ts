import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ITheme } from './themeTypes';

interface ThemeState {
  activeTheme: ITheme | null;
  isLoading: boolean;
}

const initialState: ThemeState = {
  activeTheme: null,
  isLoading: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setActiveTheme: (state, action: PayloadAction<ITheme>) => {
      state.activeTheme = action.payload;
      state.isLoading = false;
    },
    clearActiveTheme: (state) => {
      state.activeTheme = null;
    },
  },
});

export const { setActiveTheme, clearActiveTheme } = themeSlice.actions;
export default themeSlice.reducer;