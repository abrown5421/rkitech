import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IEmployees } from '../../../employees/employeesTypes';
import type { AuthState } from './authTypes';

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IEmployees | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
