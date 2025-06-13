import { configureStore } from '@reduxjs/toolkit';
// import adminReducer from '../admin/store/adminStore';
// import clientReducer from '../client/store/clientStore';
// import initReducer from '../init/store/initStore';
import activeModuleReducer from './globalSlices/activeModules/activeModuleSlice';

export const store = configureStore({
  reducer: {
    // admin: adminReducer, 
    // client: clientReducer,
    // init: initReducer,
    activeModule: activeModuleReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
