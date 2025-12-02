import { configureStore } from '@reduxjs/toolkit';
import rendererReducer from '../features/frontend/renderer/rendererSlice';
import { baseApi } from './api/baseApi';
import activePageReducer from '../features/frontend/page/pageSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    renderer: rendererReducer,
    activePage: activePageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;