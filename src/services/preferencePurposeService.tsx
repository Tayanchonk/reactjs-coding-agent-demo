import api from "./index";
import {
  PreferencePurposeList,
  PreferencePurposeListRequest,
  PreferencePurposeRequest,
  PreferencePurposeItem,
} from "../interface/purpose.interface";

export const getPreferencePurposeList = async (
  preferencePurposeBody: PreferencePurposeListRequest
) => {
  return api.post<PreferencePurposeList>(
    `/customerdata/PreferencePropose/ListPreferencePurpose`,

    preferencePurposeBody,
    {
      withCredentials: true,
    }
  );
};

export const getPreferencePurpose = async (preferencePurposeId: string) => {
  return api.get<PreferencePurposeItem>(
    `/customerdata/PreferencePropose/GetPreferencePurposeById?preferencePurposeId=${preferencePurposeId}`,

    {
      withCredentials: true,
    }
  );
};

export const createPreferencePurpose = async (
  preferencePurposeBody: PreferencePurposeRequest
) => {
  return api.post(
    `/customerdata/PreferencePropose/CreatePreferencePurpose`,
    preferencePurposeBody,
    {
      withCredentials: true,
    }
  );
};

export const updatePreferencePurpose = async (
  preferencePurposeBody: PreferencePurposeRequest
) => {
  return api.post(
    `/customerdata/PreferencePropose/UpdatePreferencePurpose`,
    preferencePurposeBody,
    {
      withCredentials: true,
    }
  );
};
