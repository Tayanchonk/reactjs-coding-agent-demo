import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChildMenuItem {
  url: string;
  menuName: string;
}

const initialState: ChildMenuItem[] = [];

export const childMenuSlice = createSlice({
  name: "childmenu",
  initialState,
  reducers: {
    setChildMenu: (state, action: PayloadAction<ChildMenuItem[]>) => {
      return action.payload;
    },
    addChildMenu: (state, action: PayloadAction<ChildMenuItem>) => {
      state.push(action.payload);
    },
    removeChildMenu: (state, action: PayloadAction<string>) => {
      return state.filter(menu => menu.url !== action.payload);
    },
    clearChildMenu: () => {
      return [];
    },
  },
});

export const { setChildMenu, addChildMenu, removeChildMenu, clearChildMenu } = childMenuSlice.actions;

export default childMenuSlice.reducer;
