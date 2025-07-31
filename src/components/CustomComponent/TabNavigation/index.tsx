import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useLocation, useNavigate } from "react-router-dom";
type TabNavigationProps = {
  children?: React.ReactNode;
  navigateTo: string;
  variant?: "contained" | "outlined";
  buttonGroup?: React.ReactNode;
  tempValue?: any;
};
const index = ({
  children,
  navigateTo,
  variant = "contained",
  buttonGroup,
  tempValue,
}: TabNavigationProps) => {
  const { t, i18n } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();
  const language = useSelector((state: RootState) => state.language.language);

  const childmenu = useSelector((state: RootState) => state.childmenu);
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage
  );
  const [dataTab, setDataTab] = useState([]);
  const [moduleSelect, setModuleSelect] = useState(
    localStorage.getItem("moduleSelect")
  );

  useEffect(() => {
    if (!tempValue) {
      if (childmenu.length && permissionPage.permission) {
        if (
          localStorage.getItem("subMenuTab") === null &&
          childmenu.length > 0
        ) {
          navigate(`${moduleSelect}${childmenu[0].url}`);
        }
        const convertCharacter: any = childmenu.map((item: any) => {
          return {
            url: item.url,
            oldName: item.menuName,
            convertName: item.menuName
              .replace(/&/g, "-")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .toLowerCase(),
          };
        });

        setDataTab(convertCharacter);
      }
    } else {
      setDataTab(tempValue);
      setModuleSelect(tempValue[0].module);
    }
  }, [navigate, childmenu, permissionPage, tempValue]);

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return (
    <div className="bg-white w-full">
      <div>
        <nav className="flex border-b justify-between">
          <div className="flex ">
            {dataTab.map((d: any, i) => {
              return (
                <div
                  key={i}
                  className={`p-3  ${
                    location.pathname === `${moduleSelect}${d.url}` &&
                    variant === "outlined"
                      ? "border-b border-primary-blue"
                      : ""
                  }`}
                >
                  <button
                    key={i}
                    className={`py-2 px-7 font-semibold rounded-lg ${
                      location.pathname === `${moduleSelect}${d.url}` &&
                      variant === "contained"
                        ? " bg-[#f5f7ff]"
                        : " hover:text-gray-700"
                    }
                ${
                  location.pathname === `${moduleSelect}${d.url}`
                    ? "text-blue-600 "
                    : "text-gray-500 "
                }
                  `}
                    onClick={() => {
                      navigate(`${moduleSelect}${d.url}`);
                      localStorage.setItem(
                        "subMenuTab",
                        d.convertName.toLowerCase()
                      );
                    }}
                  >
                    {d.convertName ? t(`path.${d.convertName}`) : ""}
                  </button>
                </div>
              );
            })}
          </div>
          {buttonGroup && <div className="p-3 gap-1">{buttonGroup}</div>}{" "}
        </nav>
      </div>
      <div className="mx-3 pt-5 pb-10  px-14">{children}</div>
    </div>
  );
};

export default index;
