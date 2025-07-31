
import dayjs from 'dayjs';
import { IConsentInterface } from '../interface/interface.interface';
import api from "./index";
export const getConsentInterfaces = async (limit: number, data: any, searchCondition: any) => {
    try {
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        const response = await api.post<any>(`/customerdata/ConsentInterface/ListConsentInterfaces?customerId=${customerId}&searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&statusFilter=${searchCondition.statusFilter == "all" ? "" : searchCondition.statusFilter}&column=${searchCondition.column}`
            , data, { withCredentials: true });

        return response.data as IConsentInterface;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};

export const getConsentInterfaceByID = async (id: string) => {
    try {
        const response = await api.get<any>(`/customerdata/ConsentInterface/${id}`, { withCredentials: true });

        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}


export const createConsentInterface = async (data: any) => {
    try {
        const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        if (user) {
            const customerId = user.customer_id || '00000000-0000-0000-0000-000000000000';
            const userAccountId = user.user_account_id || '00000000-0000-0000-0000-000000000000';
            data.customerId = customerId;
            data.createdBy = userAccountId;
            data.modifiedBy = userAccountId;
            data.createdDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
            data.modifiedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
            data.publishedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
            data.publishedBy = user.user_account_id || '00000000-0000-0000-0000-000000000000';
            data.CreatedByName = user.user_account_id || '00000000-0000-0000-0000-000000000000';
            data.ModifiedByName = user.user_account_id || '00000000-0000-0000-0000-000000000000';
            const response = await api.post<any>(`/customerdata/ConsentInterface`, data, { withCredentials: true });
            return response.data;
        }
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const deleteConsentInterface = async (id: string) => {
    try {
        const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        const userAccountId = user.user_account_id || '00000000-0000-0000-0000-000000000000';
        const response = await api.delete<any>(`/customerdata/ConsentInterface/${id}?deleteBy=${userAccountId}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const updateConsentInterface = async (data: any) => {
    try {
        const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        const customerId = user.customer_id || '00000000-0000-0000-0000-000000000000';
        const userAccountId = user.user_account_id || '00000000-0000-0000-0000-000000000000';
        data.customerId = customerId;
        data.createdBy = userAccountId;
        data.modifiedBy = userAccountId;
        data.createdDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        data.modifiedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        data.publishedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        data.publishedBy = user.user_account_id || '00000000-0000-0000-0000-000000000000';
        data.CreatedByName = user.user_account_id || '00000000-0000-0000-0000-000000000000';
        data.ModifiedByName = user.user_account_id || '00000000-0000-0000-0000-000000000000';
        console.log("updateConsentInterface", data)
        const response = await api.put<any>(`/customerdata/ConsentInterface`, data, { withCredentials: true });

        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const CreateInterfaceNewVersion = async (data: any) => {
    try {
        const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
        if (user) {
            const userAccountId = user.user_account_id || '00000000-0000-0000-0000-000000000000';
            data.createdBy = userAccountId;
            data.modifiedBy = userAccountId;
            data.createdDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
            data.modifiedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
            const response = await api.post<any>(`/customerdata/ConsentInterface/CreateNewVersion`, data, { withCredentials: true });
            return response.data;
        }
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const GetPageTypes = async () => {
    try {
        const response = await api.get<any>(`/customerdata/ConsentInterface/PageType`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const GetVersions = async (InterfaceId: string) => {
    try {
        const response = await api.get<any>(`/customerdata/ConsentInterface/${InterfaceId}/Versions`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const GetContentFieldType = async () => {
    try {
        const response = await api.get<any>(`/customerdata/ConsentInterface/ContentFieldType`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}