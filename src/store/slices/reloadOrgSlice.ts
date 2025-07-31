// src/store/slices/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export const reloadOrgSlice = createSlice({
  name: "reloadorg",
  initialState: {
    reloadorg: false,
  },
  reducers: {
    setReloadOrgTrue: (state) => {
      state.reloadorg = !state.reloadorg;
    },
  
   
  },
});

export const { setReloadOrgTrue } = reloadOrgSlice.actions;

export default reloadOrgSlice.reducer;
