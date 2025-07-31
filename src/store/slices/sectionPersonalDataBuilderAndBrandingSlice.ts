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
      pageId: "cebaf439-4537-41b0-8ba9-52cfbfb0fa75",
      id: GenerateUUID(),
      text: "ขอความยินยอมให้ข้อมูลประวัติส่วนตัว",
      show: true, // ค่าเริ่มต้นของ show
    },
    {
      pageId: "cebaf439-4537-41b0-8ba9-52cfbfb0fa75",
      id: GenerateUUID(),
      text: "ขอความยินยอมให้ข้อมูลที่อยู่",
      show: true, // ค่าเริ่มต้นของ show
    },
  ],
  contents: [], // Initialize contents as an empty array
};

export const sectionPersonalDataBuilderAndBrandingSlice = createSlice({
  name: "sectionPersonalData",
  initialState,
  reducers: {
    setIntSection: (state) => {
      state.sections = initialState.sections; // รีเซ็ต section ให้เป็นค่าเริ่มต้น
    },
    setSectionsPersonalData: (state, action: PayloadAction<SectionItem[]>) => {
      state.sections = action.payload; // แทนที่ array ทั้งหมด
    },
    addSectionsPersonalData: (state, action: PayloadAction<SectionItem>) => {
      state.sections.push(action.payload); // เพิ่ม item ใหม่ใน array
    },
    updateSectionsPersonalData: (state, action) => {
      const { id, text, show } = action.payload;
      const index = state.sections.findIndex((section) => section.id === id);
      if (index !== -1) {
        state.sections[index] = { ...state.sections[index], text, show };
      }
    },
    removeSectionsPersonalData: (state, action: PayloadAction<string>) => {
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
    setUpdateShowhideSectionPersonalData: (
      state,
      action: PayloadAction<{ id: string; show: boolean }>
    ) => {
      const index = state.sections.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        // อัปเดตค่า show ใน state.sections
        state.sections[index].show = action.payload.show;
    
        console.log("Before updating contents:", state);
    
        // อัปเดตค่า hide ใน state.contents โดยเช็คจาก sectionId
        state.contents = state.contents.map((content) =>
          content.sectionId === action.payload.id
            ? { ...content, hide: !action.payload.show } // hide = !show
            :  { ...content, hide: true } 
        );
    
        console.log("After updating contents:", state.contents);
      }
    },

  },
});

export const getSectionById = (state: sectionState, sectionId: string,pageId:string) => {
  return state.sections.find((section) => section.id === sectionId && section.pageId === pageId) || null;
};

export const {
  setIntSection,
  setSectionsPersonalData,
  addSectionsPersonalData,
  updateSectionsPersonalData,
  removeSectionsPersonalData,
  setUpdateShowhideSectionPersonalData,
} = sectionPersonalDataBuilderAndBrandingSlice.actions;

export default sectionPersonalDataBuilderAndBrandingSlice.reducer;
