import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialOrgParent = "";
localStorage.setItem("orgParent", initialOrgParent);

export const orgParentSlice = createSlice({
  name: "orgParent",
  initialState: {
    orgParent: initialOrgParent,
  },
  reducers: {
    setOrgParent: (state, action: PayloadAction<string>) => {
      state.orgParent = action.payload;
      localStorage.setItem("orgParent", action.payload);
    }
  },
});

export const { setOrgParent } = orgParentSlice.actions;

export default orgParentSlice.reducer;