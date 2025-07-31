import React, { useEffect } from "react";
import StandardPurpose from "./StandardPurpose";
import PreferencePurpose from "./PreferencePurpose";
import { Outlet, useLocation } from "react-router-dom";
import { TabNavigation } from "../../../components/CustomComponent";
import PreferencePurposeForm from "./PreferencePurpose/PreferencePurposeForm";
import StandardPurposeForm from "./StandardPurpose/StandardPurposeForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../../components/CustomComponent/Dropdown";
import Input from "../../../components/CustomComponent/InputText";

function Purpose() {
  const location = useLocation();
  const navigate = useNavigate();

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const childmenu = useSelector((state: RootState) => state.childmenu);

  const fixedNavigation = [
    {
      url: "/consent/purpose/standard-purpose",
      oldName: "Standard Purposes",
      convertName: "standard-purpose",
      module: "",
    },
    {
      url: "/consent/purpose/preference-purpose",
      oldName: "Preference Purpose",
      convertName: "preference-purpose",
    },
  ];

  useEffect(() => {
    if (location.pathname === "/consent/purpose" && childmenu.length > 0) {
      navigate(`/consent${childmenu[0]?.url}`);
    }
  }, [location.pathname, childmenu.length]);

  return (
    <div>
      {(location.pathname === "/consent/purpose/standard-purpose" ||
        location.pathname === "/consent/purpose/preference-purpose" ||
        location.pathname === "/consent/purpose") && (
        <TabNavigation
          navigateTo={`${localStorage.getItem(
            "moduleSelect"
          )}${localStorage.getItem("selectedSubMenu")}/${localStorage.getItem(
            "subMenuTab"
          )}`}
          variant="contained"
          // tempValue={fixedNavigation}
        >
          {location.pathname === "/consent/purpose/standard-purpose" && (
            <StandardPurpose />
          )}
          {location.pathname === "/consent/purpose/preference-purpose" && (
            <PreferencePurpose />
          )}
        </TabNavigation>
      )}
      {location.pathname.startsWith("/consent/purpose/preference-purpose/") && (
        <PreferencePurposeForm />
      )}
      {(location.pathname ===
        "/consent/purpose/standard-purpose/new-spurpose" ||
        location.pathname.startsWith(
          "/consent/purpose/standard-purpose/view-spurpose"
        ) ||
        location.pathname.startsWith(
          "/consent/purpose/standard-purpose/edit-spurpose"
        )) && <StandardPurposeForm />}
    </div>
  );
}

export default Purpose;
