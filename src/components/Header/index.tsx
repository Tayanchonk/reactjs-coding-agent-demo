import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import GroupIC from "../../assets/GroupIC.svg";
import { IoIosArrowDown } from "react-icons/io";
import { LuBellDot } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../../services/authenticationService";
import { getInterfaceBranding } from "../../services/interfaceAndBrandingService";
import { setReloadFalse } from "../../store/slices/reloadSlice";
import Select, { components } from "react-select";
import { getOrganizationChart } from "../../services/organizationService";
import { setOrgParent } from "../../store/slices/orgParentSlice";
import BtnPlus from "../../assets/plus-btn-w-bd.svg";
import { GetUserRolesByUserAccountId } from "../../services/rolePermissionService";

// Component สำหรับแสดงแต่ละ Node (Recursive)
interface TreeNodeProps {
  node: any;
  level?: number;
  onSelect: (node: any) => void;
  selectedNode: any;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level = 0,
  onSelect,
  selectedNode,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    onSelect(node);
  };

  const isLeaf = node.children.length === 0;

  return (
    <div style={{ marginLeft: level * 10, marginRight: level * 10, marginBottom: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "5px 10px",
          borderRadius: "4px",
          backgroundColor:
           level !== 0 && selectedNode?.organizationId === node.organizationId
              ? "#3758F9"
              : "transparent",
          color:
          level !== 0 && selectedNode?.organizationId === node.organizationId
              ? "#fff"
              : "#000",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (
          (e.currentTarget.style.backgroundColor = "#F6F6F6"),
          (e.currentTarget.style.color = "#000")
        )}
        onMouseLeave={(e) => {
          (e.currentTarget.style.backgroundColor =
            level !== 0 && selectedNode?.organizationId === node.organizationId
              ? "#3758F9"
              : "transparent"),
            (e.currentTarget.style.color =
              level !== 0 && selectedNode?.organizationId === node.organizationId
                ? "#fff"
                : "#000");
        }}
      >
        {level > 0 && !isLeaf && (
          <span
            onClick={handleToggle}
            style={{ marginRight: 2, cursor: "pointer" }}
            className="rounded-md hover:bg-gray-100"
          >
            {expanded ? (
              <div className="bg-[#eeeeee] rounded-sm h-[18px] w-[18px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="size-4 m-auto pt-[2px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </div>
            ) : (
              <div className="bg-[#eeeeee] rounded-sm h-[18px] w-[18px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="size-4 m-auto pt-[2px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            )}
          </span>
        )}
        {level === 0 ? (
          <div onClick={handleSelect} className="flex w-full py-3 border-b ">
            <img
              src={GroupIC}
              className="h-[28px] mr-3 w-2/12"
              alt="GroupLogo"
            />
            <p className="text-base font-semibold"> {node.organizationName}</p>
          </div>
        ) : (
          <span onClick={handleSelect} className="flex ml-2 text-base">
            {node.organizationName}
          </span>
        )}
      </div>

      {expanded && (
        <div style={{ marginTop: 4, marginLeft: 10 }}>
          {node.children.map((child: any) => (
            <TreeNode
              key={child.organizationId}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedNode={selectedNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// DropDown ตัวหลัก
const CustomTreeDropdown = ({
  data,
  onSelect,
  selectedNode,
}: {
  data: any[];
  onSelect: (node: any) => void;
  selectedNode: any;
}) => {
  return (
    <div
      style={{
        // border: "1px solid gainsboro",
        boxShadow: 'rgba(222, 220, 220, 0.9) 0px 4px 6px 0px',

        // padding: 10,
        width: 320,
        position: "relative",
        left: -20,
        top: 5,
        backgroundColor: "#fff",
        color: "#232323",
        overflowY: "auto",
        borderRadius: 10,
      }}
    >
      {data.map((node) => (
        <TreeNode
          key={node.organizationId}
          node={node}
          onSelect={onSelect}
          selectedNode={selectedNode}
        />
      ))}
    </div>
  );
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const reload = useSelector((state: RootState) => state.reload.reload);
  const reloadorg = useSelector(
    (state: RootState) => state.reloadorg.reloadorg
  );
  const themeColor = useSelector((state: any) => state.theme.themeColor);
  const open = useSelector((state: RootState) => state.opensidebar.open);
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );

  const language = useSelector((state: RootState) => state.language.language);
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [dataOptionOrg, setDataOptionOrg] = useState<any>([]);
  const [defaultOrg, setDefaultOrg] = useState<any>([]);
  const navigate = useNavigate();
  const [theme, setTheme] = useState({
    headerBarBGColor: "",
    headerBarTextColor: "",
    pageTitle: "",
    logoPicMainPageUrl: "",
    enableOverrideBranding: false,
  });
  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = JSON.parse(getUserSession);

  const getDataSession = sessionStorage.getItem("user");
  const user = getDataSession ? JSON.parse(getDataSession) : null;
  const customer_id = user ? user.customer_id : null;
  const [organizationData, setOrganizationData] = useState<any>([]);
  const fetchOrganization = async (orgparent: string) => {
    try {
      await getOrganizationChart(customerId.customer_id).then((res) => {
        if (res.data.isError === false) {
          const flattenData = (
            data: any,
            prefix = "",
            level = 0
          ): { label: string; value: any }[] => {
            let result: { label: string; value: any }[] = [];

            // สร้าง label พร้อม prefix ตามระดับชั้น
            const currentItem = {
              value: data.id,
              label: data.orgName, // ใส่ prefix นำหน้า orgName
            };
            result.push(currentItem);

            // วนซ้ำทุก organizationChildRelationship และเพิ่ม prefix ทีละระดับ
            if (
              data.organizationChildRelationship &&
              Array.isArray(data.organizationChildRelationship)
            ) {
              data.organizationChildRelationship.forEach((child: any) => {
                result = result.concat(
                  flattenData(child, prefix + "-", level + 1)
                );
              });
            }

            return result;
          };

          const transformedData = flattenData(res.data.data[0]);
          setDataOptionOrg(transformedData);
          const filterSelectOrg = transformedData.filter(
            (item: any) => item.value === orgparent
          );
          setDefaultOrg(filterSelectOrg);
        }
      });
    } catch (error) {
      console.error("Fetch organization failed:", error);
    }
  };

  useEffect(() => {
    const currentOrg = localStorage.getItem("currentOrg");
    const getUserRole = sessionStorage.getItem("user");
    const user = getUserRole ? JSON.parse(getUserRole).user_account_id : null;
    if (currentOrg) {
      const parsedOrg = JSON.parse(currentOrg);
      const currentOrgId = parsedOrg.organizationId;
      setSelected(parsedOrg);
      dispatch(setOrgParent(parsedOrg.organizationId));

      GetUserRolesByUserAccountId(user).then((res) => {
        if (res.data.data.length) {
          const getIsTopOrg = res.data.data.filter(
            (item: any) => item.isTopLevel === true
          );
          if (getIsTopOrg.length) {
            const sortOrganizations = (data: any) => {
              return data
                .map((org: any) => ({
                  ...org,
                  children: sortOrganizations(org.children),
                }))
                .sort((a: any, b: any) =>
                  a.organizationName.localeCompare(b.organizationName)
                );
            };
            const sort = sortOrganizations(getIsTopOrg);
            setOrganizationData(sort);
            // setSelected(getIsTopOrg[0]);
            // dispatch(setOrgParent(getIsTopOrg[0].organizationId));
            // localStorage.setItem("currentOrg", JSON.stringify(getIsTopOrg[0]));
          } else {
            setOrganizationData(res.data.data);
            setSelected(JSON.parse(currentOrg));
            // dispatch(setOrgParent(res.data.data[0].organizationId));
            // localStorage.setItem("currentOrg", JSON.stringify(res.data.data[0]));
          }
        }
      });
    } else {
      GetUserRolesByUserAccountId(user).then((res) => {
        if (res.data.data.length) {
          const getIsTopOrg = res.data.data.filter(
            (item: any) => item.isTopLevel === true
          );
          if (getIsTopOrg.length) {
            setOrganizationData(getIsTopOrg);
            setSelected(getIsTopOrg[0]);
            dispatch(setOrgParent(getIsTopOrg[0].organizationId));
            localStorage.setItem("currentOrg", JSON.stringify(getIsTopOrg[0]));

            const customEvent = new CustomEvent("currentOrgChanged", { detail: getIsTopOrg[0] });
            window.dispatchEvent(customEvent);
          } else {
            setOrganizationData(res.data.data);
            setSelected(res.data.data[0]);
            dispatch(setOrgParent(res.data.data[0].organizationId));
            localStorage.setItem(
              "currentOrg",
              JSON.stringify(res.data.data[0])
            );
          }
        }
      });
    }
  }, [reloadorg]);

  // useEffect(() => {
  //   const getUserRole = sessionStorage.getItem("user");
  //   const user = getUserRole ? JSON.parse(getUserRole).user_account_id : null;

  //   GetUserRolesByUserAccountId(user).then((res) => {
  //     if (res.data.data.length) {
  //       const getIsTopOrg = res.data.data.filter(
  //         (item: any) => item.isTopLevel === true
  //       );

  //       if (getIsTopOrg.length) {
  //         setOrganizationData(getIsTopOrg);
  //         setSelected(getIsTopOrg[0]);
  //         dispatch(setOrgParent(getIsTopOrg[0].organizationId));
  //         localStorage.setItem("currentOrg", JSON.stringify(getIsTopOrg[0]));
  //       } else {
  //         setOrganizationData(res.data.data);
  //         setSelected(res.data.data[0]);
  //         dispatch(setOrgParent(res.data.data[0].organizationId));
  //         localStorage.setItem("currentOrg", JSON.stringify(res.data.data[0]));
  //       }
  //     }
  //   });
  // }, []);
  useEffect(() => {
    fetchOrganization(orgparent);
  }, [orgparent]);

  useEffect(() => {
    getInterfaceBranding(customer_id).then((res) => {
      setTheme({
        headerBarBGColor: res?.data.headerBarBGColor,
        headerBarTextColor: res?.data.headerBarTextColor,
        pageTitle: res?.data.pageTitle,
        logoPicMainPageUrl: res?.data.logoPicMainPageUrl,
        enableOverrideBranding: res?.data.enableOverrideBranding,
      });
    });
    dispatch(setReloadFalse());
  }, [reload]);

  useEffect(() => {
    setPaddingLeft(open ? 350 : 68); // ปรับค่าตามความกว้างของ Sidebar
  }, [open]);

  // const [selected, setSelected] = useState<any>(null);
  // console.log("🚀 ~ Header ~ selected:", selected)

  const [selected, setSelected] = useState<any>(() => {
    const currentOrg = localStorage.getItem("currentOrg");
    return currentOrg ? JSON.parse(currentOrg) : null;
  });
  const [opens, setOpens] = useState(false);

  const handleSelect = (node: any) => {
    setSelected(node);
    dispatch(setOrgParent(node.organizationId));
    localStorage.setItem("currentOrg", JSON.stringify(node));
    setOpens(false); // ปิด dropdown หลังเลือก
  };

  return (
    <div className={`duration-500 w-full fixed z-10`} style={{ paddingLeft }}>
      <div
        className=" h-[75px] flex justify-between items-center px-5"
        style={{
          background:
            theme.headerBarBGColor && theme.enableOverrideBranding === true
              ? theme.headerBarBGColor
              : themeColor.mainColor,
        }}
      >
        <p className="text-xl font-normal text-gray-50 s:hidden">
          <span
            className="text-base font-semibold"
            style={{
              color:
                theme.headerBarTextColor &&
                theme.enableOverrideBranding === true
                  ? theme.headerBarTextColor
                  : "#fff",
            }}
          >
            {theme.pageTitle}{" "}
          </span>
        </p>
        <div className="flex items-center space-x-4">
          {/* <IoIosSearch className="text-white text-[28px] cursor-pointer" />{" "}
          <LuBellDot className="text-white text-[28px] cursor-pointer" />{" "} */}
          <div style={{ position: "relative", width: 300 }}>
            <div
              className="p-[8px] flex text-white cursor-pointer bg-[#232323] h-[40px] rounded-md"
              onClick={() => setOpens(!opens)}
            >
              <img
                src={GroupIC}
                className="h-[24px] mr-3 w-2/12"
                alt="GroupLogo"
              />
              <div className="my-auto w-8/12 pt-[3px] font-semibold text-base">
                {selected ? selected.organizationName : "Select Organization"}
              </div>
              <IoIosArrowDown className="w-2/12 text-white text-[24px] cursor-pointer" />
            </div>

            {opens && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1000,
                  // backgroundColor: "white",
                  // boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <CustomTreeDropdown
                  data={organizationData}
                  onSelect={handleSelect}
                  selectedNode={selected}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
