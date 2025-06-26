import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../admin/store/adminStore';
import clientReducer from '../client/store/clientStore';
// import initReducer from '../init/store/initStore';
import activeModuleReducer from './globalSlices/activeModules/activeModuleSlice';
import initialAppReducer from './globalSlices/initialApp/initialAppSlice';
import drawerReducer from '../components/drawer/drawerSlice';
import alertReducer from '../components/alert/alertSlice';
import modalReducer from '../components/modal/modalSlice';
import loadingReducer from './globalSlices/loadingObject/loadingObjectSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer, 
    client: clientReducer,
    // init: initReducer,
    activeModule: activeModuleReducer,
    initialApp: initialAppReducer,
    drawer: drawerReducer,
    alert: alertReducer,
    modal: modalReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
