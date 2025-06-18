import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserState, AuthenticatedUser } from './authTypes';

const initialState: UserState = {
  userId: '',
  authenticatedUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticatedUser: (
      state,
      action: PayloadAction<{ userId: string; user: AuthenticatedUser }>
    ) => {
      state.userId = action.payload.userId;
      state.authenticatedUser = action.payload.user;
    },
    clearAuthenticatedUser: (state) => {
      state.userId = '';
      state.authenticatedUser = null;
    },
  },
});

export const { setAuthenticatedUser, clearAuthenticatedUser } = userSlice.actions;
export default userSlice.reducer;
