import React, { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const menuDescription = useSelector(
    (state: RootState) => state.menuDescription
  );
  const menuHeader = useSelector(
    (state: RootState) => state.menuHeaderSlice
  );
  const menuBreadcrumb = useSelector(
    (state: RootState) => state.menuBreadcrumbSlice
  );
  const rawPathnames = location.pathname.split("/").filter((x) => x);
  const navigate = useNavigate();
  const stopIndex = rawPathnames.findIndex((x) =>
    ["create", "view", "edit"].includes(x)
  );
  const pathnames =
    stopIndex > 0

      ? [
        ...rawPathnames.slice(0, stopIndex),
        `${rawPathnames[stopIndex]}-${rawPathnames[stopIndex - 1]}`,
      ]
      : rawPathnames;
  const pathSize = ["consent"].includes(pathnames[0]) ? 2 : 3;
  const { t } = useTranslation();
      
  if (location.pathname === "*") {
    return null;
  }

  const getNameFromLocalstorage = localStorage.getItem("nameConsent");

  return (
    <nav className="breadcrumb">
      <ul className="flex space-x-2">
        {menuBreadcrumb.length > 0 ? menuBreadcrumb.map((item, index) => {
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mr-2 text-base text-[#637381]">{`>`}</span>
              )}
              {/* last item disable click  */}
              {index === menuBreadcrumb.length - 1 ? (
                <span className="text-base text-[#637381]">{t(item.title)}</span>
              ) : (
                <span
                  className="cursor-pointer text-base text-[#637381]"
                  onClick={() => {
                    navigate(item.url);
                  }}
                >
                  {t(item.title)}
                </span>
              )}
            </li>
          );
        }) : pathnames.slice(0, pathSize).map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <li key={to} className="flex items-center">
              {index > 0 && (
                <span className="mr-2  text-base  text-[#637381]">{`>`}</span>
              )}

              <div
                className="cursor-pointer"
                onClick={() => {
                  if (
                    index === pathSize - 1 &&
                    (location.pathname.includes("edit") ||
                      location.pathname.includes("view") ||
                      location.pathname.includes("create")) &&
                    index >= 2
                  ) {
                    console.log("edit");
                  } else {
                    navigate(to);
                  }
                }}
              >
                <span className="text-base text-[#637381]">
                  {t("path." + value, t("errorPage.404.title"))}
                </span>
              </div>
            </li>
          );
        })}
        {pathnames.length > 0 &&
          location.pathname.startsWith("/consent/purpose") && (
            <li className="flex items-center text-[#637381]">
              <span className="mr-2 text-base text-[#637381]">{`>`}</span>
              <span className="text-base text-[#637381]">
                {location.pathname.startsWith(
                  "/consent/purpose/standard-purpose/edit-spurpose"
                )
                  ? t("path.edit-spurpose")
                  : location.pathname.startsWith(
                    "/consent/purpose/standard-purpose/view-spurpose"
                  )
                    ? t("path.view-spurpose")
                    : t(
                      "path." + pathnames[pathnames.length - 1],
                      t("errorPage.404.title")
                    )}
              </span>
            </li>
          )}
      </ul>
      {pathnames.length > 0 && (
        <>
          <div className="block mt-2 font-semibold text-[26px]">
            {menuHeader.length > 0 ? t(menuHeader) : location.pathname.startsWith(
              "/consent/purpose/standard-purpose/edit-spurpose"
            )
              ? t("path.edit-spurpose")
              : location.pathname.startsWith(
                "/consent/purpose/standard-purpose/view-spurpose"
              )
                ? t("path.view-spurpose")
                : t(
                  "path." + pathnames[pathnames.length - 1],
                  t("errorPage.404.title")
                ) }
                {getNameFromLocalstorage && (` : ${getNameFromLocalstorage}`) }
          </div>
          {
            <p className="block text-base text-red flex">
              {menuDescription.length > 0 ? t(menuDescription) : null}
            </p>
          }
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
