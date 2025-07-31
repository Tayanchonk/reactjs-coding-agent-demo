
import { UserResponse } from '../model/user.model';
import api from './configurationApi';

export const getUsers = async (limit: any, searchCondition: any) => {
    try {
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        const organizationId = localStorage.getItem('orgParent') ? localStorage.getItem('orgParent') : '';
        const response = await api.get<any>(`/User?customerId=${customerId}&searchTerm=${searchCondition.searchTerm}&page=${searchCondition.page}&pageSize=${searchCondition.pageSize}&sort=${searchCondition.sort}&status=${searchCondition.status}&column=${searchCondition.column}&organizationId=${organizationId}`);


        return response.data as UserResponse;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};

export const getRole = async () => {
    try {
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        const response = await api.get<any>(`/User/ListRole?CustomerId=${customerId}`);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const getOrganization = async () => {
    try {
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        const response = await api.get<any>(`/User/ListOrganization?CustomerId=${customerId}`);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}


export const createUser = async (data: any) => {
    try {
        const response = await api.post<any>(`/User`, data);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const getUser = async (id: any) => {
    try {
        const response = await api.get<any>(`/User/${id}`);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}


export const deleteUser = async (data: any) => {
    try {
        const response = await api.delete<any>(`/User`, { data });


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}


export const updateUser = async (data: any, id: any) => {
    try {
        const response = await api.put<any>(`/User/${id}`, data);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

// get listManager
export const getListManager = async () => {
    try {
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        const response = await api.get<any>(`/User/ListManager?customerId=${customerId}`);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

// post RolePermission
export const postRolePermission = async (data: any) => {
    try {
        const response = await api.post<any>(`/User/RolePermission`, data);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

// detele user
export const deleteUserAccount = async (id: string) => {
    try {
        const response = await api.delete<any>(`/User/${id}`);


        return response.data;
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
}

export const getUserMenu = async (location: string) => {
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    let lastChar = location[location.length - 1];
    if (lastChar === '/') {
        location = location.slice(0, -1);
    }
    try {
        const { data: { data } } = await api.get<any>(`/User/UserMenu/${currentUser.user_account_id}`);
        const respdata = data.filter((item: any) => item.isRead);
        //console.log(respdata)
        const sortedData = data.sort((a: any, b: any) => b.url.length - a.url.length);
        const selectedMenu = sortedData.find((item: any) => location.startsWith(item.fullUrl));
        const moduleUrl = sortedData.filter((item: any) => item.moduleUrl === location && item.menuParentId === "");
        const ismodule = moduleUrl.length > 0 ? true : false;
        // console.log("ismodule", ismodule)
        if (!selectedMenu) {
            return { selectedMenu: { menuName: 'Dashboard', url: '/' }, parentMenu: moduleUrl, ismodule };
        }
        const subMenu = respdata.filter((item: any) => item.menuParentId === selectedMenu.menuId);
        const sameLevelMenu = respdata.filter((item: any) => item.menuParentId === selectedMenu.menuParentId);
        const parentMenu = (subMenu.length ? subMenu : sameLevelMenu)
            .map(({ url, menuName, sort }: any) => ({ url, menuName, sort }));
   
        return { selectedMenu, parentMenu, ismodule };
    } catch (error) {
        console.error('There was an error!', error);
        throw error;
    }
};
