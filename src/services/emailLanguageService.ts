import api from "./index";


export const getEmailLanguageList = async () => {
      const response = await api.get('/configuration/GeneralSetting/EmailLanguageList');
      return response.data;
};

export const getEmailLanguageById = async (customerId: string) => {
  
      const response = await api.get(`/configuration/GeneralSetting/EmailLanguageById/${customerId}`);
      return response.data;
};

export const updateEmailLanguage = async (emailLanguageId: string) => {
        const response = await api.put(`/configuration/GeneralSetting/UpdateEmailLanguage/${emailLanguageId}`);
        return response.data;
};