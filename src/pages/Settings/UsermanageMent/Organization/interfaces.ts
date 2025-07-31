export interface OrganizationParent {
    organizationId: string;
    organizationName: string;
    // เพิ่มฟิลด์อื่นๆ ตามที่คาดว่าจะได้รับจาก API
  }
   
  export interface ApiResponse {
    data: OrganizationParent[];
    // เพิ่มฟิลด์อื่นๆ ตามที่คาดว่าจะได้รับจาก API
  }

  export interface DrawerProps {
    openCreateOrganization: boolean;
    // openDrawerCreateOrganization: () => void;
  }

