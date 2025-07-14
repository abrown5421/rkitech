import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AlertProps } from './alertTypes';

const initialState: AlertProps = {
  open: false,
  severity: 'success',
  message: '',
  animation: {
    entranceAnimation: 'animate__fadeInRight animate__faster',
    exitAnimation: 'animate__fadeOutRight animate__faster',
    isEntering: false,
  },
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    openAlert: (state, action: PayloadAction<Omit<AlertProps, 'animation'>>) => {
      state.open = true;
      state.severity = action.payload.severity;
      state.message = action.payload.message;
      state.animation = {
        entranceAnimation: 'animate__fadeInRight animate__faster',
        exitAnimation: 'animate__fadeOutRight animate__faster',
        isEntering: true,
      };
    },
    preCloseAlert: (state) => {
      state.animation.isEntering = false;
    },
    closeAlert: (state) => {
      state.open = false;
      state.severity = 'success';
      state.message = '';
      state.animation = {
        entranceAnimation: 'animate__fadeInRight animate__faster',
        exitAnimation: 'animate__fadeOutRight animate__faster',
        isEntering: false,
      };
    },
  },
});

export const { openAlert, preCloseAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
