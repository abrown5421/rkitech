import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Page } from "../../../shared/features/pages/pageTypes";
import type { HomePageState } from './homePageIdTypes';

const initialState: HomePageState = {
  id: '',
  homePageObj: null,
};

const homePageSlice = createSlice({
  name: 'homePageId',
  initialState,
  reducers: {
    setHomePageId(state, action: PayloadAction<string | null>) {
      state.id = action.payload ?? '';
    },
    setHomePageObj(state, action: PayloadAction<Page>) {
      state.homePageObj = action.payload;
    },
  },
});

export const { setHomePageId, setHomePageObj } = homePageSlice.actions;
export default homePageSlice.reducer;
