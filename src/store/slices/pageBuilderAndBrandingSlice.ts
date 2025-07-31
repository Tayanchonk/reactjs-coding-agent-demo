import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageItem {
  pageId: string;
  pageType: string;
  pageName: string;
}

interface pageState {
  pages: PageItem[];
}

const initialState: pageState = {
  pages: [
    {
      pageId: "cebaf439-4537-41b0-8ba9-52cfbfb0fa75",
      pageType: "personal_data",
      pageName: "Personal Data - ข้อมูลส่วนบุคคล",
    },
    {
      pageId: "a839adc3-6e66-4d9e-9d2c-a787b90855ad",
      pageType: "consent_data",
      pageName: "Consent Data - ข้อมูลขอความยินยอม",
    },
  ],
};

export const pageBuilderAndBrandingSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    editPage: (
      state,
      action: PayloadAction<{ pageId: string; updates: Partial<PageItem> }>
    ) => {
      const { pageId, updates } = action.payload;
      const index = state.pages.findIndex((page) => page.pageId === pageId);
      if (index !== -1) {
        state.pages[index] = { ...state.pages[index], ...updates };
      }
    },
    getPage: (state, action: PayloadAction<string>): void => {
      const pageId = action.payload;
      state.pages.find((page) => page.pageId === pageId);
    },
    setPage: (state, action: PayloadAction<PageItem[]>) => {
      state.pages = action.payload; // แทนที่ข้อมูล pages ทั้งหมดด้วยข้อมูลใหม่
    },
    setIntPage: (state) => {
      state.pages = initialState.pages; // รีเซ็ต section ให้เป็นค่าเริ่มต้น
    },
  },
});

export const { editPage,getPage,setPage,setIntPage } = pageBuilderAndBrandingSlice.actions;

export default pageBuilderAndBrandingSlice.reducer;