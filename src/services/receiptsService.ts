import api from "./index";

export const getReceiptList = async (Odata: string, orgs?: Array<string>) => {

      const response = await api.post(`/customerdata/Receipt/lists` + Odata, orgs, { withCredentials: true });
      return response.data;

};

export const getReceiptDetail = async (Id: string) => {

      const response = await api.get(`/customerdata/Receipt/` + Id, { withCredentials: true });
      return response.data;

};

export const deleteReceiptById = async (Id: string, user_account_id: string) => {

      const response = await api.delete(`/customerdata/Receipt/${Id}` + '?modifiedBy=' + user_account_id, { withCredentials: true });
      return response.data;

};