import { createSlice } from "@reduxjs/toolkit";

// Initial state of the auth slice
const initialState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload; // User info can be passed here
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

// Export the actions
export const { login, logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
