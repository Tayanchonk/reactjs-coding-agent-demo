import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const menuHeaderSlice = createSlice({
  name: "menuHeader",
  initialState: "",
  reducers: {
    setMenuHeader: (state, action: PayloadAction<string>) => {
      return action.payload;
    }
  },
});

export const { setMenuHeader } = menuHeaderSlice.actions;
export default menuHeaderSlice.reducer;
