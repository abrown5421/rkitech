import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import activePageReducer from '../features/page/activePageSlice';
import alertReducer from '../features/alert/alertSlice';
import modalReducer from '../features/modal/modalSlice';
import drawerReducer from '../features/drawer/drawerSlice';
import adminAuthReducer from '../features/admin/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    activePage: activePageReducer,
    alert: alertReducer,
    modal: modalReducer,
    drawer: drawerReducer,
    adminAuth: adminAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;