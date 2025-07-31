import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Logo from "../../assets/mcf-logo.svg";

interface HeaderState {
  show: boolean;
  bgColor: string;
  logo: string;
  favicon: string;
  altLogo: string;
}

interface FooterState {
  show: boolean;
  backgroundColor: string;
  footerContent: string;
}

interface PreviewHeaderAndFooterState {
  header: HeaderState;
  footer: FooterState;
}

const initialState: PreviewHeaderAndFooterState = {
  header: {
    show: true,
    bgColor: "#000",
    logo: "",
    favicon: "",
    altLogo: "logo",
  },
  footer: {
    show: true,
    backgroundColor: "#fff",
    footerContent:
      "<p>Copyright 2018 Metro Systems Corporation Public Company Limited | All Rights Reserved</p>",
  },
};

export const previewHeaderAndFooterSlice = createSlice({
  name: "previewHeaderAndFooter",
  initialState,
  reducers: {
    setHeaderShow: (state, action: PayloadAction<Partial<HeaderState>>) => {
      state.header = { ...state.header, ...action.payload }; // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setHeaderBgColor: (state, action: PayloadAction<string>) => {
      state.header.bgColor = action.payload; // อัปเดตสีพื้นหลังของ header
    },
    setHeaderLogo: (state, action: PayloadAction<string>) => {
      state.header.logo = action.payload; // อัปเดตโลโก้ของ header
    },
    setHeaderFavicon: (state, action: PayloadAction<string>) => {
      state.header.favicon = action.payload; // อัปเดต favicon ของ header
    },
    setHeaderAltLogo: (state, action: PayloadAction<string>) => {
      state.header.altLogo = action.payload; // อัปเดตโลโก้สำรองของ header
    },
    setFooterShow: (state, action: PayloadAction<Partial<FooterState>>) => {
      state.footer = { ...state.footer, ...action.payload }; // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setFooterBackgroundColor: (state, action: PayloadAction<string>) => {
      state.footer.backgroundColor = action.payload; // อัปเดตเนื้อหาของ footer
    },
    setFooterContent: (state, action: PayloadAction<string>) => {
      state.footer.footerContent = action.payload; // อัปเดตเนื้อหาของ footer
    },

    setIntHeaderAndFooter: (state) => {
      state.header = initialState.header; // อัปเดตค่าทั้งหมด
      state.footer = initialState.footer; // อัปเดตค่าทั้งหมด
    },
  },
});

export const {
  setHeaderShow,
  setHeaderBgColor,
  setHeaderLogo,
  setHeaderFavicon,
  setFooterShow,
  setFooterContent,
  setFooterBackgroundColor,
  setHeaderAltLogo,
  setIntHeaderAndFooter
} = previewHeaderAndFooterSlice.actions;

export default previewHeaderAndFooterSlice.reducer;
