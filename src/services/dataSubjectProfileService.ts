import dayjs from "dayjs";
import { IDataSubjectProfilesInterface } from "../interface/dataSubjectProfiles.interface";
import api from "./customerDataApi";

export const getDataSubjectProfilesList = async (
  customerId: string,
  orgFilter: any,
  searchCondition: any
) => {
  try {
    const response = await api.get<any>(
      `/DataSubject/lists?customerId=${customerId}${orgFilter}${
      // `https://localhost:44305/api/v1/DataSubject/lists?customerId=${customerId}${orgFilter}${
      searchCondition.searchTerm !== ""
        ? `&searchTerm=${searchCondition.searchTerm}`
        : ""
      }&page=${searchCondition.page}&pageSize=20${searchCondition.column !== ""
        ? `&column=${searchCondition.column}`
        : `&column=DataSubjectId`
      }${searchCondition.sort !== ""
        ? `&sort=${searchCondition.sort}`
        : `&sort=ASC`
      }`
    );
    return response.data as IDataSubjectProfilesInterface;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const getDataSubjectProfilesById = async (
  dataSubjectId: string
) => {
  try {
    const response = await api.get<any>(
      // `/DataSubject/lists?${orgFilter}${
      // `https://localhost:44305/api/v1/DataSubject/${dataSubjectId}`
      `/DataSubject/${dataSubjectId}`
    );
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const getDataSubjectPurposeById = async (
  dataSubjectId: string,
  searchCondition: any
) => {
  try {
    const response = await api.get<any>(
      `/DataSubject/${dataSubjectId}/purpose?${searchCondition.searchTerm !== ""
        ? `&searchTerm=${searchCondition.searchTerm}`
        : ""
      }${searchCondition.status !== ""
        ? `&status=${searchCondition.status}`
        : ""
      }${searchCondition.receivedMode !== ""
        ? `&receivedMode=${searchCondition.receivedMode}`
        : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const deleteDataSubjectProfiles = async (
  deletedBy: string,
  data: any
) => {
  try {
    const response = await api.request<any>({
      method: "DELETE",
      url: `/DataSubject/deleteDataSubject?deletedBy=${deletedBy}&delAll=${data.delAll}`,
      headers: {
        "Content-Type": "application/json",
      },
      // params: { deletedBy: deletedBy }, // ส่งข้อมูลใน query string
      data: data.dataSubjectIds, // ส่งข้อมูลใน body
    });
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
}


export const getDataSubjectPurposeList = async (
  orgFilter: any,
  searchCondition: any,
  dataSubjecId: string
) => {
  try {
    const response = await api.get<any>(
      `/DataSubject/lists?${orgFilter}${
      // `https://localhost:44305/api/v1/DataSubject/${dataSubjecId}/purpose?${orgFilter}${
      searchCondition.searchTerm !== ""
        ? `&searchTerm=${searchCondition.searchTerm}`
        : ""
      }&receivedMode=${searchCondition.receivedMode}&status=${searchCondition.status}`
    );
    return response.data
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const deletePurposeBySubjectId = async (
  dataSubjectId: string,
  deletedBy: string,
  purposeIds: string[]
) => {
  try {
    const response = await api.request<any>({
      method: "POST",
      url: `/DataSubject/delete-by-purpose?dataSubjectId=${dataSubjectId}&deletedBy=${deletedBy}`,
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      data: purposeIds, // ส่ง array ของ purposeId ใน body
    });
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};