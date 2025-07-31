import api from "./index";

export const getAppLanguages = async () => {
  return api.get(`configuration/AppLanguage/GetAppLanguages`, {
    withCredentials: true,
  });
};
