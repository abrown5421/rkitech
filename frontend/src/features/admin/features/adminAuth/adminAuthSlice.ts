import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IEmployees } from '../../../employees/employeesTypes';
import type { AdminAuthState } from './adminAuthTypes';

const initialState: AdminAuthState = {
  user: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminUser: (state, action: PayloadAction<IEmployees | null>) => {
      state.user = action.payload;
    },
    logoutAdmin: (state) => {
      state.user = null;
    },
  },
});

export const { setAdminUser, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
