import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomCssState {
  customCssURL: string;
  customCss: string;
}

const initialState: CustomCssState = {
  customCssURL: "--https://yourdomain.com/custom.css",
  customCss: "--.custom-class { color: red; }",
 
};

export const previewCustomCssSlice = createSlice({
  name: "customCss",
  initialState,
  reducers: {
    setCustomCss: (
      state,
      action: PayloadAction<Partial<CustomCssState>>
    ) => {
      Object.assign(state, action.payload); // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setIntCustomCss: (state) => {
      state = initialState; // รีเซ็ตค่าเป็นค่าเริ่มต้น
    },
  },
});

export const { setCustomCss,setIntCustomCss } =
previewCustomCssSlice.actions;

export default previewCustomCssSlice.reducer;
