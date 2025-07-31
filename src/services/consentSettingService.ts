import api from "./configurationApi";
import { ConsentGeneral } from "../interface/consentSetting.interface";

export const getConsentGeneral = async (customer_Id: string) => {
  return api.get(`/ConsentSetting/ConsentGeneral/${customer_Id}`, {
    withCredentials: true,
  });
};

export const updateConsentGeneral = async (
  consentGeneral: ConsentGeneral,
  by: string
) => {
  return api.put(`/ConsentSetting/ConsentGeneral/${by}`, consentGeneral, {
    withCredentials: true,
  });
};

export const getConsentReason = async (customer_Id: string) => {
  return api.get(`/ConsentSetting/ConsentReason/${customer_Id}`, {
    withCredentials: true,
  });
};

