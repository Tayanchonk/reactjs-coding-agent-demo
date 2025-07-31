import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface currentUserInterface {
  user_account_id: string;
  first_name: string;
  last_name: string;
  customer_id: string;
  job_title: string;
  manager: string;
  email: string;
  profile_image_base64: string;
}

const initialState: currentUserInterface = {
  user_account_id: "",
  first_name: "",
  last_name: "",
  customer_id: "",
  job_title: "",
  manager: "",
  email: "",
  profile_image_base64: "",
}

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<currentUserInterface>) => {
      return action.payload;
    }
  },
});

export const { setCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
