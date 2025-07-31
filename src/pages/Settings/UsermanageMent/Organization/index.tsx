import React, { useState, useEffect, useRef } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
// import { Button } from "@headlessui/react";
import _ from "lodash";
import { InputText,Button,MoreButton } from "../../../../components/CustomComponent";
import { FaBusinessTime, FaBalanceScale, FaSearch } from "react-icons/fa"; // ใช้ไอคอนจาก React Icons
// import organization from "./org.json";
import "./style.css";
import CreateOrganization from "./Drawer/CreateOrganization";
import { getData } from "../../../../services/apiService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import {
  setCloseDrawerOrgCreate,
  setOpenDrawerOrgCreate,
} from "../../../../store/slices/openDrawerCreateOrg";
import {
  setOpenModalCFOrg,
  setCloseModalCFOrg,
} from "../../../../store/slices/openModalCFOrg";
import {
  setOpenAlert,
  setCloseAlert,
} from "../../../../store/slices/openAlertSlice";
import ModalCFOrganization from "../../../../components/Modals/ModalCFOrganization";
import Alert from "../../../../components/Alert";
import { getOrganizationChart } from "../../../../services/organizationService";
import {
  setOpenLoadingTrue,
  setOpenLoadingFalse,
} from "../../../../store/slices/loadingSlice";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../../../components/LoadingSpinner";
// กำหนด type สำหรับข้อมูลที่ใช้ใน Org, Account และ Product
type OrganizationType = {
  id: string;
  orgName: string;
  bgColor: string;
  textColor: string;
  nameUser: string;
  collapsed: boolean;
  organizationChildRelationship: OrganizationType[];
  color?: string;
  childOrg: ChildOrg[];
  organizationLevel: number;
  isActiveStatus: boolean;
};

type ChildOrg = {
  id: string;
  orgName: string;
  nameUser: string;
  color?: string;
  // product: ProductType;
};

// type ProductType = {
//   orgName: string;

// };

// ฟังก์ชันที่ใช้แทนการตกแต่งด้วย MUI

const highlightOrganizations = (
  org: OrganizationType,
  term: string
): OrganizationType => {
  if (!term) {
    // ถ้าไม่มีคำค้นหา คืนค่าโครงสร้างเดิมโดยไม่เปลี่ยนแปลง
    return {
      ...org,
      color: undefined,
      childOrg:
        org?.childOrg?.map((child) => ({
          ...child,
          color: undefined,
        })) || [],
      organizationChildRelationship:
        org?.organizationChildRelationship?.map((child) =>
          highlightOrganizations(child, term)
        ) || [],
    };
  }

  // ตรวจสอบว่า orgName ตรงกับคำค้นหา
  const isMatch = org.orgName.toLowerCase().includes(term.toLowerCase());

  // ประมวลผล childOrg แบบ Recursive
  const highlightedChildOrgs =
    org.childOrg?.map((child) => ({
      ...child,
      color: child.orgName.toLowerCase().includes(term.toLowerCase())
        ? "red"
        : undefined,
    })) || [];

  // ประมวลผล organizationChildRelationship แบบ Recursive
  const highlightedChildren =
    org.organizationChildRelationship?.map((child) =>
      highlightOrganizations(child, term)
    ) || [];

  // คืนค่าโครงสร้างพร้อมเพิ่มสีในโหนดที่ตรง
  return {
    ...org,
    color: isMatch ? "red" : undefined,
    childOrg: highlightedChildOrgs,
    organizationChildRelationship: highlightedChildren,
  };
};

