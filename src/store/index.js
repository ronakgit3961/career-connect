import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './slices/jobsSlice';
import cartReducer from './slices/cartSlice';
import applicationsReducer from './slices/applicationsSlice';
import asyncStateReducer from './slices/asyncStateSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    cart: cartReducer,
    applications: applicationsReducer,
    asyncState: asyncStateReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
