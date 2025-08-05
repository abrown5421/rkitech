import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TabsState } from './tabTypes';

const initialState: TabsState = {};

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<{ groupId: string; tabId: string }>) {
      const { groupId, tabId } = action.payload;
      state[groupId] = tabId;
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
