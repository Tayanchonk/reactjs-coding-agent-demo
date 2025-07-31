
import { DataElementData } from '../interface/dataElement.interface';
import api from './customerDataApi';
export const getDataElements = async (limit: number, data: any, searchCondition: any) => {
    try {
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        const response = await api.post<any>(`/DataElement/ListDataElements?customerId=${customerId}&searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&column=${searchCondition.column}`
            , data);

        return response.data as DataElementData;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};

export const getDataElementByID = async (id: string) => {
    try {
        const response = await api.get<any>(`/DataElement/${id}`);

        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}


export const createDataElement = async (data: any) => {
    try {
        const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        if (user) {
            const customerId = user.customer_id || '00000000-0000-0000-0000-000000000000';
            const userAccountId = user.user_account_id || '00000000-0000-0000-0000-000000000000';
            data.customerId = customerId;
            data.createdBy = userAccountId;
            data.modifiedBy = userAccountId;
            const response = await api.post<any>(`/DataElement`, data);

            return response.data;
        }
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const deleteDataElement = async (id: string) => {
    try {
        const response = await api.delete<any>(`/DataElement/${id}`);
        return response;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const updateDataElement = async (data: any, id: string) => {
    try {
        data.modifiedBy = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).user_account_id : '00000000-0000-0000-0000-000000000000';
        const response = await api.put<any>(`/DataElement/${id}`, data);

        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const getDataElementTypes = async () => {
    try {
        const response = await api.get<any>(`/DataElement/DataElementTypes`);

        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};

export const getDataElementNames = async () => {
    try {
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        const response = await api.get<any>(`/DataElement/DataElementNames?customerId=${customerId}`);

        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};

export const getInterfaces = async (id: string, limit: number, searchCondition: any) => {
    try {
        const response = await api.get<any>(`/dataelement/${id}/interfaces?searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&statusFilter=${searchCondition.statusFilter == "all" ? "" : searchCondition.statusFilter}&column=${searchCondition.column}`);
        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};