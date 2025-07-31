// src/store/slices/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },
  reducers: {
    setOpenLoadingTrue: (state) => {
      state.loading = true;
    },
    setOpenLoadingFalse: (state) => {
      state.loading = false;
    },
    toggleOpenLoading: (state) => {
      state.loading = !state.loading;
    },
  },
});

export const { setOpenLoadingTrue, setOpenLoadingFalse, toggleOpenLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
