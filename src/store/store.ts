import { configureStore } from '@reduxjs/toolkit';
import rendererReducer from '../features/renderer/rendererSlice';

export const store = configureStore({
  reducer: {
    renderer: rendererReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;