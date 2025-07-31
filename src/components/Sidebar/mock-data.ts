import ConsentIC from "../../assets/consent-ic.svg";
import AnalyticIC from "../../assets/analytics-ic.svg";
import SettingIC from "../../assets/Editable-line.svg"
import { MenuData } from "../../interfaces";

export   const menus = [
    {
      name: "Consent",
      link: "/consent",
      icon: ConsentIC,
      path: "/consent/data-subject",
    },
    {
      name: "Analytics",
      link: "/analytics",
      icon: AnalyticIC,
      path: "/analytics/summary",
    },
    {
      name: "Setting",
      link: "/setting",
      icon: SettingIC,
      path: "/setting/user-management",
    },
  ];


  export   const menuData: MenuData[] = [
    {
      nameMenu: "consent",
      path: "/consent/data-subject",
      headerMenu: "PDPA Consent",
      description: "A list of all the users in your",
      listMenu: [
        {
          data: [
            { path: "data-subject", name: "Data Subject" },
            { path: "profile", name: "Profile" },
            { path: "receipts", name: "Receipts" },
          ],
        },
        
      ],
    },
    {
      nameMenu: "setting",
      path: "/setting/user-management",
      headerMenu: "Setting",
      description: "A list of all the users in your",
      listMenu: [
        {
          data: [
            { path: "user-management", name: "User Management" },
            { path: "interface-branding", name: "Interface & Branding" },
            { path: "general-settings", name: "General Settings" },
            { path: "consent-setting", name: "Consent Setting" },
          ],
        },
      ],
    },
    {
      nameMenu: "analytics",
      path: "/analytics/summary",
      headerMenu: "Analytics",
      description: "A list of all the users in your",
      listMenu: [
        {
          data: [
            { path: "summary", name: "Summary" },
            { path: "by-period", name: "By Period" },
          ],
        },
      ],
    },
  ];
