import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../features/modal/modalSlice';
import alertReducer from '../features/alert/alertSlice';
import drawerReducer from '../features/drawer/drawerSlice';
import pageShellReducer from '../features/pages/pageShellSlice';
import pageReducer from '../features/pages/pagesSlice';
import authUserReducer from '../features/auth/authUserSlice';
import loadingReducer from './globalSlices/loading/loadingSlice';
import menuReducer from './globalSlices/menus/menusSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    alert: alertReducer,
    drawer: drawerReducer,
    loading: loadingReducer,
    pageShell: pageShellReducer,
    pages: pageReducer,
    menus: menuReducer,
    authUser: authUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
