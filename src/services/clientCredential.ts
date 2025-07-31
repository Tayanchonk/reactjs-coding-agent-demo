//import api from "./index";
import api from "./configurationApi";

export const getClientCredentialList = async (params: any) => {
  const response = await api.post(`/ClientCredential/List`, params);
  return response.data;
};

export const getClientCredentialById = async (clientCredentialId: string) => {
  const response = await api.get(`/ClientCredential/${clientCredentialId}`);
  return response.data;
};


export const createClientCredential = async (payload: any) => {
  const response = await api.post(`/ClientCredential`, payload);
  return response.data;
};


export const updateClientCredential = async (clientCredentialId: string, payload: any) => {
  const response = await api.put(`/ClientCredential/${clientCredentialId}`, payload);
  return response.data;
};


export const deleteClientCredential = async (clientCredentialId: string, modifiedBy: string) => {
  const response = await api.delete(`/ClientCredential/${clientCredentialId}`, {
    params: { modifiedBy },
  });
  return response.data;
};

export const resetClientCredential = async (clientCredentialId: string, modifiedBy: string) => {
  const response = await api.post(`/ClientCredential/Reset/${clientCredentialId}` , null , {
    params: { modifiedBy },
  });
  return response.data;
};