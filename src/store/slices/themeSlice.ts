import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: false,
    themeColor: {
      mainColor: "#000", // default main theme color
      secondColor: '#3758F9', // default second theme color
    },
  },
  reducers: {
   
    setThemeColors: (state, action) => {
      state.themeColor.mainColor = action.payload.maincolor; // set main theme color
      state.themeColor.secondColor = action.payload.secondColor; // set second theme color
    },
  },
});

export const { setThemeColors } = themeSlice.actions;

export default themeSlice.reducer;