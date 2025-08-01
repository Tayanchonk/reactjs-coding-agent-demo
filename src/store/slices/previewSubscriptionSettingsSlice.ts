import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionSettingsState {
  subScriptionSettingsShow: boolean;
  subscriptionTitle: string;
  subScribeAllShow: boolean;
  subscribeAllLabel: string;
  unSubscribeAllShow: boolean;
  unSubscribeAllLabel: string;
  unSubscribeReasonShow: boolean;
  trigerUnSubscribeReason: string;
  unSubscribeReasonTitle: string;
  unSubscribeReasonTitleDescription: string;
  unSubscribeReasonLabelButton: string;
  unSubscribeReasonFontSize: string;
  unSubscribeReasonFontColor: string;
  unSubscribeReasonBackgroundColor: string;
  unSubscribeReason: [{
    value: string;
    label: string;
  }];
  unSubscribeReasonRequired: boolean;
}

const initialState: SubscriptionSettingsState = {
  subScriptionSettingsShow: true,
  subscriptionTitle: "Subscription Settings",
  subScribeAllShow: true,
  subscribeAllLabel: "Subscribe All",
  unSubscribeAllShow: true,
  unSubscribeAllLabel: "Unsubscribe All",
  unSubscribeReasonShow: false,
  trigerUnSubscribeReason: "Unsubscribe All",
  unSubscribeReasonTitle: "Unsubscribe Reason",
  unSubscribeReasonTitleDescription:
    "Please provide a reason for unsubscribing.",
  unSubscribeReasonLabelButton: "Submit",
  unSubscribeReasonFontSize: "16px",
  unSubscribeReasonFontColor: "#000000",
  unSubscribeReasonBackgroundColor: "#FFFFFF",
  unSubscribeReason: [{
    value: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
    label: "ขอลบ"
  }],
  unSubscribeReasonRequired: true,
};

export const previewSubscriptionSettingsSlice = createSlice({
  name: "subscriptionSettings",
  initialState,
  reducers: {
    setSubscriptionSettings: (
      state,
      action: PayloadAction<Partial<SubscriptionSettingsState>>
    ) => {
      Object.assign(state, action.payload); // อัปเดตเฉพาะค่าที่ส่งมา
    },
    setIntSubscriptionSettings: (state) => {
      // รีเซ็ตค่าเป็นค่าเริ่มต้น โดยกำหนดค่าแต่ละ property
      state.subScriptionSettingsShow = initialState.subScriptionSettingsShow;
      state.subscriptionTitle = initialState.subscriptionTitle;
      state.subScribeAllShow = initialState.subScribeAllShow;
      state.subscribeAllLabel = initialState.subscribeAllLabel;
      state.unSubscribeAllShow = initialState.unSubscribeAllShow;
      state.unSubscribeAllLabel = initialState.unSubscribeAllLabel;
      state.unSubscribeReasonShow = initialState.unSubscribeReasonShow;
      state.trigerUnSubscribeReason = initialState.trigerUnSubscribeReason;
      state.unSubscribeReasonTitle = initialState.unSubscribeReasonTitle;
      state.unSubscribeReasonTitleDescription = initialState.unSubscribeReasonTitleDescription;
      state.unSubscribeReasonLabelButton = initialState.unSubscribeReasonLabelButton;
      state.unSubscribeReasonFontSize = initialState.unSubscribeReasonFontSize;
      state.unSubscribeReasonFontColor = initialState.unSubscribeReasonFontColor;
      state.unSubscribeReasonBackgroundColor = initialState.unSubscribeReasonBackgroundColor;
      state.unSubscribeReason = initialState.unSubscribeReason;
      state.unSubscribeReasonRequired = initialState.unSubscribeReasonRequired;
    },
  },
});

export const { setSubscriptionSettings,setIntSubscriptionSettings } =
  previewSubscriptionSettingsSlice.actions;

export default previewSubscriptionSettingsSlice.reducer;
