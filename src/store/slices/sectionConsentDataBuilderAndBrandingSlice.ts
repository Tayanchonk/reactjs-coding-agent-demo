import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenerateUUID } from "../../utils/Utils";
interface SectionItem {
  pageId: string;
  id: string;
  text: string;
  show: boolean; // เพิ่ม field show
}

interface sectionState {
  sections: SectionItem[];
  contents: any[]; // Add the 'contents' property
}

const initialState: sectionState = {
  sections: [
    {
      pageId: "a839adc3-6e66-4d9e-9d2c-a787b90855ad",
      id: GenerateUUID(),
      text: "ขอความยินยอมให้ข้อมูลสุขภาพ",
      show: true, // ค่าเริ่มต้นของ show
    },
    {
      pageId: "a839adc3-6e66-4d9e-9d2c-a787b90855ad",
      id: GenerateUUID(),
      text: "ขอความยินยอมให้ข้อมูลศาสนา",
      show: true, // ค่าเริ่มต้นของ show
    },
  ],
  contents: [], // Initialize contents as an empty array
};

export const sectionConsentDataBuilderAndBrandingSlice = createSlice({
  name: "sectionConsentData",
  initialState,
  reducers: {
    setIntSectionConsentData: (state) => {
      state.sections = initialState.sections; // รีเซ็ต section ให้เป็นค่าเริ่มต้น
    },
    setSectionsConsentData: (state, action: PayloadAction<SectionItem[]>) => {
      state.sections = action.payload; // แทนที่ array ทั้งหมด
    },
    addSectionsConsentData: (state, action: PayloadAction<SectionItem>) => {
      state.sections.push(action.payload); // เพิ่ม item ใหม่ใน array
    },
    updateSectionsConsentData: (state, action) => {
      const { id, text, show } = action.payload;
      const index = state.sections.findIndex((section) => section.id === id);
      if (index !== -1) {
        state.sections[index] = { ...state.sections[index], text, show };
      }
    },
    removeSectionsConsentData: (state, action: PayloadAction<string>) => {
      // Ensure sections is defined and filter items
      if (state.sections) {
        state.sections = state.sections.filter(
          (item) => item.id !== action.payload
        );
      }

      // Ensure contents is defined and filter items
      if (state.contents) {
        state.contents = state.contents.filter(
          (content) => content.sectionId !== action.payload
        );
      }
    },
    setUpdateShowhideSectionConsentData: (
      state,
      action: PayloadAction<{ id: string; show: boolean }>
    ) => {
      const index = state.sections.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.sections[index].show = action.payload.show; // อัปเดตค่า show
      }
    },
  },
});

export const getSectionById = (state: sectionState, sectionId: string,pageId: string) => {
  return state.sections.find((section) => section.id === sectionId && section.pageId === pageId) || null;
};

export const {
  setIntSectionConsentData,
  setSectionsConsentData,
  addSectionsConsentData,
  updateSectionsConsentData,
  removeSectionsConsentData,
  setUpdateShowhideSectionConsentData,
} = sectionConsentDataBuilderAndBrandingSlice.actions;

export default sectionConsentDataBuilderAndBrandingSlice.reducer;
