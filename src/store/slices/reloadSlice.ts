// src/store/slices/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export const reloadSlice = createSlice({
  name: "reload",
  initialState: {
    reload: false,
  },
  reducers: {
    setReloadTrue: (state) => {
      state.reload = true;
    },
    setReloadFalse: (state) => {
      state.reload = false;
    },
   
  },
});

export const { setReloadTrue, setReloadFalse } = reloadSlice.actions;

export default reloadSlice.reducer;
