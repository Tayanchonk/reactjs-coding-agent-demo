import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OpenDrawerState {
  openDrawer: boolean;
  id: string | null;
  type: string | null;
  isParent: boolean;
}

const initialState: OpenDrawerState = {
  openDrawer: false,
  id: null,
  type: "",
  isParent: false
};

interface OpenDrawerPayload {
    id: string;
    type: string;
    isParent: boolean;
  }

export const openDrawerCreateOrgSlice = createSlice({
  name: "openDrawerCreateOrg",
  initialState,
  reducers: {
    setOpenDrawerOrgCreate: (state, action: PayloadAction<OpenDrawerPayload>) => {
      state.openDrawer = true;
      state.id = action.payload.id;
      state.type = action.payload.type;
      state.isParent = action.payload.isParent;
    },
    setCloseDrawerOrgCreate: (state) => {
      state.openDrawer = false;
      state.id = null;
      state.type = null;
      state.isParent = false;
    }
  },
});

export const { setOpenDrawerOrgCreate, setCloseDrawerOrgCreate } = openDrawerCreateOrgSlice.actions;

export default openDrawerCreateOrgSlice.reducer;