import api from "./index";
export const getDataRetention = async (
  limit: any,
  searchCondition: any,
  customerId: string
) => {
  // console.log('searchCondition',searchCondition)
  let url = "";
  if (customerId) {
    url = `configuration/DataRetention/DataRetentionList?page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&status=${searchCondition.status}&customerId=${customerId}`;
  }

  if (
    searchCondition.searchTerm === "" ||
    searchCondition.searchTerm === undefined
  ) {
    url = `configuration/DataRetention/DataRetentionList?page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&customerId=${customerId}`;
  }

  if (searchCondition.searchTerm !== "") {
    url = `configuration/DataRetention/DataRetentionList?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&customerId=${customerId}`;
  }
  if (searchCondition.column !== "") {
    url = `configuration/DataRetention/DataRetentionList?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&column=${searchCondition.column}&customerId=${customerId}`;
  }

  // console.log('url', url);
  return api.get(url, {
    withCredentials: true,
  });
};
export const getDataSubjectById = async (policyId: string) => {
  return api.get(
    // `https://localhost:44357/api/v1/DataRetention/DataSubject/${policyId}`,
    `configuration/DataRetention/DataSubject/${policyId}`
  );
};
export const getDataReceiptById = async (policyId: string) => {
  return api.get(
    // `https://localhost:44357/api/v1/DataRetention/DataReceipt/${policyId}`,
    `configuration/DataRetention/DataReceipt/${policyId}`
  );
};
export const createDataRetention = async (data: any) => {
  return api.post(
    //  `https://localhost:44357/api/v1/DataRetention/Create`,
    `configuration/DataRetention/Create`,
    data
  );
};
export const updateDataRetention = async (data: any) => {
  return api.post(
    //  `https://localhost:44357/api/v1/DataRetention/Update`,
    `configuration/DataRetention/Update`,
    data
  );
};
export const delRetention = async (dataRetentionId: string) => {
  return api.delete(
    //    `https://localhost:44357/api/v1/DataRetention/Delete/${dataRetentionId}`,
    `configuration/DataRetention/Delete/${dataRetentionId}`
  );
};

export const getInterfaceList = async (orgId: string) => {
  return api.get(
    // `https://localhost:44357/api/v1/Interface/InterfaceList/${orgId}`,
    `configuration/Interface/InterfaceList/${orgId}`
  );
};
export const getStandardPurposeList = async (orgId: string) => {
  return api.get(
    // `https://localhost:44357/api/v1/StandardPurpose/StandardPurposeList/${orgId}`,
    `configuration/StandardPurpose/StandardPurposeList/${orgId}`
  );
};

export const getDataRetentionLog = async (
  searchCondition: any,
  customerId: string
) => {
  console.log("🚀 ~ searchCondition:", searchCondition);
  // console.log('searchCondition',searchCondition)
  let url = "";

  if (
    searchCondition.current.searchTerm === "" ||
    searchCondition.current.searchTerm === undefined
  ) {
    url = `configuration/DataRetentionLog/DataRetentionLogList?page=${searchCondition.current.page}&pageSize=${searchCondition.current.pageSize}&sort=${searchCondition.current.sort}&status=${searchCondition.current.status}&customerId=${customerId}`;
  }

  if (
    searchCondition.current.searchTerm !== "" ||
    searchCondition.current.searchTerm !== undefined
  ) {
    url = `configuration/DataRetentionLog/DataRetentionLogList?searchTerm=${searchCondition.current.searchTerm}&page=${searchCondition.current.page}&pageSize=${searchCondition.current.pageSize}&sort=${searchCondition.current.sort}&status=${searchCondition.current.status}&customerId=${customerId}`;
  }
  if (searchCondition.current.column !== "") {
    url = `configuration/DataRetentionLog/DataRetentionLogList?searchTerm=${searchCondition.current.searchTerm}&page=${searchCondition.current.page}&pageSize=${searchCondition.current.pageSize}&sort=${searchCondition.current.sort}&status=${searchCondition.current.status}&column=${searchCondition.current.column}&customerId=${customerId}`;
  }

  // console.log('url', url);
  return api.get(url, {
    withCredentials: true,
  });
};

export const getDataRetentionLogRun = async (
  dataRetentionLogId: string,
  modifiedById: string
) => {
  return api.get(
    // `https://localhost:44357/api/v1/DataRetentionLog/Run/${dataRetentionLogId}/${modifiedById}`,
    `configuration/DataRetentionLog/DataRetentionLogRun?dataRetentionLogId=${dataRetentionLogId}&modifiedById=${modifiedById}`,
    {
      withCredentials: true,
    }
  );
};

export const getTransactionStatus = async () => {
  return api.get(
    // `https://localhost:44357/api/v1/DataRetentionLog/TransactionStatus`,
    `configuration/DataRetentionLog/TransactionStatus`,
    {
      withCredentials: true,
    }
  );
};
