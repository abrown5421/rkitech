import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AlertProps, Severity } from './alertTypes';

const initialState: AlertProps = {
    open: false,
    severity: 'success',
    message: '',
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    openAlert: (state) => {
      state.open = true;
    },
    closeAlert: (state) => {
      state.open = false;
    },
    setAlertSeverity: (state, action: PayloadAction<Severity>) => {
      state.severity = action.payload;
    },
    setAlertMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setAlert: (state, action: PayloadAction<AlertProps>) => {
        state.open = action.payload.open;
        state.severity = action.payload.severity;
        state.message = action.payload.message;
    },
  },
});

export const { openAlert, closeAlert, setAlertSeverity, setAlertMessage, setAlert } = alertSlice.actions;
export default alertSlice.reducer;
