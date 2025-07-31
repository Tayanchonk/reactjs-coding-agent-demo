import api from "./configurationApi";



export const getInterfaceBranding = async (customer_Id: string) => {
    return api.get(
        `/AppBranding/GetAppBranding/${customer_Id}`,
        { withCredentials: true }
    );
    };

export const updateInterfaceBranding = async (interfaceBranding: any) => {
    return api.put(
        `/AppBranding/UpdateAppBranding/`, interfaceBranding,
        { withCredentials: true }
    );
}