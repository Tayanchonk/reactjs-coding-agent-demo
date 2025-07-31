import api from "./index";

export const getOrganizationParent = async (CustomerId: string,forEdit:boolean) => {
    return api.get(`/configuration/Organization/GetOrganizationParent?CustomerId=${CustomerId}&forEdit=${forEdit}`, {
  // return api.get(
  //   `https://localhost:44357/api/v1/Organization/GetOrganizationParent?CustomerId=${CustomerId}&forEdit=${forEdit}`,
  //  {
      withCredentials: true
    }
  
  );
};

export const getOrganizationChart = async (CustomerId: string,organizationId?:any) => {
    return api.get(`/configuration/Organization/GetOrganizationChart?CustomerId=${CustomerId}${organizationId ? `&organizationId=${organizationId}` : ''}`, {
    
    // return api.get(
    //   `https://localhost:44357/api/v1/Organization/GetOrganizationChart?CustomerId=${CustomerId}${organizationId ? `&organizationId=${organizationId}` : ''}`,
    //   {
      withCredentials: true,
    }
  );
};

export const deleteOrganization = async (id: string) => {
  return api.delete(
    `/configuration/Organization/DeleteOrganization/${id}`,
    // `https://localhost:44357/api/v1/Organization/DeleteOrganization/${id}`
    );
};


export const createOrganization = async (data: any) => {
    return api.post(
        `/configuration/Organization/CreateOrganization`,
        // `https://localhost:44357/api/v1/Organization/CreateOrganization`,
        data
    )
}

export const updateOrganization = async (data: any) => {
    return api.put(
        `/configuration/Organization/UpdateOrganization`,
        // `https://localhost:44357/api/v1/Organization/UpdateOrganization`,
        data
    )
}

export const getOrganizationById = async (id: string) => {

    return api.get(
        `/configuration/Organization/${id}`,
        //  `https://localhost:44357/api/v1/Organization/${id}`
    )
}
export const getOrganizationList = async (customerId:string,organizationParentId:string) => {
    return api.get(
         `/configuration/Organization/OrganizationList/${customerId}/${organizationParentId}`,
        //  `https://localhost:44357/api/v1/Organization/OrganizationList/${customerId}/${organizationParentId}`
    )
}
