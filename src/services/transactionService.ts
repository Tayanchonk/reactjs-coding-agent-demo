import api from "./index";

export const getTransactionList = async (Odata: string, orgs?: Array<string>) => {
      const response = await api.post(`/customerdata/Transaction/lists` + Odata, orgs, { withCredentials: true });
      return response.data;

};


export const getTransactionDetail = async (Id: string) => {

      const response = await api.get(`/customerdata/Transaction/` + Id, { withCredentials: true });
      return response.data;

};