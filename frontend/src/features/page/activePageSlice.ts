import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ActivePageProps } from './pageTypes';

const initialState: ActivePageProps = {
  activePageName: 'Home',
  activePageAnimateIn: true,
};
 
const activePageSlice = createSlice({
  name: 'activePage',
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<ActivePageProps>) => {
      state.activePageName = action.payload.activePageName
      state.activePageAnimateIn = action.payload.activePageAnimateIn
    },
    setActivePageName: (state, action: PayloadAction<string>) => {
      state.activePageName = action.payload;
    },
    setActivePageAnimateIn: (state, action: PayloadAction<boolean>) => {
      state.activePageAnimateIn = action.payload;
    }
  },
});

export const {
  setActivePage,
  setActivePageName,
  setActivePageAnimateIn
} = activePageSlice.actions;

export default activePageSlice.reducer;
