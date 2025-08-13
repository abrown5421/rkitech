import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../shared/features/modal/modalSlice';
import alertReducer from '../shared/features/alert/alertSlice';
import drawerReducer from '../shared/features/drawer/drawerSlice';
import pageShellReducer from '../shared/features/pages/pageShellSlice';
import pageReducer from '../shared/features/pages/pagesSlice';
import authUserReducer from '../client/features/auth/clientAuthUserSlice';
import tabReducer from '../shared/features/tabs/tabSlice';
import friendsReducer from '../client/features/friends/myFriendSlice';
import notificationReducer from '../client/features/notifications/notificationSlice';
import theirFriendsReducer from '../client/features/friends/theirFriendSlice';
import loadingReducer from './globalSlices/loading/loadingSlice';
import menuReducer from '../client/features/menus/menusSlice';
import adminAuthUserReducer from '../admin/features/auth/adminAuthUserSlice';
import blogReducer from '../client/features/blog/blogSlice';
import staffReducer from '../client/features/staff/staffSlice';
import galleryReducer from '../client/features/gallery/gallerySlice';
import homePageIdReducer from './globalSlices/homePageId/homePageIdSlice';

export const store = configureStore({
  reducer: {
    homePageId: homePageIdReducer,
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
    theirFriends: theirFriendsReducer,
    notifications: notificationReducer,
    blog: blogReducer,
    staff: staffReducer,
    gallery: galleryReducer,
    adminAuthUser: adminAuthUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;