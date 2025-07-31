import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface sessionInterface {
  enableSessionProtection: boolean;
  sessionTimeoutTimeType: string;
  sessionTimeoutDuration: number;
  enableRememberLastOrganization: boolean;
}

const initialState: sessionInterface = {
  enableSessionProtection: false,
  sessionTimeoutTimeType: "",
  sessionTimeoutDuration: 0,
  enableRememberLastOrganization: false
}

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<sessionInterface>) => {
      return action.payload;
    }
  },
});

export const { setSession } = sessionSlice.actions;
export default sessionSlice.reducer;
