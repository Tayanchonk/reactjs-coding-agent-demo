interface UserAccount {
    userAccountId: string;
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
    source: string | null;
    businessUnit: string | null;
    department: string;
    division: string;
    employeeId: string | null;
    jobTitle: string;
    manager: string | null;
    managerLagacy: string | null;
    officeLocation: string | null;
    sessionProtection: boolean;
    isSystemAccount: boolean | null;
    profileImageBase64: string;
    expirationDate: string;
    lastLoginDate: string;
    isActiveStatus: boolean;
    createdDate: string;
    modifiedDate: string;
    createdBy: string | null;
    modifiedBy: string;
    passwordHash: string | null;
    passwordSet: string | null;
    createdByName: string | null;
    userAccountOrganizations: UserAccountOrganization | null;
    rolePermissions: any | null;
}

// interface UserAccountOrganization {
//     userAccountOrganizationId: string;
//     userAccountId: string;
//     organizationId: string;
//     customerId: string;
//     isActiveStatus: boolean | null;
//     createdDate: string;
//     modifiedDate: string;
//     createdBy: string;
//     modifiedBy: string;
//     organizationName: string;
// }

interface Pagination {
    page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
}

 export interface UserAccountData {
    data: UserAccount[];
    pagination: Pagination;
}


export interface IUserData {
    userAccountId: string;
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
    source: Record<string, any>;
    businessUnit: string;
    department: string;
    division: string;
    employeeId: string;
    jobTitle: string;
    manager: Manager;
    userAccountOrganizations: UserAccountOrganization;
    rolePermissions: any[];
    managerLagacy: string;
    officeLocation: string;
    sessionProtection: boolean;
    isSystemAccount: boolean;
    profileImageBase64: string;
    expirationDate: string;
    lastLoginDate: string;
    isActiveStatus: boolean;
    createdBy: string;
    modifiedBy: string;
    modifiedDate?: string;
    createdDate?: string;
    createdByName?: string;
    modifiedByName?: string;
}

interface Manager {
    managerId: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface UserAccountOrganization {
   
    userAccountId: string;
    organizationId: string;
   
    isActiveStatus: boolean | null;
   
    organizationName: string;
}