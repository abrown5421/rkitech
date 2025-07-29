import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AlertProps } from './alertTypes';

const initialState: AlertProps = {
  alertOpen: false,
  alertSeverity: 'success',
  alertMessage: '',
  alertAnimation: {
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
      state.alertOpen = true;
      state.alertSeverity = action.payload.alertSeverity;
      state.alertMessage = action.payload.alertMessage;
      state.alertAnimation = {
        entranceAnimation: 'animate__fadeInRight animate__faster',
        exitAnimation: 'animate__fadeOutRight animate__faster',
        isEntering: true,
      };
    },
    preCloseAlert: (state) => {
      state.alertAnimation.isEntering = false;
    },
    closeAlert: (state) => {
      state.alertOpen = false;
      state.alertSeverity = 'success';
      state.alertMessage = '';
      state.alertAnimation = {
        entranceAnimation: 'animate__fadeInRight animate__faster',
        exitAnimation: 'animate__fadeOutRight animate__faster',
        isEntering: false,
      };
    },
  },
});

export const { openAlert, preCloseAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
