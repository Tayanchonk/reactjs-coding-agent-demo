import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModuleState {
  link: string;
  icon: string;
  name: string;
  path: string;
}

export const module = createSlice({
  name: "Module",
  initialState: <ModuleState[]>[],
  reducers: {
    setModules: (state, action: PayloadAction<ModuleState[]>) => {
      return action.payload;
    },
  },
});

export const { setModules } = module.actions;
export default module.reducer;