function Organization({
  org,
  onCollapse,
  collapsed,
}: {
  org: OrganizationType;
  onCollapse: () => void;
  collapsed: boolean;
}) {
  
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const permissionPage = useSelector((state: RootState) => state.permissionPage.permission);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
 
  return (
    <div
      ref={ref}
      style={
        org.bgColor
          ? { backgroundColor: org.color || org.bgColor }
          : { backgroundColor: org.color || "#fff" }
      }
      className={`bg-[${org.bgColor ? org.bgColor : "#fff"}] w-[${
        org.bgColor ? "350px" : "350px"
      }]  h-[105px] m-auto border border-gray-300 rounded-lg p-4  ${
        collapsed ? "shadow-md" : ""
      } `}
    >
      <div className="flex justify-between ">
        <div className="flex ">
          <div className={`relative cursor-pointer`}>
    
            <div
              style={
                org.color || org.bgColor ? { color: "#fff" } : { color: "#000" }
              }
              className={`text-l text-left font-semibold ${
                org.bgColor && `text-white`
              }`}
            >
              {org.orgName} 
         
            </div>
         
            <div
              style={
                org.color || org.bgColor ? { color: "#fff" } : { color: "#000" }
              }
              className={`text-base ${org.bgColor && "text-white"} text-left`}
            >
              {org.nameUser}
            </div>
          </div>
        </div>
        {permissionPage.isRead === true && permissionPage.isCreate === false && permissionPage.isUpdate === false && permissionPage.isDelete === false ? null :
          <button onClick={handleClick} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={org.bgColor ? "white" : "black"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-6 ${(org.bgColor || org.color) && "text-[#fff]"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </button>
        }

      
        {anchorEl && (
          <div
            className={`absolute mt-2 bg-white shadow-lg rounded-md z-20 w-[200px] ml-[95px] mt-[60px]`}
          >
                {(permissionPage.isCreate && org.isActiveStatus && org.organizationLevel < 3) && <div
              className="flex items-center p-3 cursor-pointer hover:bg-gray-200 border-b border-solid"
              onClick={() =>
             { 
                dispatch(
                  setOpenDrawerOrgCreate({ id: org.id, type: "createOrgById" })
                )
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="ml-2 text-base">{t('settings.organizations.add')}</span>
            </div>}
            {permissionPage.isUpdate &&    
              <div
                className="flex items-center p-3 cursor-pointer hover:bg-gray-200  border-b border-solid"
                onClick={() =>
                  dispatch(
                    setOpenDrawerOrgCreate({ id: org.id, type: "updateOrgById",isParent: org.bgColor !== null ? true : false })
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>

                <span className="ml-2 text-base">{t('settings.organizations.edit')}</span>
              </div>
            }
            {(permissionPage.isDelete && org.bgColor === null ) &&
              <div
                className="flex items-center p-3 cursor-pointer hover:bg-gray-200  border-b border-solid"
                onClick={() =>
                  dispatch(
                    setOpenModalCFOrg({ idOrg: org.id, typeModal: "delete" })
                  )
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>

                <span className="ml-2 text-base">{t('settings.organizations.delete')}</span>
              </div>
            }
           
          </div>
        )}
      </div>

      {org.childOrg?.length || org.organizationChildRelationship?.length ? (
        <button
          onClick={onCollapse}
          className={`${
            org.bgColor ? "mt-[10px]" : "mt-[10px]"
          } text-gray-500 hover:text-gray-700`}
        >
          <span
            className={`material-icons transform transition-transform ${
              collapsed ? "" : "rotate-180"
            } pt-[10px]`}
          >
            {collapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </span>
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

function ChildOrg({ a }: { a: ChildOrg }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return (
    <div ref={ref}>
      <div
        style={{ backgroundColor: a.color || "#fff" }}
        className="flex bg-white border border-gray-300 w-[350px] h-[105px] rounded-lg p-4 cursor-pointer hover:shadow-lg"
      >
        <div className="flex justify-between w-full">
          <div className="w-[5px] h-[70px] rounded-full bg-[#3758F9] mr-4"></div>
          <div className="w-full">
            <div
              style={a.color ? { color: "#fff" } : { color: "#000" }}
              className="text-l text-left"
            >
              {a.orgName}
            </div>
            <div
              style={a.color ? { color: "#fff" } : { color: "#000" }}
              className={`text-sm text-left font-normal`}
            >
              {a.nameUser}
            </div>
          </div>
          <button onClick={handleClick} className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={"black"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 ${a.color && "text-[#fff]"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </button>
        </div>
      </div>
      {anchorEl && (
        <div
          className={`absolute mt-2 bg-white shadow-lg rounded-md z-20 w-[200px] ml-[360px] top-0`}
        >
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-200 border-solid ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="ml-2 text-sm">Addx</span>
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-200  border-b border-solid">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>

            <span className="ml-2 text-sm">Edit</span>
          </div>
          <div className="flex items-center p-3 cursor-pointer hover:bg-gray-200   border-solid">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>

            <span className="ml-2 text-sm">Delete</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Node({
  o,
  parent,
}: {
  o: OrganizationType;
  parent?: OrganizationType;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(o.collapsed);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    o.collapsed = collapsed;
  }, [collapsed]);

  const T = parent
    ? TreeNode
    : (props: { children: React.ReactNode }) => (
        <Tree
          {...props}
          lineWidth={"3px"}
          lineColor={"#0078D4"}
          lineBorderRadius={"10px"}
          // nodePadding={"10px"}
          lineHeight={"60px"}
        >
          {props.children}
        </Tree>
      );

  return collapsed ? (
    <T
      label={
        <Organization
          org={o}
          onCollapse={handleCollapse}
          collapsed={collapsed}
        />
      }
    />
  ) : (
    <T
      label={
        <Organization
          org={o}
          onCollapse={handleCollapse}
          collapsed={collapsed}
        />
      }
    >
      {_.map(o.childOrg, (a: any, i: number) => (
        <TreeNode key={i} label={<ChildOrg a={a} />}>
          {/* <TreeNode label={<Product p={a.product} />} /> */}
        </TreeNode>
      ))}
      {_.map(o.organizationChildRelationship, (c: any, i: number) => (
        <Node key={i} o={c} parent={o} />
      ))}
    </T>
  );
}

export default function UserManagement() {

  const { t, i18n } = useTranslation();
  const [scale, setScale] = useState(1);
  const [collapsed, setCollapsed] = useState(true);
  const [organizations, setOrganizations] =
    useState<OrganizationType>({}); // Assuming initialOrganization is defined

  const [openCreateOrganization, setOpenCreateOrganization] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedOrganizations, setHighlightedOrganizations] =
    useState<OrganizationType>({});
  const [loading, setLoading] = useState(true);

  const getUserSession:any = sessionStorage.getItem("user");
  const customerId = JSON.parse(getUserSession);
  // for add Org from Chart
  const dispatch = useDispatch();

  const { openDrawer, id, type } = useSelector(
    (state: RootState) => state.opendrawercreateorg
  );
  const { openModal, idOrg, typeModal, data } = useSelector(
    (state: RootState) => state.openmodalcforg
  );
  const { openAlert, description, typeAlert } = useSelector(
    (state: RootState) => state.openalert
  );

  const permissionPage = useSelector((state: RootState) => state.permissionPage.permission);
  const language = useSelector((state: RootState) => state.language.language);
  const orgparent = useSelector((state: RootState) => state.orgparent.orgParent);
  const openDrawerCreateOrganization = () => {
    setOpenCreateOrganization(!openCreateOrganization);
  };

  const fetchOrganization = async (orgParent:string) => {
    try {
      // dispatch(setOpenLoadingTrue());
      getOrganizationChart(customerId.customer_id,orgParent).then(
        (res) => {
          if (res.data.isError === false) {
        

            // const filterMain = res.data.data.filter(
            //   (org: any) => org.orgName === "PDPA Team Main"
            // );
            setOrganizations(res.data.data[0]);
            dispatch(setOpenLoadingFalse());
            // setOpenLoadingFalse();
          }
          setLoading(false)
        }
      );
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };

  const collapseAllNodes = () => {
    const toggleNodes = (org: OrganizationType, collapse: boolean) => {
      org.collapsed = collapse;
      if (org.organizationChildRelationship) {
        org.organizationChildRelationship.forEach((child) =>
          toggleNodes(child, collapse)
        );
      }
    };
    let newOrg = { ...organizations };

    const shouldCollapse = !newOrg.collapsed; // Determine if we should collapse or expand based on the current state
    toggleNodes(newOrg, shouldCollapse);
    setOrganizations(newOrg);
    setCollapsed(!collapsed);
  };

  const collapseToRootNode = () => {
    const collapseToRoot = (org: any) => {
      // Retain only the root-level information
      return {
        orgName: org.orgName,
        nameUser: org.nameUser,
        bgColor: org.bgColor,
        textColor: org.textColor,
        collapsed: true, // Ensure root node is marked as collapsed
      };
    };

    const newOrg = collapseToRoot(organizations); // Collapse the structure to the root node
    setOrganizations(newOrg); // Update the state with the collapsed structure
    setCollapsed(true); // Mark the state as collapsed
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    const highlighted = highlightOrganizations(organizations, searchTerm);
    setHighlightedOrganizations(highlighted);
  }, [searchTerm, organizations]);

  useEffect(() => {
    if(orgparent !== "") fetchOrganization(orgparent);
  }, [orgparent]);
  // refresh data Org Chart when openDrawer close
  useEffect(() => {
    if (openDrawer === false || openModal === false) {
      if(orgparent !== "") fetchOrganization(orgparent);
    }
  }, [openDrawer, openModal]);

  return (
    <>
    {loading ? <LoadingSpinner /> : <>
      <div className="pl-1 pb-7">
        <h2 className="text-xl font-semibold">{t('settings.organizations.header')}</h2>
        <p className="text-base">
         {t('settings.organizations.description')}
        </p>
        <div className="flex">
          <div className="w-6/12 relative w-auto  my-auto mx-0 pt-3">
            <div className="absolute inset-y-3 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            {/* <input
              type="text"
              className="pl-10 pr-4 py-1 text-black text-sm w-[350px]  h-[42px] border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('userManagement.search')}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> */}
            <InputText
                  onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder={t('userManagement.search')}
              minWidth="20rem"
              height="2.625rem"
              className="text-base"
            ></InputText>
          </div>
          <div className="w-8/12 m-auto pt-3 text-right">
            <Button
              onClick={collapseAllNodes}
              className="rounded mx-1 bg-white py-2 px-4 text-base  border border-1 border-gray-200 text-blue font-medium"
            >

              {collapsed ? t("settings.organizations.collapseAll") :  t('settings.organizations.expandAll')}
            </Button>
            {(permissionPage.isCreate && highlightedOrganizations.organizationLevel !== 3) && <Button
              onClick={() =>
                dispatch(setOpenDrawerOrgCreate({ id: "", type: "createNew" }))
              }
              className="rounded mx-1 bg-[#3759f9] py-2 px-4 border border-1 border-[#3759f9] text-white font-medium"
            >
             { t("settings.organizations.createNew") }
            </Button>}
           
          </div>
        </div>
      </div>
      <div className="bg-[#f8f8fb] p-4 h-full w-full">
        <div className="mb-4">
          <button
            onClick={handleZoomIn}
            className="mr-2 p-2 bg-blue-500 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
              />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-blue-500 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
              />
            </svg>
          </button>
        </div>
        <div
          className="custom-chart-css"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            width: `${100 * scale}%`,
          }}
        >
          <Node o={highlightedOrganizations} />
        </div>
      </div>

      {openDrawer && (
        <div
          className="fixed z-[12] inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={() =>
            dispatch(setOpenModalCFOrg({ idOrg: "", typeModal: "cancel" }))
          }
        ></div>
      )}

      <CreateOrganization openCreateOrganization={openDrawer} />
      {openModal && (
        <ModalCFOrganization type={typeModal} id={idOrg} data={data} />
      )}
      {openAlert && <Alert typeAlert={typeAlert} description={description} />}
    </>}
   
      
    </>
  );
}
