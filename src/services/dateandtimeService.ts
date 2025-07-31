import api from "./index";

export const getAppDatetimePreference = async (customerId: string) => {
    return api.get(`/configuration/GeneralSetting/AppDatetimePreference/${customerId}`, {
        withCredentials: true
    });
};

export const updateAppDatetimePreference = async (data: any) => {
    return api.put(`/configuration/GeneralSetting/AppDatetimePreference`, data, {
        withCredentials: true
    });
};

export const getDateFormatList = async () => {
    return api.get(`/configuration/GeneralSetting/DateFormat`, {
        withCredentials: true

    });
};

export const getTimeZone = async () => {
    return api.get(`/configuration/GeneralSetting/TimeZone`, {
        withCredentials: true

    });
};
