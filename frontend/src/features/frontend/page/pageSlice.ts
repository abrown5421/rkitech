import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ActivePageProps, IPage } from './pageTypes';

const initialState: ActivePageProps = {
  activePageUid: 'page_id_home',
  activePageAnimateIn: true,
  activePageObj: undefined,
};

const activePageSlice = createSlice({
  name: 'activePage',
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<ActivePageProps>) => {
      state.activePageUid = action.payload.activePageUid;
      state.activePageAnimateIn = action.payload.activePageAnimateIn;
      state.activePageObj = action.payload.activePageObj;
    },
    setActivePageName: (state, action: PayloadAction<string>) => {
      state.activePageUid = action.payload;
    },
    setActivePageAnimateIn: (state, action: PayloadAction<boolean>) => {
      state.activePageAnimateIn = action.payload;
    },
    setActivePageObj: (state, action: PayloadAction<IPage | undefined>) => {
      state.activePageObj = action.payload
    },
  },
});

export const {
  setActivePage,
  setActivePageName,
  setActivePageAnimateIn,
  setActivePageObj,
} = activePageSlice.actions;

export default activePageSlice.reducer;
