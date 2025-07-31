import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface dataBuilderAndBrandingItem {
  data: any;
}

interface DataBuilderAndBrandingState {
  dataBuilderAndBranding: dataBuilderAndBrandingItem[];
  dataSelectionPreview: {
    pageId: string;
    sectionId: string;
  };
}

const initialState: DataBuilderAndBrandingState = {
  dataBuilderAndBranding: [],
  dataSelectionPreview: {
    pageId: "",
    sectionId: "",
  },
};

export const dataBuilderAndBrandingSlice = createSlice({
  name: "dataBuilderAndBranding",
  initialState,
  reducers: {
    setDataBuilderAndBranding: (state, action: PayloadAction<any>) => {
      Object.assign(state, action.payload); // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setDataSelectionPreview: (
      state,
      action: PayloadAction<{ pageId: string; sectionId: string }>
    ) => {
      const { pageId, sectionId } = action.payload;

      // อัปเดต state.dataSelectionPreview ให้เป็น object
      state.dataSelectionPreview = {
        pageId,
        sectionId,
      };
    },
  },
});

export const { setDataBuilderAndBranding, setDataSelectionPreview } =
  dataBuilderAndBrandingSlice.actions;

export default dataBuilderAndBrandingSlice.reducer;
