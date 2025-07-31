import { P } from "@faker-js/faker/dist/airline-D6ksJFwG";
import api from ".";
import {
  PrivacyNoticeListResponse,
  PrivacyNoticeListRequest,
  PrivacyNoticeRequest,
} from "../interface/privacy.interface";

export const getPrivacyNoticeList = async (
  request: PrivacyNoticeListRequest
): Promise<PrivacyNoticeListResponse> => {
  const response = await api.post<PrivacyNoticeListResponse>(
    `/customerdata/PrivacyNotices/ListPrivacyNotices`,
    request,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getPrivacyNoticeStatusList = async () => {
  const response = await api.get(
    `/customerdata/PrivacyNoticesStatus/ListPrivacyNoticeStatus`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getPrivacyNotice = async (privacyNoticeId: string) => {
  const response = await api.get(
    `/customerdata/PrivacyNotices/GetPrivacyNoticeById?privacyNoticeId=${privacyNoticeId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const updatePrivacyNotice = async (request: PrivacyNoticeRequest) => {
  return api.post(`/customerdata/PrivacyNotices/UpdatePrivacyNotice`, request, {
    withCredentials: true,
  });
};
