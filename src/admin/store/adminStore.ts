import { combineReducers } from '@reduxjs/toolkit';
import activeAdminPageReducer from './adminSlices/activeAdminPageSlice';
import adminAuthReducer from '../features/auth/authSlice';
import activeEditingPageReducer from '../features/pageEditor/slices/activeEditingPageSlice';
import activeEditingNodeReducer from '../features/pageEditor/slices/activeEditingNodeSlice';

const adminReducer = combineReducers({
  activeAdminPage: activeAdminPageReducer,
  adminAuth: adminAuthReducer,
  activeEditingPage: activeEditingPageReducer,
  activeEditingNode: activeEditingNodeReducer,
});

export default adminReducer;
