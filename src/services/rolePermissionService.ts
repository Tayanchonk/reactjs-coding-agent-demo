import { rolePermission } from "../pages/Settings/UsermanageMent/RoleAndPermission/interface";
import api from "./index";

export const getrolePermission = async (customerId:string,limit: any, searchCondition: any, listOrgGlobal: any[]) => {

  let url = "configuration/RolePermission/RolePermissionList";

  const params = new URLSearchParams();

  if (searchCondition.searchTerm) {
    params.append("searchTerm", searchCondition.searchTerm);
  }
  if (searchCondition.page) {
    params.append("page", searchCondition.page);
  }
  if (searchCondition.pageSize) {
    params.append("pageSize", searchCondition.pageSize);
  }
  if (searchCondition.sort) {
    params.append("sort", searchCondition.sort);
  }
  if (searchCondition.status) {
    params.append("status", searchCondition.status);
  }
  if (searchCondition.column) {
    params.append("column", searchCondition.column);
  }
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }

  url += `?${params.toString()}&customerId=${customerId}`;

  return api.get(url, {
    withCredentials: true,
  });
};

export const getOrganizationList = async () => {
  // return api.get("http://localhost:3001/api/configuration/RolePermission/Organizations"
  // // , {
  // //     withCredentials: true
  // // }
  // );
  return api.get(`configuration/RolePermission/Organizations`);
};
export const createRolePermission = async (data: rolePermission) => {
  return api.post(
    // `/configuration/RolePermission/Create`,
    `configuration/RolePermission/Create`,
    data
  );
};
export const delRolePermission = async (rolePermissionId: string) => {
  return api.delete(
    // `configuration/RolePermission/Delete/${rolePermissionId}`,
    `configuration/RolePermission/Delete/${rolePermissionId}`
  );
};
export const getRolePermissionById = async (rolePermissionId: string) => {
  return api.get(
    //    `https://localhost:44357/api/v1/RolePermission/RolePermissionById/${rolePermissionId}`,
    `configuration/RolePermission/RolePermissionById/${rolePermissionId}`
  );
};

export const updateRolePermissionById = async (data: rolePermission) => {
  return api.post(
    // `configuration/RolePermission/Delete/${rolePermissionId}`,
    `configuration/RolePermission/Update`,
    data
  );
};

export const getUserInRolePermission = async (
  searchCondition: any,
  rolePermissionId: string
) => {
  let url = "";

  if (
    searchCondition.searchTerm === "" ||
    searchCondition.searchTerm === undefined
  ) {
    url = `configuration/RolePermission/GetUserInRolePermission/${rolePermissionId}?page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;

    // url = `https://localhost:44357/api/v1/RolePermission/GetUserInRolePermission/${rolePermissionId}?page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;
  }
  if (
    searchCondition.searchTerm !== "" ||
    searchCondition.searchTerm !== undefined
  ) {
    url = `configuration/RolePermission/GetUserInRolePermission/${rolePermissionId}?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;
    // url = `https://localhost:44357/api/v1/RolePermission/GetUserInRolePermission/${rolePermissionId}?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;
  }
  if (searchCondition.column !== "" || searchCondition.column !== undefined) {
    url = `configuration/RolePermission/GetUserInRolePermission/${rolePermissionId}?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&column=${searchCondition.column}`;
    // url = `https://localhost:44357/api/v1/RolePermission/GetUserInRolePermission/${rolePermissionId}?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&column=${searchCondition.column}`;
  }
  return api.get(url, {
    withCredentials: true,
  });
};


export const GetUserRolesByUserAccountId = async (userAccountId: string) => {
    return api.get(
      // ` configuration/RolePermission/GetUserRolesByUserAccountId?userAccountId=${userAccountId}`,
      `configuration/RolePermission/GetUserRolesByUserAccountId?userAccountId=${userAccountId}`

    );
  };
