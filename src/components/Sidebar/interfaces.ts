export interface Menus {
    name: string;
    link: string;
    icon: string;
    path: string;
  }
  
  export interface MenuItem {
    path: string;
    name: string;
  }

  export interface ListMenu {
    set1?: MenuItem[];
    set2?: MenuItem[];
  }
  
  export interface MenuData {
    path: string;
    nameMenu: string;
    headerMenu: string;
    description: string;
    listMenu: ListMenu[];
  }