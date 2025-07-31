import { ur } from "@faker-js/faker/.";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuBreadcrumbState {
  title: string;
  url: string;
}

export const menuBreadcrumbSlice = createSlice({
  name: "menuBreadcrumb",
  initialState: <MenuBreadcrumbState[]>([]),
  reducers: {
    setMenuBreadcrumb: (state, action: PayloadAction<MenuBreadcrumbState[]>) => {
      return action.payload;
    }
  },
});

export const { setMenuBreadcrumb } = menuBreadcrumbSlice.actions;
export default menuBreadcrumbSlice.reducer;
