import React, { useState, useEffect } from "react";
import User from "./User";
import RoleAndPermission from "./RoleAndPermission";
import Organization from "./Organization";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setOpenLoadingFalse } from "../../../store/slices/loadingSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RolePermission from "./RoleAndPermission/RolePermission";
import { useTranslation } from "react-i18next";
import CreateNewUser from "./User/User";
import EditUser from "./User/User";
import { TabNavigation } from "../../../components/CustomComponent";
function UsermanageMent() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("subMenuTab") || "organization"
  );
  const [dataTab, setDataTab] = useState([]);

  const dispatch = useDispatch();
  const childmenu = useSelector((state: RootState) => state.childmenu);

  const permissionPage = useSelector((state: RootState) => state.permissionPage);
  // console.log("🚀 ~ UsermanageMent ~ childmenu:", childmenu, permissionPage)

  useEffect(() => {

    dispatch(setOpenLoadingFalse());
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if(childmenu.length && permissionPage.permission ){
      if (localStorage.getItem("subMenuTab") === null) {
        navigate(
          `${localStorage.getItem("moduleSelect")}${childmenu[0].url}`
        );
      } else {
        navigate(
          `${localStorage.getItem(
            "moduleSelect"
          )}/user-management/${localStorage.getItem("subMenuTab")}`
        );
      }
        const convertCharacter: any = childmenu.map((item: any) => {
      return {
        url: item.url,
        oldName: item.menuName,
        convertName: item.menuName
          .replace(/&/g, "-")
          .replace(/\s+/g, "")
          .toLowerCase(),
        module: item.module,
      };
    });
    setDataTab(convertCharacter);
    }

  }, [navigate,childmenu,permissionPage]);

  const fixedNavigation = [
    {
      url: "/setting/user-management/organization",
      oldName: "Organization",
      convertName: "organization",
      module: "",
    },
    {
      url: "/setting/user-management/role-permission",
      oldName: "Role & Permission",
      convertName: "role-permission",
    },
    {
      url: "/setting/user-management/user",
      oldName: "User",
      convertName: "user",
    },
  ];


  return (
    <>
    {dataTab.length && 
location.pathname === "/setting/user-management/user/users" ? <CreateNewUser /> :
  location.pathname === "/setting/user-management/user/users" ? <EditUser /> : <><div className="bg-white w-full">
     <TabNavigation
      navigateTo={`${localStorage.getItem(
        "moduleSelect"
      )}/${localStorage.getItem("subMenuTab")}`}
      variant="contained"
      // tempValue={fixedNavigation}
    >
      {location.pathname === "/setting/user-management/organization" && (
        <Organization />
      )}
      {location.pathname === "/setting/user-management/role-permission" && (
        <RoleAndPermission />
      )}
          {location.pathname === "/setting/user-management/user" && (
        <User />
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
    </div></>}  
    
      
    </>
  );
}

export default UsermanageMent;
