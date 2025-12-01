import { configureStore } from '@reduxjs/toolkit';
import boxEditorReducer from '../features/admin/boxEditor/boxEditorSlice';

export const store = configureStore({
  reducer: {
    boxEditor: boxEditorReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;