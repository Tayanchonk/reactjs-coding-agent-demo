import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterItem {
  filterId: string;
  id: string; // Optional field for ConsentReportFieldId
  filterCode: string; // Optional field for filter code
  filterName: string;
  filterType: string;
  operator: any; // Optional operator field
  filterValue: any;
  status: 'draft' | 'save'; // เพิ่ม status
}

interface FilterState {
  filterItem: FilterItem[];
  filterById: FilterItem | null; // New state for storing filter by ID
}

const initialState: FilterState = {
  filterItem: [],
  filterById: null, // Initialize filterById as null
};

export const filterReportDataSubjectSlice = createSlice({
  name: "filterReportDataSubject",
  initialState,
  reducers: {
    // Reset contents to default state
    resetFilter: (state) => {
      state.filterItem = []; // Reset filterItem to an empty array
    },
    // เพิ่ม content ใหม่สำหรับ sectionId ที่กำหนด
    setFilter: (
      state,
      action: PayloadAction<{
        filterId: string;
        id: string; // Optional field for ConsentReportFieldId
        filterCode: string; // Optional field for filter code
        filterName: string;
        filterType: string;
        operator: any; // Optional operator field
        filterValue: any;
        status?: 'draft' | 'save'; // เพิ่ม status optional
      }>
    ) => {
      const { filterId, id,filterCode, filterName, filterType, filterValue, operator, status } = action.payload;
      // Directly add the new filter item without checking for existing ones
      state.filterItem.push({ filterId, id, filterCode,  filterName, filterType, filterValue, operator, status: status || 'draft' });
    },
    setAllFilterStatusSave: (state) => {
      state.filterItem = state.filterItem.map(item => ({ ...item, status: 'save' }));
    },
    getFilterById: (state, action: PayloadAction<string>) => {
      const filterIdToFind = action.payload;
      const filterItem = state.filterItem.find(
        (item) => item.filterId === filterIdToFind
      );
      state.filterById = filterItem || null; // Update filterById state
    },
    deleteFilter: (state, action: PayloadAction<string>) => {
      const filterIdToDelete = action.payload;
      const indexToDelete = state.filterItem.findIndex(
        (item) => item.filterId === filterIdToDelete
      );
      if (indexToDelete !== -1) {
        state.filterItem.splice(indexToDelete, 1); // ลบรายการที่ตรงกับ filterId
      }
    },
    updateFilter: (
      state,
      action: PayloadAction<{
        filterId: string;
        id: string; 
        filterCode: string; // Optional field for filter code
        filterName?: string;
        filterType?: string;
        operator?: any;
        filterValue?: any;
        status?: 'draft' | 'save';
      }>
    ) => {
      const { filterId, id, filterCode,filterName, filterType, operator, filterValue, status } = action.payload;
      const filterIndex = state.filterItem.findIndex(
        (item) => item.id === id
      );
      console.log("🚀 ~ filterIndex:", filterIndex)

      if (filterIndex !== -1) {
        const updatedFilter = {
          ...state.filterItem[filterIndex],
          ...(filterId && { filterId }),
          ...(filterCode && { filterCode }),
          ...(filterName && { filterName }),
          ...(filterType && { filterType }),
          ...(operator && { operator }),
          ...(filterValue && { filterValue }),
          ...(status && { status }),
        };

        state.filterItem[filterIndex] = updatedFilter;
      }
    },
    updateAllStatusToSave: (state) => {
      state.filterItem = state.filterItem.map((item) => ({
        ...item,
        status: 'save',
      }));
    },
  },
});


export const { resetFilter, setFilter, deleteFilter, getFilterById, setAllFilterStatusSave, updateFilter, updateAllStatusToSave } =
  filterReportDataSubjectSlice.actions;

export default filterReportDataSubjectSlice.reducer;
