import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Staff, StaffMember } from './staffTypes';

const initialState: Staff = {
  staff: [],
};

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action: PayloadAction<StaffMember[]>) => {
      state.staff = action.payload;
    }
  },
});

export const { 
  setStaff
} = staffSlice.actions;

export default staffSlice.reducer;
