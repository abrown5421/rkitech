import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ActivePageProps {
  activePageName: string;
  activePageAnimateIn: boolean;
}

const initialState: ActivePageProps = {
  activePageName: '',
  activePageAnimateIn: false,
};
 
const activePageSlice = createSlice({
  name: 'activePage',
  initialState,
  reducers: {
    setActivePageName: (state, action: PayloadAction<string>) => {
      state.activePageName = action.payload;
    },
    setActivePageAnimateIn: (state, action: PayloadAction<boolean>) => {
      state.activePageAnimateIn = action.payload;
    }
  },
});

export const {
  setActivePageName,
  setActivePageAnimateIn
} = activePageSlice.actions;

export default activePageSlice.reducer;
