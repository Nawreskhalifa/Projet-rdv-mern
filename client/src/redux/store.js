import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './appointmentSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: { appointments: appointmentReducer, auth: authReducer }
});
