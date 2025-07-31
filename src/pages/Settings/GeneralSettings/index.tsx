import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DateAndTime from "./Content/DateAndTime";
import EmailLanguage from "./Content/EmailLanguage";
import SessionSetting from "./Content/SessionSetting";
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { TabNavigation } from "../../../components/CustomComponent";
const GeneralSettings = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const childmenu = useSelector((state: RootState) => state.childmenu);
  const permissionPage = useSelector((state: RootState) => state.permissionPage);
  const [dataTab, setDataTab] = useState([]);

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("subMenuTab") || "date-time"
  );

  useEffect(() => {
    if (childmenu.length && permissionPage.permission) {
      if (localStorage.getItem("subMenuTab") === null) {
        navigate(
          `${localStorage.getItem("moduleSelect")}${childmenu[0].url}`
        );
      } else {
        navigate(
          `${localStorage.getItem(
            "moduleSelect"
          )}/general-setting/${localStorage.getItem("subMenuTab")}`
        );
      }
      const convertCharacter: any = childmenu.map((item: any) => {
        return {
          url: item.url,
          oldName: item.menuName,
          convertName: item.menuName
            .replace(/&/g, "-") // แทนที่ & ด้วยเครื่องหมายขีดกลาง
            .replace(/\s+/g, "-") // แทนที่ช่องว่างด้วยเครื่องหมายขีดกลาง
            .replace(/-+/g, "-")
            .toLowerCase(),
        };
      });
      setDataTab(convertCharacter);
    }

  }, [navigate, childmenu, permissionPage]);
  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const fixedNavigation = [
    {
      url: "/setting/general-setting/date-time",
      oldName: "Date & Time",
      convertName: "date-time",
      module: "",
    },
    {
      url: "/setting/general-setting/email-language",
      oldName: "Email Language",
      convertName: "email-language",
    },
    {
      url: "/setting/general-setting/session-setting",
      oldName: "Session Setting",
      convertName: "session-setting",
    },
  ];

  return (

 <><div className="bg-white w-full">
         <TabNavigation
          navigateTo={`${localStorage.getItem(
            "moduleSelect"
          )}/${localStorage.getItem("subMenuTab")}`}
          variant="contained"
          // tempValue={fixedNavigation}
        >
          {location.pathname === "/setting/general-setting/date-time" && (
            <DateAndTime />
          )}
          {location.pathname === "/setting/general-setting/email-language" && (
            <EmailLanguage />
          )}
              {location.pathname === "/setting/general-setting/session-setting" && (
            <SessionSetting />
          )}
        </TabNavigation>
          {/* <div className="m-3 pt-5 pb-10">
            {location.pathname ===
              `${localStorage.getItem(
                "moduleSelect"
              )}/user-management/organization` && <Organization />}
            {location.pathname ===
              `${localStorage.getItem("moduleSelect")}/user-management/user` && (
                <User />
              )}
            {location.pathname ===
              `${localStorage.getItem(
                "moduleSelect"
              )}/user-management/role-permission` && (
                <RoleAndPermission />
              )}
          </div> */}
        </div></>

    // <div className="bg-white w-full">
    //   <div>
    //     <nav className="flex border-b ">
    //       <div className="m-3 mb-1">
    //         {dataTab.map((d: any, i) => {
    //           return (
    //             <button
    //               key={i}
    //               className={`py-2 px-7 font-medium text-sm rounded-lg ${location.pathname ===
    //                 `${localStorage.getItem("moduleSelect")}${d.url}`
    //                 ? "text-blue-600 bg-[#f5f7ff]"
    //                 : "text-gray-500 hover:text-gray-700"
    //                 }`}
    //               onClick={() => {
    //                 navigate(`${localStorage.getItem("moduleSelect")}${d.url}`);
    //                 setActiveTab(d.url);
    //                 localStorage.setItem(
    //                   "subMenuTab",
    //                   d.convertName.toLowerCase()
    //                 );
    //               }}
    //             >
    //               {d.convertName ? t(`generalSetting.tab.${d.convertName}`) : ""}
    //             </button>
    //           );
    //         })}
    //       </div>
    //     </nav>
    //   </div>
    //   <div className="m-3 pt-5 pb-10  px-14">
    //     {location.pathname === "/setting/general-setting/date-time" && <DateAndTime />}
    //     {location.pathname === "/setting/general-setting/email-language" && <EmailLanguage />}
    //     {location.pathname === "/setting/general-setting/session-setting" && <SessionSetting />}
    //   </div>
    // </div>
  );
};

export default GeneralSettings;
