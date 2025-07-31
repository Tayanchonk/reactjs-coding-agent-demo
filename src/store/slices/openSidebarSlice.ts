// src/store/slices/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export const openSidebarSlice = createSlice({
  name: "opensidebar",
  initialState: {
    open: false,
  },
  reducers: {
    setOpenTrue: (state) => {
      state.open = true;
    },
    setOpenFalse: (state) => {
      state.open = false;
    },
    toggleOpen: (state) => {
      state.open = !state.open;
    },
  },
});

export const { setOpenTrue, setOpenFalse, toggleOpen } = openSidebarSlice.actions;

export default openSidebarSlice.reducer;
