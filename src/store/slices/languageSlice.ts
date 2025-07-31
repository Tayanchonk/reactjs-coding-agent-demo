// src/store/slices/languageSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: "en",
  },
  reducers: {
    setLanguageEn: (state) => {
   
      
      state.language = "en";
    },
    setLanguageTh: (state) => {
      state.language = "th";
    },
  },
});

export const { setLanguageEn, setLanguageTh } = languageSlice.actions;

export default languageSlice.reducer;