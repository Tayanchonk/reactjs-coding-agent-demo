import api from "./index";

export interface CreateStandardPurpose {
      purposeName: string
      description: string
      organizationId: string
      customerId: string
      consentExpireNumber: number
      consentExpireDateType: string
      isSetConsentExpire: boolean
      translationJson: Object
      modifiedBy: string
      createdBy: string
}

export interface UpdateStandardPurpose {
      purposeName: string
      description: string
      organizationId: string
      customerId: string
      consentExpireNumber: number
      consentExpireDateType: string
      isSetConsentExpire: boolean
      translationJson: Object
      modifiedBy: string
      createdBy: string
}

export interface CreateStandardPreference {
      stdPurposeId: string
      prefPurposeId: string
      prefPurposeName: string
      prefPurposeDescription: string
      prefPurposeSelectionJson: Object
      prefPurposeTranslationJson: Object
      prefPurposeOrganizationId: string
      prefPurposeCustomerId: string
      prefPurposeIsRequired: boolean
      createdBy: string
}

export const getStandardPurposeListByCustomerId = async (customerId: string, Odata: string) => {

      const response = await api.get(`/customerdata/StandardPurpose/ListByCustomer/${customerId}` + Odata, { withCredentials: true });
      return response.data;
};

export const CreateStandardPurpose = async (standardPurpose: CreateStandardPurpose) => {

      const response = await api.post(`/customerdata/StandardPurpose/Create`, standardPurpose, { withCredentials: true });
      return response;
};

export const UpdateStandardPurpose = async (standardPurpose: UpdateStandardPurpose, standardPurposeId: string) => {

      const response = await api.put(`/customerdata/StandardPurpose/Update/${standardPurposeId}`, standardPurpose, { withCredentials: true });
      return response;
};

export const PublishStandardPurpose = async (standardPurpose: any, standardPurposeId: string) => {

      const response = await api.post(`/customerdata/StandardPurpose/Publish/${standardPurposeId}`, standardPurpose, { withCredentials: true });
      return response;
};

export const CreateNewVerionStandardPurpose = async (standardPurpose: UpdateStandardPurpose, standardPurposeId: string) => {

      const response = await api.post(`/customerdata/StandardPurpose/CreateNewVerion/${standardPurposeId}`, standardPurpose, { withCredentials: true });
      return response;
};

export const GetStandardPurposeById = async (standardPurposeId: string) => {

      const response = await api.get(`/customerdata/StandardPurpose/${standardPurposeId}`, { withCredentials: true });
      return response.data;
};

export const GetStandardPurposeVersions = async (standardPurposeId: string) => {

      const response = await api.get(`/customerdata/StandardPurpose/${standardPurposeId}/Versions`, { withCredentials: true });
      return response.data;
};

export const GetStandardPurposeStatus = async () => {

      const response = await api.get(`/customerdata/StandardPurpose/Status`, { withCredentials: true });
      return response.data;
};

export const DeleteStandardPurpose = async (standardPurposeId: string, deleteBy: string) => {

      const response = await api.delete(`/customerdata/StandardPurpose/${standardPurposeId}?deleteBy=${deleteBy}`, { withCredentials: true });
      return response;
};

export const CreateStandardPreference = async (standardPreference: CreateStandardPreference) => {

      const response = await api.post(`/customerdata/StandardPurpose/StandardPreference`, standardPreference, { withCredentials: true });
      return response;
};

export const GetStandardPreference = async (standardPurposeId: string) => {

      const response = await api.get(`/customerdata/StandardPurpose/StandardPreference/${standardPurposeId}`, { withCredentials: true });
      return response.data;
};

export const DeleteStandardPreference = async (standardPreference: string) => {
      const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
      const userAccountId = user.user_account_id || '00000000-0000-0000-0000-000000000000';
      const response = await api.delete(`/customerdata/StandardPurpose/StandardPreference/${standardPreference}?deleteBy=${userAccountId}`, { withCredentials: true });
      return response.data;
};

export const GetInterfaceByStandardPurposeId = async (standardPurposeId: string) => {

      const response = await api.get(`/customerdata/ConsentInterface/StandardPurpose/${standardPurposeId}`, { withCredentials: true });
      return response.data;
};