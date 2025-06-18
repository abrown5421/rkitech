import { combineReducers } from '@reduxjs/toolkit';
import activeAdminPageReducer from './adminSlices/activeAdminPageSlice';
import adminAuthReducer from '../features/auth/authSlice';

const adminReducer = combineReducers({
  activeAdminPage: activeAdminPageReducer,
  adminAuth: adminAuthReducer
});

export default adminReducer;
