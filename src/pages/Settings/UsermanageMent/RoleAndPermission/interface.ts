export interface rolePermission {
    rolePermissionId?: string;
    customerId?: string;
    organizationId?: string;
    organization?: organization;
    rolePermissionName?: string;
    users?: [],
    description?: string;
    isActiveStatus?: boolean;
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
    createdByName?:string;
    modifiedByName?:string
    roleAssignmentList?:roleAssignments[]; 
  }

  export interface roleAssignments {
    roleAssignmentId?: string;
    customerId?: string;
    rolePermissionId?: string;
    menuId?: string;
    isCreate?: boolean;
    isRead?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    isActiveStatus?: boolean;
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
  }

  export interface organization {
    organizationId: string;
    organizationName: string;
  }
  export interface menu {
    menuId: string;
    menuName: string;
    menuParentId?:string;
    isRead?:boolean;
    isCreate?:boolean;
    isUpdate?:boolean;
    isDelete?:boolean;
    subMenu?:subMenu[];
  }
  export interface subMenu {
    menuId: string;
    menuName: string;
    isRead?:boolean;
    isCreate?:boolean;
    isUpdate?:boolean;
    isDelete?:boolean;
  }