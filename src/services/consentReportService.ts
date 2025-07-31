import api from "./index";

export const getConsentReportList = async (
  searchCondition: any,
  listOrgGlobal: any[],
  customerId: string
) => {
  const params = new URLSearchParams();
  let url = "configuration/ConsentReport/ConsentReportList";

  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
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

  if (searchCondition.column) {
    params.append("column", searchCondition.column);
  }
  url += `?${params.toString()}&customerId=${customerId}`;
  // if (
  //   searchCondition.searchTerm === "" ||
  //   searchCondition.searchTerm === undefined
  // ) {
  //   url = `configuration/ConsentReport/ConsentReportList?page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;

  //   // url = `https://localhost:44357/api/v1/RolePermission/GetUserInRolePermission/${rolePermissionId}?page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;
  // }
  // if (
  //   searchCondition.searchTerm !== "" ||
  //   searchCondition.searchTerm !== undefined
  // ) {
  //   url = `configuration/ConsentReport/ConsentReportList?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;
  //   // url = `https://localhost:44357/api/v1/RolePermission/GetUserInRolePermission/${rolePermissionId}?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}`;
  // }
  // if (searchCondition.column !== "" || searchCondition.column !== undefined) {
  //   url = `configuration/ConsentReport/ConsentReportList?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&column=${searchCondition.column}`;
  //   // url = `https://localhost:44357/api/v1/RolePermission/GetUserInRolePermission/${rolePermissionId}?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&column=${searchCondition.column}`;
  // }
  return api.get(url, {
    withCredentials: true,
  });
};

export const getConsentReportById = async (id: string) => {
  return api.get(
    `configuration/ConsentReport/ConsentReportById?consentReportId=${id}`,
    {
      withCredentials: true,
    }
  );
};

export const getConsentReportFieldsList = async () => {
  return api.get(`configuration/ConsentReport/ConsentReportFieldList`, {
    withCredentials: true,
  });
};

export const getProfileIdentifierValuesList = async (customerId: string) => {
  return api.get(
    `configuration/ConsentReport/ProfileIdentifierValues?customerId=${customerId}`,
    {
      withCredentials: true,
    }
  );
};

export const getStandardPurposeValuesList = async (
  customerId: string,
  listOrgGlobal: any[]
) => {
  const params = new URLSearchParams();
  let url = "configuration/ConsentReport/StandardPurposeValues";
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  if (customerId) {
    params.append("customerId", customerId);
  }
  url += `?${params.toString()}`;
  return api.get(url, {
    withCredentials: true,
  });

  // return api.get(
  //   `configuration/ConsentReport/StandardPurposeValues?customerId=${customerId}&organizationId=${organizationId}`,
  //   {
  //     withCredentials: true,
  //   }
  // );
};

export const getStandardPurposeVersionValuesList = async (
  customerId: string,
  organizationId: string
) => {
  return api.get(
    `configuration/ConsentReport/StandardPurposeVersionValues?customerId=${customerId}&organizationId=${organizationId}`,
    {
      withCredentials: true,
    }
  );
};

export const getInterfaceValuesList = async (
  customerId: string,
  listOrgGlobal: any[]
) => {
  const params = new URLSearchParams();
  let url = "configuration/ConsentReport/InterfaceValues";
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  if (customerId) {
    params.append("customerId", customerId);
  }
  url += `?${params.toString()}`;
  return api.get(url, {
    withCredentials: true,
  });
};

export const getTransactionIdValuesList = async (organizationId: string) => {
  return api.get(
    `configuration/ConsentReport/TransactionIdValues?organizationId=${organizationId}`,
    {
      withCredentials: true,
    }
  );
};

export const getInteractionTypeValuesList = async (listOrgGlobal: any[]) => {
  const params = new URLSearchParams();
  let url = "configuration/ConsentReport/InteractionTypeValues";
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  url += `?${params.toString()}`;
  return api.get(url, {
    withCredentials: true,
  });
};
export const getInteractionByValuesList = async (listOrgGlobal: any[]) => {
  const params = new URLSearchParams();
  let url = "configuration/ConsentReport/InteractionByValues";
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  url += `?${params.toString()}`;
  return api.get(url, {
    withCredentials: true,
  });
};

