import { createSlice } from '@reduxjs/toolkit';

// types
import { AuthProps } from '@type/auth';

// initial state
export const initialState: AuthProps = {
  isInitialized: false,
  isLoggedIn: false,
  user: null,
};

// ==============================|| SLICE - MENU ||============================== //
const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    actionLogin(state, action) {
      state.isInitialized = true;
      state.isLoggedIn = true;
      state.user = action.payload.user;
      window.localStorage.setItem('token', action.payload.token);
    },
    actionLogout(state) {
      state.isInitialized = true;
      state.isLoggedIn = false;
      state.user = null;
      window.localStorage.removeItem('token');
    },
    actionUpdateUser(state, action) {
      state.isInitialized = true;
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
  },
});

export default auth.reducer;

export const { actionLogin, actionLogout, actionUpdateUser } = auth.actions;
