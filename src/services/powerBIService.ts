import api from "./index";

export const getPowerBIToken = async (reportName: string) => {
  const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
  const datetime = localStorage.getItem('datetime') ? JSON.parse(localStorage.getItem('datetime') as string) : null;
  const body = {
    "reportName": reportName,
    "customerId": user.customer_id,
    "dateTimeFormat": `${datetime.dateFormat} ${datetime.timeFormat}`,
    "timeZone": datetime.timeZoneName
  }
  return api.post("/customerdata/PowerBI/embed-info", body, { withCredentials: true });
};

export const exportPDF = async (workspaceId: string, reportId: string): Promise<Blob> => {
  const response = await api.get(
    `/customerdata/PowerBI/export/pdf?workspaceId=${workspaceId}&reportId=${reportId}`,
    {
      withCredentials: true,
      responseType: 'blob'
    }
  );
  return response.data;
};