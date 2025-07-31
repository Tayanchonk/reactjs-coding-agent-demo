import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface dateTimeFormatInterface {
  dateFormat: string;
  timeFormat: string;
  timeZoneName: string;
}

const initialState: dateTimeFormatInterface = {
  dateFormat: "",
  timeFormat: "",
  timeZoneName: ""
}

export const dateTimeFormatSlice = createSlice({
  name: "dateTimeFormat",
  initialState,
  reducers: {
    setDateTimeFormat: (state, action: PayloadAction<dateTimeFormatInterface>) => {
      return action.payload;
    }
  },
});

export const { setDateTimeFormat } = dateTimeFormatSlice.actions;
export default dateTimeFormatSlice.reducer;
