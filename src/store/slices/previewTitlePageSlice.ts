import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TitlePageState {
  showTitle: boolean; // เพิ่มตัวแปร showTitle เพื่อควบคุมการแสดงชื่อเรื่อง
  pageTitle: string;
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
  backgroundType: string;
  backgroundImg : string;
}

interface PreviewTitlePageState {
    titlePage: TitlePageState;
}

const initialState: PreviewTitlePageState = {
  titlePage: {
    showTitle: true, // เพิ่มค่า showTitle เพื่อควบคุมการแสดงชื่อเรื่อง
    pageTitle: "Metro Systems",
    fontSize: "12px",
    fontColor: "#fff",
    backgroundColor: "#463DE1",
    backgroundType: "Color",
    backgroundImg : "",
  },
};

export const previewTitlePageSlice = createSlice({
  name: "previewTitlePage",
  initialState,
  reducers: {
    setTitlePage: (state, action: PayloadAction<Partial<TitlePageState>>) => {
      state.titlePage = { ...state.titlePage, ...action.payload }; // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setIntTitlePage: (state) => {
      state.titlePage = initialState.titlePage; // อัปเดตค่าทั้งหมด
    }
  },
});

export const { setTitlePage,setIntTitlePage } = previewTitlePageSlice.actions;

export default previewTitlePageSlice.reducer;