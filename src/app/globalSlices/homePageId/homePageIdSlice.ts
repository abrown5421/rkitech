import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { HomePageState } from './homePageIdTypes';

const initialState: HomePageState = {
  id: '',
};

const homePageSlice = createSlice({
  name: 'homePageId',
  initialState,
  reducers: {
    setHomePageId(state, action: PayloadAction<{ id: string | null }>) {
      state.id = action.payload.id ?? ''; 
    },
  },
});

export const { setHomePageId } = homePageSlice.actions;
export default homePageSlice.reducer;
