import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AdminAuthUser, AdminAuthUserState } from './adminAuthUserTypes';

const initialState: AdminAuthUserState = {
  user: null,
};

const authUserSlice = createSlice({
  name: 'adminAuthUser',
  initialState,
  reducers: {
    setAdminAuthUser(state, action: PayloadAction<AdminAuthUser>) {
      state.user = action.payload;
    },
    clearAdminAuthUser(state) {
      state.user = null;
    },
  },
});

export const { setAdminAuthUser, clearAdminAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
