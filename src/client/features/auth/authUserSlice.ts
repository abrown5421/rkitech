import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthUserState } from './authUserTypes';

const initialState: AuthUserState = {
  user: null,
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    clearAuthUser(state) {
      state.user = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