export const addConsentReport = async (data: any) => {
  return api.post(`configuration/ConsentReport/AddConsentReport`, data, {
    withCredentials: true,
  });
};

export const deleteConsentReport = async (id: string) => {
  return api.delete(
    `configuration/ConsentReport/DeleteConsentReport?consentReportId=${id}`,
    {
      withCredentials: true,
    }
  );
};

export const updateConsentReport = async (data: any) => {
  return api.post(`configuration/ConsentReport/UpdateConsentReport`, data, {
    withCredentials: true,
  });
};

export const getConsentReportListView = async (
  consentReportId: string,
  listOrgGlobal: any[],
  customerId: string,
  isPage: boolean,
  page: number,
  pageSize: number
) => {
  const params = new URLSearchParams();
  let url = "configuration/ConsentReport/ConsentReportListViews";
  if (consentReportId) {
    params.append("consentReportId", consentReportId);
  }
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  if (customerId) {
    params.append("customerId", customerId);
  }
  if (isPage) {
    params.append("isPage", isPage.toString());
  }
  if (page) {
    params.append("page", page.toString());
  }
  if (pageSize) {
    params.append("pageSize", pageSize.toString());
  }

  url += `?${params.toString()}`;
  return api.get(url, {
    withCredentials: true,
  });
};

export const exportExcel = async (
  consentReportId: string,
  listOrgGlobal: any[],
  customerId: string,
  name: string
) => {
 const params = new URLSearchParams();
  let url = "configuration/ConsentReport/Export-Excel";
  if (consentReportId) {
    params.append("consentReportId", consentReportId);
  }
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  if (customerId) {
    params.append("customerId", customerId);
  }

  url += `?${params.toString()}`;
  const response = await api.get(url, {
    withCredentials: true,
    responseType: "blob", // เพิ่ม responseType เป็น blob
  });

  // สร้าง Blob และดาวน์โหลดไฟล์โดยอัตโนมัติ
  const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", `${name}_${Date.now()}.xlsx`); // ตั้งชื่อไฟล์ที่ต้องการดาวน์โหลด
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

export const exportExcelCreate = async (
  listOrgGlobal: any[],
  customerId: string,
  data: any,
  name: string
) => {
 const params = new URLSearchParams();
  let url = "configuration/ConsentReport/Export-Excel-Create";

  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  if (customerId) {
    params.append("customerId", customerId);
  }

  url += `?${params.toString()}`;
  const response = await api.post(url,data ,{
    withCredentials: true,
    responseType: "blob", // เพิ่ม responseType เป็น blob
  });

  // สร้าง Blob และดาวน์โหลดไฟล์โดยอัตโนมัติ
  const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", `${name}_${Date.now()}.xlsx`); // ตั้งชื่อไฟล์ที่ต้องการดาวน์โหลด
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

export const getConsentReportListViewsCreate = async (
  listOrgGlobal: any[],
  customerId: string,
  isPage: boolean,
  page: number,
  pageSize: number,
  data: any
) => {
  const params = new URLSearchParams();
  let url = "configuration/ConsentReport/ConsentReportListViewsCreate";
  if (listOrgGlobal && listOrgGlobal.length > 0) {
    listOrgGlobal.forEach((org: string) => {
      params.append("listOrgGlobal", org);
    });
  }
  if (customerId) {
    params.append("customerId", customerId);
  }
  if (isPage) {
    params.append("isPage", isPage.toString());
  }
  if (page) {
    params.append("page", page.toString());
  }
  if (pageSize) {
    params.append("pageSize", pageSize.toString());
  }
  url += `?${params.toString()}`;
  return api.post(url, data, {
    withCredentials: true,
  })
}