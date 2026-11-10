import { createSlice } from '@reduxjs/toolkit';

// Au demarrage, on relit la session sauvegardee (reste connecte apres F5)
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
