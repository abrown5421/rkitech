import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoadingState } from './loadingTypes';

const initialState: LoadingState = {
  loading: false,
  id: null,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<{ loading: boolean; id: string | null }>) {
      state.loading = action.payload.loading;
      state.id = action.payload.id;
    },
    setNotLoading(state) {
      state.loading = false;
      state.id = null;
    },
  },
});

export const { setLoading, setNotLoading } = loadingSlice.actions;
export default loadingSlice.reducer;