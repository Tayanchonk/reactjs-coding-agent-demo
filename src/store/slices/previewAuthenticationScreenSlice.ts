import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthenticationScreenState {
  authenScreenShow: boolean;
  verifyTitle: string;
  verifyDescription: string;
  verifyLabelButton: string;
  verifyFontSize: string;
  verifyFontColor: string;
  verifyBackgroundColor: string;
  logoutScreenShow: boolean;
  logoutTitle: string;
  logoutDescription: string;
}

const initialState: AuthenticationScreenState = {
  authenScreenShow: true,
  verifyTitle: "Verify",
  verifyDescription: "Please enter your identifier.",
  verifyLabelButton: "Verify",
  verifyFontSize: "16px",
  verifyFontColor: "#000000",
  verifyBackgroundColor: "#FFFFFF",
  logoutScreenShow: true,
  logoutTitle: "Logout",
  logoutDescription: "Are you sure you want to logout?",
};

export const previewAuthenticationScreenSlice = createSlice({
  name: "authenticationScreen",
  initialState,
  reducers: {
    setAuthenticationScreen: (
      state,
      action: PayloadAction<Partial<AuthenticationScreenState>>
    ) => {
      Object.assign(state, action.payload); // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setIntAuthenticationScreen: (state) => {
      state = initialState; // รีเซ็ตค่าเป็นค่าเริ่มต้น
    },
  },
});

export const { setAuthenticationScreen,setIntAuthenticationScreen } =
  previewAuthenticationScreenSlice.actions;

export default previewAuthenticationScreenSlice.reducer;
