import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../features/modal/modalSlice';
import alertReducer from '../features/alert/alertSlice';
import drawerReducer from '../features/drawer/drawerSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    alert: alertReducer,
    drawer: drawerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
