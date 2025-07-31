import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContentItem {
  sectionId: string; // id ของ section ที่ content นี้อยู่
  fieldTypeId: string; // id ของ field type
  fieldTypeName: string; // ชื่อของ field type
  ContentId: string; // id ของ content
  element: Record<string, any>; // รองรับข้อมูล dynamic (JSON object)
  hide: boolean; // สถานะการแสดงผล
  isRequired: boolean; // สถานะการบังคับกรอกข้อมูล
  isIdentifier: boolean; // สถานะการเป็นข้อมูลส่วนบุคคล
}

interface ContentState {
  contents: ContentItem[];
  filteredContents: ContentItem[];
}

const initialState: ContentState = {
  contents: [],
  filteredContents: [],
};

export const contentConsentDataBuilderAndBrandingSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    // แทนที่ array ทั้งหมดสำหรับ sectionId ที่กำหนด
    setContentsConsentData: (
      state,
      action: PayloadAction<{ sectionId: string; contents: ContentItem[] }>
    ) => {
      const { sectionId, contents } = action.payload;
      state.contents = state.contents.filter(
        (item) => item.sectionId !== sectionId
      ); // ลบรายการที่มี sectionId เดิม
      state.contents.push(...contents); // เพิ่มรายการใหม่ที่ตรงกับ sectionId
    },

    // เพิ่ม content ใหม่สำหรับ sectionId ที่กำหนด
    addContentConsentData: (
      state,
      action: PayloadAction<{ sectionId: string; content: ContentItem }>
    ) => {
      const { sectionId, content } = action.payload;

      if (content.sectionId === sectionId) {
        // ตรวจสอบว่าข้อมูลใหม่มี isIdentifier = true หรือไม่
        if (content.isIdentifier) {
          // อัปเดตข้อมูลเก่าใน state ให้ isIdentifier = false
          state.contents = state.contents.map((existingContent) =>
            existingContent.sectionId === sectionId
              ? { ...existingContent, isIdentifier: false }
              : existingContent
          );
        }

        // เพิ่มข้อมูลใหม่เข้าไปใน state
        state.contents.push(content);
      }
    },

    // อัปเดต content ที่มีอยู่สำหรับ sectionId ที่กำหนด
    updateContentConsentData: (
      state,
      action: PayloadAction<{
        sectionId: string;
        id: string;
        element: Record<string, any>;
        hide?: boolean;
        isRequired?: boolean;
        isIdentifier?: boolean;
        fieldTypeId?: string;
        fieldTypeName?: string;
      }>
    ) => {
      const {
        sectionId,
        id,
        element,
        hide,
        isRequired,
        isIdentifier,
        fieldTypeId,
        fieldTypeName,
      } = action.payload;
      const index = state.contents.findIndex(
        (content) => content.ContentId === id && content.sectionId === sectionId
      );
      if (index !== -1) {
        state.contents[index] = {
          ...state.contents[index],
          element: { ...element },
          ...(hide !== undefined && { hide }),
          ...(isRequired !== undefined && { isRequired }),
          ...(isIdentifier !== undefined && { isIdentifier }),
          ...(fieldTypeId !== undefined && { fieldTypeId }),
          ...(fieldTypeName !== undefined && { fieldTypeName }),
        };
        if (isIdentifier === true) {
          state.contents = state.contents.map((content, idx) =>
            idx === index
              ? content // Keep the updated content as is
              : { ...content, isIdentifier: false } // Set isIdentifier to false for others
          );
        }
      }
    },

    // ลบ content สำหรับ sectionId ที่กำหนด
    removeContentConsentData: (
      state,
      action: PayloadAction<{ sectionId: string; id: string }>
    ) => {
      const { sectionId, id } = action.payload;
      state.contents = state.contents.filter(
        (item) => item.ContentId !== id || item.sectionId !== sectionId
      );
    },

    // อัปเดตสถานะ show/hide สำหรับ sectionId ที่กำหนด
    setContentShowHideConsentData: (
      state,
      action: PayloadAction<{ sectionId: string; id: string; hide: boolean }>
    ) => {
      const { sectionId, id, hide } = action.payload;
      const index = state.contents.findIndex(
        (item) => item.ContentId === id && item.sectionId === sectionId
      );
      if (index !== -1) {
        state.contents[index].hide = hide;
      }
    },
    setFilteredContentsConsentData: (state, action: PayloadAction<ContentItem[]>) => {
      if (
        JSON.stringify(state.filteredContents) !==
        JSON.stringify(action.payload)
      ) {
        state.filteredContents = action.payload; // อัปเดตเฉพาะเมื่อข้อมูลเปลี่ยนแปลง
      }
    },
  },
});
export const getContentConsentDataBySectionId = (state: ContentState, sectionId: string) =>
  state.contents.filter((content) => content.sectionId === sectionId);

export const getContentConsentDataByContentId = (state: ContentState, ContentId: string) =>
  state.contents.filter((content) => content.ContentId === ContentId);

export const { setFilteredContentsConsentData } = contentConsentDataBuilderAndBrandingSlice.actions;

export const {
  setContentsConsentData,
  addContentConsentData,
  updateContentConsentData,
  removeContentConsentData,
  setContentShowHideConsentData,
} = contentConsentDataBuilderAndBrandingSlice.actions;

export default contentConsentDataBuilderAndBrandingSlice.reducer;
