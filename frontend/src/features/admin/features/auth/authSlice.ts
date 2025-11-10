import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IEmployees } from '../../../employees/employeesTypes';
import type { AuthState } from './authTypes';
import Cookies from 'js-cookie';

const initialState: AuthState = {
  user: Cookies.get('adminUser') ? JSON.parse(Cookies.get('adminUser')!) : null,
};

export const authSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IEmployees | null>) {
      state.user = action.payload;
    },
    logoutAdmin(state) {
      state.user = null;
    },
  },
});

export const { setUser, logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
