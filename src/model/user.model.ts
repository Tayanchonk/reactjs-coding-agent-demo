interface User {
    userAccountId: string;
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
    source: string | null;
    businessUnit: string;
    department: string;
    division: string;
    employeeId: string;
    jobTitle: string;
    manager: string | null;
    managerLagacy: string | null;
    officeLocation: string;
    sessionProtection: boolean;
    isSystemAccount: boolean;
    profileImageBase64: string;
    expirationDate: string;
    lastLoginDate: string;
    isActiveStatus: boolean;
    createdDate: string;
    modifiedDate: string;
    createdBy: string;
    modifiedBy: string;
    passwordHash: string;
    passwordSet: string;
  }
  
  interface Pagination {
    page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
  }
  
  export interface UserResponse {
    data: User[];
    pagination: Pagination;
  }
  
