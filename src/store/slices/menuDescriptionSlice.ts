import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const menuDescriptionSlice = createSlice({
  name: "menuDescription",
  initialState: "",
  reducers: {
    setMenuDescription: (state, action: PayloadAction<string>) => {
      return action.payload;
    }
  },
});

export const { setMenuDescription } = menuDescriptionSlice.actions;
export default menuDescriptionSlice.reducer;
