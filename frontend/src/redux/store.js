import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import modeSlice from "./modeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mode: modeSlice,
  },
});

export default store;
