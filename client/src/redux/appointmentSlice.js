import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    setAppointments: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAppointment: (state, action) => {
      state.items.push(action.payload);
      state.items.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    },
    removeAppointment: (state, action) => {
      state.items = state.items.filter((a) => a._id !== action.payload);
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { setAppointments, addAppointment, removeAppointment, setLoading, setError } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;
