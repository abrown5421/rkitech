import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import activePageReducer from '../features/frontend/page/pageSlice';
import rendererReducer from '../features/frontend/renderer/rendererSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    activePage: activePageReducer,
    renderer: rendererReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;