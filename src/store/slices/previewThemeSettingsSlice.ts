import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeSettingsState {
    themeSettings: {
        fontSize: string;
        fontColor: string;
        placeHolderColor: string;
        borderColor: string;
        backgroundColor: string;
        inActiveColor: string;
        activeColor: string;
    };
}

const initialState: ThemeSettingsState = {
    themeSettings: {
        fontSize: "16px",
        fontColor: "#000000",
        placeHolderColor: "#999999",
        borderColor: "#cccccc",
        backgroundColor: "#ffffff",
        inActiveColor: "#f0f0f0",
        activeColor: "#007bff",
    },
};

export const previewThemeSettingsSlice = createSlice({
  name: "themeSettings",
  initialState,
  reducers: {
    setThemeSettings: (state, action: PayloadAction<Partial<ThemeSettingsState["themeSettings"]>>) => {
      state.themeSettings = { ...state.themeSettings, ...action.payload }; // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setIntThemeSettings: (state) => {
      state.themeSettings = initialState.themeSettings; // อัปเดตค่าทั้งหมด
    }
  },
});

export const { setThemeSettings,setIntThemeSettings } = previewThemeSettingsSlice.actions;

export default previewThemeSettingsSlice.reducer;