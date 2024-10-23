import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Initial state of the auth slice
const initialState = {
  value: Cookies.get("mode") === "dark" ? true : false,
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    toggleMode(state, action) {
      state.value = !state.value;
      Cookies.set("mode", state.value ? "dark" : "light", {
        expires: 7,
      });
    },
  },
});

// Export the actions
export const { toggleMode } = modeSlice.actions;

// Export the reducer
export default modeSlice.reducer;
