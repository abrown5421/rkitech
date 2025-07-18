import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../features/modal/modalSlice';
import alertReducer from '../features/alert/alertSlice';
import drawerReducer from '../features/drawer/drawerSlice';
import pageShellReducer from '../features/pageShell/pageShellSlice';
import authUserReducer from '../features/auth/authUserSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    alert: alertReducer,
    drawer: drawerReducer,
    pageShell: pageShellReducer,
    authUser: authUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
