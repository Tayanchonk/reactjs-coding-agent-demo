import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PreferencePurposeRequest } from "../../interface/purpose.interface";

export const preferencePurposeSlice = createSlice({
  name: "preferencePurpose",
  initialState: {
    preferencePurpose: {} as PreferencePurposeRequest,
    managePreferencePurpose: {
      id: "",
    },
  },
  reducers: {
    setPreferencePurposeSlice: (
      state,
      action: PayloadAction<PreferencePurposeRequest>
    ) => {
      state.preferencePurpose = action.payload;
    },
    setManagePreferencePurposeSlice: (state, action) => {
      state.managePreferencePurpose = action.payload;
    },
  },
});

export const { setPreferencePurposeSlice, setManagePreferencePurposeSlice } =
  preferencePurposeSlice.actions;

export default preferencePurposeSlice.reducer;
