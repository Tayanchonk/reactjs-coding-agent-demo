import api from "./index";

export const getMenuList = async (userAccoundId: string) => {
  return api.get(`/configuration/Menu/GetMenu?UserAccountId=${userAccoundId}`, {
  // return api.get(
  //   // `https://localhost:44357/api/v1/Menu/GetMenu?UserAccountId=${userAccoundId}`,
  //   {
      withCredentials: true,
    }
  );
};

export const getMenus = async () => {
  return api.get(`/configuration/Menu/MenuList`, {
  // return api.get(
  //   `https://localhost:44357/api/v1/Menu/MenuList`
  //   , {
      withCredentials: true,
    }
  );
};

