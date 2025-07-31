import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenerateUUID } from "../../utils/Utils";

interface DataSubjectPurposeState {
  statusRetriveMode: string;
}

const initialState: DataSubjectPurposeState = {
  statusRetriveMode: "All",
};

export const dataSubjectSlice = createSlice({
  name: "statusRetriveMode",
  initialState,
  reducers: {
    setIntDataSubjectPurpose: (state) => {
      state.statusRetriveMode = initialState.statusRetriveMode; // รีเซ็ต datasubjectpurpose ให้เป็นค่าเริ่มต้น
    },
    setDataSubjectPurpose: (state, action: PayloadAction<string>) => {
      state.statusRetriveMode = action.payload; // แทนที่ array ทั้งหมด
    },
  },
});

export const { setIntDataSubjectPurpose, setDataSubjectPurpose } =
dataSubjectSlice.actions;

export default dataSubjectSlice.reducer;
