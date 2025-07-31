import { createSlice } from "@reduxjs/toolkit";

export const showSearchSlice = createSlice({
  name: "showSearch",
  initialState: {
    value: false,
  },
  reducers: {
    setShowSearchTrue: (state) => {
      state.value = true;
    },
    setShowSearchFalse: (state) => {
      state.value = false;
    },
    toggleShowSearch: (state) => {
      state.value = !state.value;
    },
  },
});

export const { setShowSearchTrue, setShowSearchFalse, toggleShowSearch } = showSearchSlice.actions;

export default showSearchSlice.reducer;