import api from "./index";
import { AppSession } from "../interface/generalSetting.interface";

export const getAppSession = async (customer_Id: string) => {
  return api.get(
    `/configuration/GeneralSetting/AppSessionByCustomerId/${customer_Id}`,
    { withCredentials: true }
  );
};

export const createAppSession = async (appSession: AppSession) => {
  return api.post(
    `/configuration/GeneralSetting/AppSession`, appSession,
    { withCredentials: true }
  );
};

export const updateAppSession = async (appSession: AppSession) => {
  return api.put(
    `/configuration/GeneralSetting/AppSession`, appSession,
    { withCredentials: true }
  );
};

export const deleteAppSession = async (appSessionId: string) => {
  return api.delete(
    `/configuration/GeneralSetting/AppSession/${appSessionId}`,
    { withCredentials: true }
  );
};
