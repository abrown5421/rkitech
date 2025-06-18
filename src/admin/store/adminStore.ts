import { combineReducers } from '@reduxjs/toolkit';
import activeAdminPageReducer from './adminSlices/activeAdminPageSlice';

const adminReducer = combineReducers({
  activeAdminPage: activeAdminPageReducer
});

export default adminReducer;
