import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ClientAuthUser, ClientAuthUserState } from './ClientAuthUserTypes';

const initialState: ClientAuthUserState = {
  user: null,
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setClientAuthUser(state, action: PayloadAction<ClientAuthUser>) {
      state.user = action.payload;
    },
    clearClientAuthUser(state) {
      state.user = null;
    },
  },
});

export const { setClientAuthUser, clearClientAuthUser } = authUserSlice.actions;
export default authUserSlice.reducer;
