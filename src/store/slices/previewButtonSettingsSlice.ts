import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ButtonSettingsState {
    submitLabelButton: string;
    submitFontColor: string;
    submitBackgroundColor: string;
    submitConfirmAlert: string;
    cancelLabelButtonShow: boolean;
    cancelLabelButton: string;
    cancelFontColor: string;
    cancelBackgroundColor: string;

}


const initialState: ButtonSettingsState = {

    submitLabelButton: "Submit",
    submitFontColor: "#FFFFFF",
    submitBackgroundColor: "#007BFF",
    submitConfirmAlert: "Thank you for your submission.",
    cancelLabelButtonShow: true,
    cancelLabelButton: "Cancel",
    cancelFontColor: "#FFFFFF",
    cancelBackgroundColor: "#FF0000",
 

};

export const previewButtonSettingsSlice = createSlice({
  name: "previewButtonSettings",
  initialState,
  reducers: {
    setButtonSettings: (state, action: PayloadAction<Partial<ButtonSettingsState>>) => {
      Object.assign(state, action.payload); 
    },
    setIntButtonSettings: () => initialState,
  },
});

export const { setButtonSettings,setIntButtonSettings } = previewButtonSettingsSlice.actions;

export default previewButtonSettingsSlice.reducer;