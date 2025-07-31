import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OpenModalCFOrgState {
  openModal: boolean;
  idOrg: string | null;
  typeModal: string | null;
  data: object | null;
}

const initialState: OpenModalCFOrgState = {
  openModal: false,
  idOrg: null,
  typeModal: "",
  data: null,

};

interface OpenModalCfOrgPayload {
  idOrg: string;
  typeModal: string;
  data?: object | null;
  }

export const openModalCFOrgSlice = createSlice({
  name: "openModalCFOrg",
  initialState,
  reducers: {
    setOpenModalCFOrg: (state, action: PayloadAction<OpenModalCfOrgPayload>) => {
      state.openModal = true;
      state.idOrg = action.payload.idOrg;
      state.typeModal = action.payload.typeModal;
      state.data = action.payload.data;
    },
    setCloseModalCFOrg: (state) => {
      state.openModal = false;
      state.idOrg = null;
      state.typeModal = null;
      state.data = null;
    }
  },
});

export const { setOpenModalCFOrg, setCloseModalCFOrg } = openModalCFOrgSlice.actions;

export default openModalCFOrgSlice.reducer;