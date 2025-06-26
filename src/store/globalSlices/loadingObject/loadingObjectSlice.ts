import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoadingObjectTypes } from './loadingObjectTypes';

const initialState: LoadingObjectTypes = {
  loading: false,
  id: ''
};

const loadingObjectSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingObject: (state, action: PayloadAction<LoadingObjectTypes>) => {
      state.loading = action.payload.loading;
      state.id = action.payload.id;
    },
  },
});

export const { setLoadingObject } = loadingObjectSlice.actions;
export default loadingObjectSlice.reducer;
