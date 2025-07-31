import api from "./index";
import { ConsentAccessToken } from "../interface/consentSetting.interface";
export const getConsentAccessToken = async (
  customerId: string
): Promise<ConsentAccessToken> => {
  const response = await api.get<ConsentAccessToken>(
    `configuration/ConsentAccessToken/GetAccessTokenSetting/${customerId}`,
    { withCredentials: true }
  );
  return response.data;
};

export const updateConsentAccessToken = async (
  consentAccessToken: ConsentAccessToken
) => {
  return api.put(
    `configuration/ConsentAccessToken/UpdateAccessTokenSetting`,
    consentAccessToken,
    { withCredentials: true }
  );
};
