import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import activePageReducer from '../features/page/activePageSlice';
import alertReducer from '../features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    activePage: activePageReducer,
    alert: alertReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;