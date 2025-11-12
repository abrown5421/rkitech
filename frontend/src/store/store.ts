import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import activePageReducer from '../features/page/activePageSlice';
import alertReducer from '../features/alert/alertSlice';
import modalReducer from '../features/modal/modalSlice';
import drawerReducer from '../features/drawer/drawerSlice';
import adminUserReducer from '../features/admin/features/adminAuth/adminAuthSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    activePage: activePageReducer,
    alert: alertReducer,
    modal: modalReducer,
    drawer: drawerReducer,
    adminUser: adminUserReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;