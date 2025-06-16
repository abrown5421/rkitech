import { combineReducers } from '@reduxjs/toolkit';
import activeClientPageReducer from '../features/pages/activeClientPageSlice';

const clientReducer = combineReducers({
  activeClientPage: activeClientPageReducer
});

export default clientReducer;
