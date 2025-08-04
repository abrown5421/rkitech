import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../features/modal/modalSlice';
import alertReducer from '../features/alert/alertSlice';
import drawerReducer from '../features/drawer/drawerSlice';
import pageShellReducer from '../features/pages/pageShellSlice';
import pageReducer from '../features/pages/pagesSlice';
import authUserReducer from '../features/auth/authUserSlice';
import tabReducer from '../features/tabs/tabSlice';
import loadingReducer from './globalSlices/loading/loadingSlice';
import menuReducer from './globalSlices/menus/menusSlice';
import friendsReducer from '../features/friends/friendSlice';
import notificationReducer from '../features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    alert: alertReducer,
    drawer: drawerReducer,
    tabs: tabReducer,
    loading: loadingReducer,
    pageShell: pageShellReducer,
    pages: pageReducer,
    menus: menuReducer,
    authUser: authUserReducer,
    friends: friendsReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
