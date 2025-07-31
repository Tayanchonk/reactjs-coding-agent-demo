import api from "./index";


export const getDashboardData = async (searchCondition: any) => {
  let url = `dashboard/Dashboard/GetDashboardData?customerId=${searchCondition.customerId}&organizationId=${searchCondition.organizationId}`;
    return api.get(url, {
    withCredentials: true,
    });
};