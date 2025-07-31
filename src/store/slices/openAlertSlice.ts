import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
  openAlert: boolean;
  description: string | null;
  typeAlert: string | null;
}

const initialState: AlertState = {
    openAlert: false,
    description: "",
    typeAlert: ""
};

interface AlertPayload {
    description: string | null;
    typeAlert: string | null;
  }

export const OpenalertSlice = createSlice({
  name: "openalert",
  initialState,
  reducers: {
    setOpenAlert: (state, action: PayloadAction<AlertPayload>) => {
      state.openAlert = true;
      state.description = action.payload.description;
      state.typeAlert = action.payload.typeAlert;
    },
    setCloseAlert: (state) => {
      state.openAlert = false;
      state.description = "";
      state.typeAlert = "";
    }
  },
});

export const { setOpenAlert, setCloseAlert } = OpenalertSlice.actions;

export default OpenalertSlice.reducer;