import {
  IBulkCreateConsentData,
  IInterfaceDetails,
  ImportRecordResponse,
} from "../interface/bulkImportData.interface";
import api from "./configurationApi";
import customerDataApi from "./customerDataApi"

export const getImportRecords = async (limit: any, searchCondition: any) => {
  try {
    const customerId = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string).customer_id
      : "";
    const organizationId = localStorage.getItem("orgParent") || "";

    const response = await api.get<any>(`/ImportRecords`, {
      params: {
        customerId: customerId,
        organizationId: organizationId,
        page: searchCondition.page,
        pageSize: searchCondition.pageSize,
        sort: searchCondition.sort,
        status: searchCondition.status,
        column: searchCondition.column,
        searchTerm: searchCondition.searchTerm,
      },
    });

    return response.data as ImportRecordResponse;
  } catch (error) {
    console.error("Error fetching import records", error);
    throw error;
  }
};

export const getTemplates = async () => {
  try {
    const response = await api.get<any>(`/ImportRecords/Templates`);

    return response.data;
  } catch (error) {
    console.error("Error fetching import records", error);
    throw error;
  }
};

export const getTemplatesTypes = async () => {
  try {
    const response = await api.get<any>(`/ImportRecords/TemplatesTypes`);

    return response.data;
  } catch (error) {
    console.error("Error fetching import records", error);
    throw error;
  }
};

export const createUsers = async (data: any) => {
  try {
    const response = await api.post<any>(`/ImportRecords/CreateUsers`, data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const createOrganizations = async (data: any) => {
  try {
    // const response = await api.post<any>(`https://localhost:44357/api/v1/ImportRecords/CreateOrganizations`, data);
    const response = await api.post<any>(
      `/ImportRecords/CreateOrganizations`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const getPublishedInterfaceList = async (orgId: string[]) => {
  return customerDataApi.get(`/Interface/PublishedInterfaceList?orgIds=${orgId.join(
      "&orgIds="
    )}`
    // `https://localhost:44305/api/v1/Interface/PublishedInterfaceList?orgIds=${orgId.join(
    //   "&orgIds="
    // )}`
  );
};

export const getInterfaceDetails = async (
  interfaceId: string
): Promise<{ data: IInterfaceDetails }> => {
  try {
    return customerDataApi.get(
      `/Interface/InterfaceDetails/${interfaceId}`
      // `https://localhost:44305/api/v1/Interface/InterfaceDetails/${interfaceId}`
    );
  } catch (error) {
    console.log("There was an error!", error);
    throw error;
  }
};

export const bulkCreateConsentData = async (payload: any) => {
  try {
    return customerDataApi.post(
      `/Consent/bulk-set-consent-transaction`,
      // `https://localhost:44305/api/v1/Consent/bulk-set-consent-transaction`,
      payload
    );
  } catch (error) {
    console.log("There was an error in bulk create consent data:", error);
    throw error;
  }
};
