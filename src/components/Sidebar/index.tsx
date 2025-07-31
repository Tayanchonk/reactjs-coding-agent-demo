import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, MenuButton, MenuItems, Button } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { IoApps } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ConsentIC from "../../assets/consent-ic.svg";
import AnalyticIC from "../../assets/analytics-ic.svg";
import SettingIC from "../../assets/Editable-line.svg";
import DashboardIC from "../../assets/Dashboard.svg";
import { MdLogout } from "react-icons/md";
import Logo from "../../assets/mcf-logo.svg";
import LogoWhite from "../../assets/mcf-logo-w.svg";
import { MenuData } from "./interfaces";
import imgProfile from "../../assets/images/imgProfile.jpg";
// import { menuData, menus } from "./mock-data";
import { RootState } from "../../store";
import {
  setShowSearchTrue,
  setShowSearchFalse,
} from "../../store/slices/showSearchSlice";
import { setModules } from "../../store/slices/module";
import {
  setOpenTrue,
  setOpenFalse,
  toggleOpen,
} from "./../../store/slices/openSidebarSlice";
import {
  setLanguageEn,
  setLanguageTh,
} from "./../../store/slices/languageSlice";
import { setChildMenu } from "../../store/slices/childMenuSlice";
import { handleURLforActiveSubmenu } from "../../utils/Utils";
import "./style.css";
import ModalChangePassword from "../Modals/ModalChangePassword";
import Alert from "../Alert";
import { useTranslation } from "react-i18next";
import { getData } from "../../services/apiService";
import {
  setOpenLoadingTrue,
  setOpenLoadingFalse,
} from "../../store/slices/loadingSlice";
import { getUserInfo, logOutUser } from "../../services/authenticationService";
import { getMenuList } from "../../services/menuService";
import { useNavigate } from "react-router-dom";
import { getInterfaceBranding } from "../../services/interfaceAndBrandingService";
import { setReloadFalse } from "../../store/slices/reloadSlice";

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  // --------------- STATE AND GLOBAL STATE -----------------
  const navigate = useNavigate();
  const themeColor = useSelector((state: RootState) => state.theme.themeColor);
  const open = useSelector((state: RootState) => state.opensidebar.open);
  const showSearch = useSelector((state: RootState) => state.showSearch.value);
  const childmenu = useSelector((state: RootState) => state.childmenu);
  const reload = useSelector((state: RootState) => state.reload.reload);
  // console.log("🚀 ~ childmenu:", childmenu)

  // let language = useSelector((state: RootState) => state.language.language);
  const language = localStorage.getItem("i18nextLng") || "en";
  const dispatch = useDispatch();

  const location = useLocation();
  const getUserSession: any = sessionStorage.getItem("user");
  const userAccountId = JSON.parse(getUserSession);
  // get data from local storage
  const activeMenuLocalStorage = localStorage.getItem("activeMenu");
  const selectedSubMenuLocalStorage = localStorage.getItem("selectedSubMenu");

  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem("activeMenu") || "setting/interface-branding";
  });

  const [selectSubMenu, setSelectSubMenu] = useState(
    localStorage.getItem("selectedSubMenu") || ""
  );
  const [dataMenu, setDataMenu] = useState<MenuData[]>([]);


  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [module, setModule] = useState([]);

  // console.log("🚀 ~ module:", module)
  const [menuData, setmenuData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [originalDataMenu, setOriginalDataMenu] = useState<MenuData[]>([]);

  const [theme, setTheme] = useState({
    mainMenuBGColor: "",
    mainMenuHoverColor: "",
    mainMenuTextColor: "",
    subMenuBGColor: "",
    subMenuHoverColor: "",
    subMenuTextColor: "",
    logoPicMainPageUrl: "",
    enableOverrideBranding: false,
  });

  // --------------- FUNCTION -----------------
  const toggleLanguage = () => {
    if (language === "en") {
      dispatch(setLanguageTh());
    } else {
      dispatch(setLanguageEn());
    }

    let leg = language === "en" ? "th" : "en";
    localStorage.setItem("i18nextLng", leg); // เก็บภาษาที่เลือกใน localStorage
    i18n.changeLanguage(leg);
  };

  const handleLogout = async () => {
    try {
      await logOutUser();
      sessionStorage.clear();
      clearlocalStorage();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const clearlocalStorage = async () => {
    Object.keys(localStorage).forEach((k) => {
      if (k !== "companylogoicon") {
        localStorage.removeItem(k);
      }
    });
  };
  // --------------- USE EFFECT -----------------

  useEffect(() => {
    // if(reload === true){

    // getInterfaceBranding
    getInterfaceBranding(userAccountId.customer_id).then((res) => {
      localStorage.setItem("companylogoicon", res?.data.logoPicMainPageUrl);
      setTheme({
        mainMenuBGColor: res?.data.mainMenuBGColor,
        mainMenuHoverColor: res?.data.mainMenuHoverColor,
        mainMenuTextColor: res?.data.mainMenuTextColor,
        subMenuBGColor: res?.data.subMenuBGColor,
        subMenuHoverColor: res?.data.subMenuHoverColor,
        subMenuTextColor: res?.data.subMenuTextColor,
        logoPicMainPageUrl: res?.data.logoPicMainPageUrl,
        enableOverrideBranding: res?.data.enableOverrideBranding,
      });
    });
    dispatch(setReloadFalse());
    // }
  }, [reload]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // หน่วงเวลา 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    // ดึงค่าหลังจากหน่วงเวลา
    if (debouncedSearchTerm) {
      // ทำการค้นหาหรือดึงค่าที่ต้องการ
      const filteredMenu = originalDataMenu.map((menu) => {
        const filteredListMenu = menu.listMenu.map((list: any) => {
          return {
            ...list,
            data: list.data.filter((item: any) =>
              item.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
            ),
          };
        });

        return {
          ...menu,
          listMenu: filteredListMenu,
        };
      });
      setDataMenu(filteredMenu);
    } else {
      // ถ้าไม่มี search term ให้แสดง dataMenu ทั้งหมด
      if (location.pathname !== "/") {
        setDataMenu(originalDataMenu);
      }
    }
  }, [debouncedSearchTerm, originalDataMenu, location.pathname]);

  useEffect(() => {
    const fetchData = async (userAccoundId: string) => {
      try {
        dispatch(setOpenLoadingTrue());
        // call api
        getMenuList(userAccoundId).then((res) => {
          if (res.data) {
            // ฟังก์ชันกรองเมนูที่มี "isRead": false ออก
            const filterMenus = (menus: any[]): any[] => {
              const filtered = menus
                .filter((menu) => menu.isRead !== false) // กรองเมนูที่มี isRead: false ออก
                .map((menu) => ({
                  ...menu,
                  subMenu: menu.subMenu ? filterMenus(menu.subMenu) : null, // กรอง subMenu ด้วย
                }));

              return filtered.length > 0 ? filtered : []; // ถ้าไม่มีเมนูเหลือเลย ให้ return []
            };

            // กรอง modules ที่มีอย่างน้อย 1 เมนูที่สามารถอ่านได้
            const filteredModules = res.data?.modules
              .map((module: any) => {
                const filteredMenus = filterMenus(module.menus);
                return filteredMenus.length > 0
                  ? { ...module, menus: filteredMenus } // คง module ไว้ถ้ามีเมนูที่ isRead = true
                  : null; // ลบทิ้งถ้าไม่มีเมนูที่ isRead = true เลย
              })
              .filter((module: any) => module !== null); // เอา module ที่ถูกลบทิ้งออก

            // map module
            const module = filteredModules
              .reverse()
              .map((data: any, index: number) => {
                const moduleNameLowercase = data.moduleName.toLowerCase();

                const firstUrlinSubMenu = data?.menus.length
                  ? data?.menus[0]?.url
                  : "";
                return {
                  name: data.moduleName,
                  link: `${data.url}`,
                  icon: `data:image/svg+xml;utf8,${encodeURIComponent(
                    data.activeIcon
                  )}`,
                  // moduleNameLowercase === "setting"
                  //   ? SettingIC
                  //   : moduleNameLowercase === "privacy notice management"
                  //   ? AnalyticIC
                  //   : moduleNameLowercase === "dashboard"
                  //   ? DashboardIC
                  //   : ConsentIC,
                  path:
                    moduleNameLowercase === "setting"
                      ? firstUrlinSubMenu
                      : `${data.url}${firstUrlinSubMenu}`,
                };
              });

            setModule(module);
            dispatch(setModules(module));

            // map subMenu
            const menu = filteredModules.reverse().map((data: any) => {
              const moduleNameLowercase = data.moduleName.toLowerCase();
              const firstUrlinSubMenu = data?.menus.length
                ? data?.menus[0]?.url
                : "";

              return {
                nameMenu: moduleNameLowercase,
                path: `${data.url}${firstUrlinSubMenu}`,
                headerMenu: data.moduleName,
                description: "",
                listMenu: [
                  {
                    data: data?.menus.map((subMenu: any) => ({
                      path: subMenu.url,
                      name: subMenu.menuName,
                    })),
                  },
                ],
                subMenu: data?.menus, // ข้อมูลนี้ถูกกรองแล้ว ไม่มี isRead: false
              };
            });

            setmenuData(menu);
            dispatch(setOpenLoadingFalse());
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(userAccountId.user_account_id);
  }, [dispatch, userAccountId.user_account_id]);

  useEffect(() => {
    if (open) {
      setTimeout(() => dispatch(setShowSearchTrue()), 300);
    } else {
      dispatch(setShowSearchFalse());
    }
  }, [open, dispatch]);

  const getBasePath = (path: string) => {
    const parts = path.split("/");
    return `/${parts[1]}`;
  };

  useEffect(() => {
    // ✅ กรณี pathname เป็นหน้าแรก
    if (location.pathname === "/" || location.pathname === "") {
      setDataMenu([]);
      localStorage.removeItem("activeMenu");
      setActiveMenu("");

      return; // จบเคสนี้เลย
    }

    // ✅ หาเมนูหลักที่ตรงกับ activeMenu
    const data = menuData.find((menu: any) => {
      const fullPath = menu?.path || "";

      return fullPath === activeMenu;
    });
    if (data) {
      setDataMenu([data]);
      setOriginalDataMenu([data]);
    }

    // ✅ ดึงชื่อ module หลัก เช่น "/setting/config" => "setting"
    const getModule = activeMenu?.split("/")?.[1] || "";

    // ✅ หาเมนูที่มี nameMenu ตรงกับชื่อ module
    const getSubMenu: any = menuData.filter(
      (menu: any) => menu?.nameMenu === getModule
    );
    // ✅ หาจาก subMenu ตัวหลัก ว่ามีเมนูย่อยตรงกับ selectSubMenu หรือไม่
    const childMenu =
      getSubMenu?.[0]?.subMenu?.find(
        (d: any) => `${d.url}` === `${selectSubMenu}`
      ) || null;

    // ✅ สร้าง tab เมนูจาก childMenu
    const getChildMenuTab =
      childMenu?.subMenu?.map((d: any) => ({
        url: d.url,
        menuName: d.menuName,
      })) || [];
    // ✅ ตรวจสอบว่าค่า childmenu เปลี่ยนหรือไม่
    if (JSON.stringify(getChildMenuTab) !== JSON.stringify(childmenu)) {
      dispatch(setChildMenu(getChildMenuTab));
      localStorage.setItem(
        "childMenu",
        JSON.stringify(getChildMenuTab[0] || {})
      );
    }
  }, [location.pathname, activeMenu, selectSubMenu, menuData, childmenu]);

  useEffect(() => {
    const path = location.pathname;

    if (!path.startsWith("/consent/purpose")) {
      localStorage.removeItem("selectedSubMenu");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (dataMenu.length === 0) {
      const data = menuData.find((menu: any) => {
        const fullPath = menu?.path || "";

        return fullPath === localStorage.getItem("activeMenu");
      });
      
      if (data) {
        setDataMenu([data]);
        setOriginalDataMenu([data]);
      }
    }
  }, [location.pathname, dataMenu.length]);

  return (
    <section className="flex fixed z-[12]">
      <div
        className={`background-navy min-h-screen duration-500 text-gray-100 relative`}
        style={{ width: open ? "350px" : "68px" }}
      >
        <div className="flex">
          <div
            className="h-screen rounded-tr-2xl px-3 m-w-[68px]"
            style={{
              background:
                theme.mainMenuBGColor && theme.enableOverrideBranding === true
                  ? theme.mainMenuBGColor
                  : "#000",
            }}
          >
            <div className="flex justify-center py-5">
              <Link to="/">
                <img
                  src={
                    theme.logoPicMainPageUrl ? theme.logoPicMainPageUrl : Logo
                  }
                  alt="profile"
                  className="w-[40px] cursor-pointer h-[35px] object-contain"
                  onClick={() => {
                    setDataMenu([]);
                  }}
                />
              </Link>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="relative flex flex-col gap-4 mt-4 ">
                <div className="pb-3 border-b border-gray-700">
                  <IoApps
                    size={26}
                    className="m-auto mb-2 cursor-pointer"
                    onClick={() => dispatch(toggleOpen())}
                  />
                </div>

                {module
                  ?.filter((module: any) => module.name !== "Setting")
                  .reverse()
                  .map((module: any, i) => {
                    return (
                      <Link
                        to={
                          open
                            ? `${module?.path}`
                            : // : selectedSubMenuLocalStorage ? `${module?.link}${selectSubMenu}`
                            `${module?.path}`
                        }
                        key={i}
                        onClick={() => {
                          localStorage.removeItem("subMenuTab");
                          localStorage.setItem(
                            "moduleSelect",
                            `${module.link}`
                          );
                          setSearchTerm("");
                          setDebouncedSearchTerm("");
                          setActiveMenu(`${module.path}`);
                          localStorage.setItem("activeMenu", `${module.path}`);
                          localStorage.removeItem("selectedSubMenu");
                          dispatch(setOpenTrue());
                        }}
                        className={`hover-button gap-3.5 font-medium p-2 w-[45px] h-[45px] pl-[7px] pr-[7px] pt-[7px] pb-[5px] rounded-md `}
                        style={
                          location.pathname.startsWith(`${module.link}`)
                            ? {
                              background:
                                theme.mainMenuHoverColor &&
                                  theme.enableOverrideBranding === true
                                  ? theme.mainMenuHoverColor
                                  : "#3758f9",
                            }
                            : {
                              "--hover-color":
                                theme.mainMenuHoverColor &&
                                  theme.enableOverrideBranding === true
                                  ? theme.mainMenuHoverColor
                                  : "#3758f9",
                              "--active-color":
                                theme.mainMenuHoverColor &&
                                  theme.enableOverrideBranding === true
                                  ? theme.mainMenuHoverColor
                                  : "#3758f9",
                            }
                          //  i-1 === menus.length ? {borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"} : {}
                        }
                      >
                        <img
                          src={module.icon}
                          alt="icon"
                          className="w-[30px] h-[30px]"
                        />
                      </Link>
                    );
                  })}
              </div>
            </div>
            <div className="absolute pb-6 text-center bottom-1 w-11">
              {module
                ?.filter((module: any) => module.name === "Setting")
                .map((module: any, i) => {
                  return (
                    <Link
                      key={i}
                      onClick={() => {
                        setActiveMenu(`${module?.link}${module?.path}`);
                        localStorage.setItem(
                          "activeMenu",
                          `${module.link}${module.path}`
                        );
                        localStorage.setItem(
                          "selectedSubMenu",
                          `${module.path}`
                        );
                        localStorage.setItem("childMenu", JSON.stringify({}));
                      }}
                      to={`${module?.link}${module?.path}`}
                      className={`gap-3.5 font-medium pt-2 mb-2 ${location.pathname.startsWith(`${module.link}`)
                        ? "bg-[#3758f9]"
                        : ""
                        }`}
                    >
                      <IoSettingsOutline
                        size={26}
                        style={
                          location.pathname.startsWith(`${module.link}`)
                            ? {
                              background:
                                theme.mainMenuHoverColor &&
                                  theme.enableOverrideBranding === true
                                  ? theme.mainMenuHoverColor
                                  : "#3758f9",
                            }
                            : {
                              "--hover-color": theme.mainMenuHoverColor,
                              "--active-color": theme.mainMenuHoverColor,
                            }
                        }
                        className={`hover-button cursor-pointer m-auto mb-5 mt-2 w-[45px] h-[45px] pl-[7px] pr-[7px] pt-[7px] pb-[5px] rounded-md`}
                        onClick={() => {
                          const subMenu = module.path.split("/").slice(1);
                          localStorage.removeItem("subMenuTab");

                          if (open) {
                            localStorage.setItem(
                              "moduleSelect",
                              `${module.link}`
                            );
                            setActiveMenu(`${module.link}${module.path}`);
                            localStorage.setItem(
                              "activeMenu",
                              `${module.link}${module.path}`
                            );

                            setSelectSubMenu(`/${subMenu[0]}`);
                            localStorage.setItem(
                              "selectedSubMenu",
                              `/${subMenu[0]}`
                            );

                            setDebouncedSearchTerm("");
                            setSearchTerm("");
                            dispatch(setOpenTrue());
                            // localStorage.setItem("subMenuTab", "xxx");
                          } else {
                            localStorage.setItem(
                              "moduleSelect",
                              `${module.link}`
                            );
                            if (selectedSubMenuLocalStorage) {
                              setDebouncedSearchTerm("");
                              setSearchTerm("");
                              dispatch(setOpenTrue());
                            } else {
                              dispatch(setOpenTrue());
                              setActiveMenu(`${module.link}${module.path}`);
                              localStorage.setItem(
                                "activeMenu",
                                `${module.link}${module.path}`
                              );
                              setSelectSubMenu(`/${subMenu[0]}`);
                              localStorage.setItem(
                                "selectedSubMenu",
                                `/${subMenu[0]}`
                              );
                            }
                          }
                        }}
                      />
                    </Link>
                  );
                })}

              <Menu>
                <MenuButton className={`pb-3 gap-3.5 font-medium py-3`}>
                  <img
                    src={
                      userAccountId.profile_image_base64
                        ? userAccountId.profile_image_base64
                        : imgProfile
                    }
                    alt="icon"
                    className="m-auto round rounded-full shadow-lg w-[30px] max-w-[30px]"
                  />
                </MenuButton>
                {!openChangePassword && (
                  <MenuItems className="w-[270px] absolute bottom-[15px] left-[65px] mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none p-[10px]">
                    <div className="flex pb-3">
                      <div className="flex-[1_1_22%] m-auto">
                        <img
                          src={
                            userAccountId.profile_image_base64
                              ? userAccountId.profile_image_base64
                              : imgProfile
                          }
                          alt="icon"
                          className="m-auto round rounded-full shadow-lg w-[50px] max-w-[50px]"
                        />
                      </div>
                      <div className="flex-[2_1_78%] py-[10px] px-[5px] text-left">
                        <p className="font-semibold text-black">{`${userAccountId.first_name} ${userAccountId.last_name}`}</p>
                        <p className="text-black  opacity-[80%] font-light text-[12px]">
                          {userAccountId.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex py-3">
                      <div className="flex-[1_1_78%] text-left px-3">
                        {/* <Link to="/profile" > */}
                        <p
                          className="text-black font-light text-[14px] cursor-pointer"
                          onClick={toggleLanguage}
                        >
                          {t("changelanguage")}
                        </p>
                        {/* </Link> */}
                        <Button
                          onClick={() => {
                            setOpenChangePassword(true);
                          }}
                        >
                          <p className="text-black font-light text-[14px] pt-[20px]">
                            {t("changepassword")}
                          </p>
                        </Button>
                      </div>
                      <div className="flex-[2_1_22%]">
                        <p className="text-[14px]  text-black opacity-[30%] bg-[gainsboro] w-[30px] h-[20px] m-auto">
                          {language.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex py-3">
                      <div className="flex-[1_1_8%] text-left px-3">
                        <IoMdInformationCircleOutline className="text-black text-[22px]" />
                      </div>
                      <div className="flex-[2_1_92%]">
                        <Link to="/profile">
                          <p className="text-left text-black font-light text-[14px]">
                            {t("helpandsupport")}
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div className="flex py-3">
                      <div className="flex-[1_1_8%] text-left px-3">
                        <MdLogout className="text-black text-[22px]" />
                      </div>
                      <div className="flex-[2_1_92%]">
                        <div
                          onClick={() => handleLogout()}
                          className="cursor-pointer"
                        >
                          <p className="text-left text-black font-light text-[14px]">
                            {t("logout")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </MenuItems>
                )}
              </Menu>
            </div>
          </div>
          <div
            className={`${!open && "hidden duration-100"} w-full  pl-4 py-5`}
            style={{
              background:
                theme.subMenuBGColor && theme.enableOverrideBranding === true
                  ? theme.subMenuBGColor
                  : "#121721",
            }}
          >
            {/* PANEL SUB MENU */}
            {showSearch && (
              <div className="grid grid-cols-12 gap-1">
                <div
                  className={` border-none col-span-9 flex items-center border border-gray-300 rounded-md p-2 bg-[#292e37] border-[#292e37] transform transition-all duration-500 h-11 ${open ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <FaSearch className="mr-2 text-gray-400" />                  <input
                    type="text"
                    name="full_name"
                    className="outline-none border-0 flex-1 bg-[#292e37] w-full text-base font-semibold focus:outline-none focus:ring-0 focus:border-0 hover:border-0 active:border-0"
                    placeholder={t("searchMenu")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div
                  className={`col-span-2 m-auto absolute right-0 bg-[#292e37] h-11 w-12`}
                >
                  <IoIosArrowBack
                    size={26}
                    className="m-auto mt-2 mb-2 cursor-pointer"
                    onClick={() => dispatch(toggleOpen())}
                  />
                </div>
                <div className="col-span-12 pt-3 pr-2 mt-5">
                  <p
                    className={`px-2 text-xl font-semibold`}
                    style={{
                      color:
                        theme.subMenuTextColor &&
                          theme.enableOverrideBranding === true
                          ? theme.subMenuTextColor
                          : "#fff",
                    }}
                  >
                    {/* {dataMenu[0]?.headerMenu} */}
                    {dataMenu.length ? (
                      t("menu." + dataMenu[0]?.headerMenu)
                    ) : (
                      "Welcome to PDPA"
                    )}
                  </p>
                  <p
                    className="font-base text-[#637381] px-2"
                    style={{
                      color:
                        theme.subMenuTextColor &&
                          theme.enableOverrideBranding === true
                          ? theme.subMenuTextColor
                          : "#637381",
                    }}
                  >
                    {dataMenu[0]?.description}
                  </p>

                  {dataMenu[0]?.listMenu?.map((list: any, i: number) => {
                    return (
                      <div
                        key={i}
                        className="mt-3 transition duration-150 ease-in-out"
                      >
                        {list.data?.map((item: any, i: number) => {
                          const trimmedUrl = handleURLforActiveSubmenu(
                            location.pathname
                          );

                          const getModuleUrl = handleURLforActiveSubmenu(
                            location.pathname.split("/").slice(0, 2).join("/")
                          );
                          return (
                            <Link
                              to={
                                getModuleUrl === "/setting"
                                  ? getModuleUrl + list.data[i].path
                                  : `${getModuleUrl}${list.data[i].path}`
                              }
                              key={i}
                              onClick={() => {
                                setSelectSubMenu(item.path);
                                localStorage.setItem(
                                  "selectedSubMenu",
                                  item.path
                                );
                                localStorage.removeItem("subMenuTab");
                              }}
                            >
                              <p
                                key={i}
                                className={`${getModuleUrl === "/setting"
                                  ? trimmedUrl ===
                                    `${getModuleUrl}${item.path}`
                                    ? "bg-[#292e37]"
                                    : ""
                                  : trimmedUrl ===
                                    `${getModuleUrl}${item.path}`
                                    ? "bg-[#292e37]"
                                    : ""
                                  } text-base font-normal w-full hover:bg-[${theme.subMenuHoverColor
                                  }] active:bg-[${theme.subMenuHoverColor
                                  }] rounded-md py-3 mb-1 pl-[20px]`}
                                style={{
                                  "--hover-color": theme.subMenuHoverColor,

                                  color:
                                    theme.subMenuTextColor &&
                                      theme.enableOverrideBranding === true
                                      ? theme.subMenuTextColor
                                      : "#fff",
                                  background:
                                    getModuleUrl === "/setting"
                                      ? trimmedUrl ===
                                        `${getModuleUrl}${item.path}`
                                        ? theme.subMenuHoverColor &&
                                          theme.enableOverrideBranding === true
                                          ? theme.subMenuHoverColor
                                          : ""
                                        : ""
                                      : trimmedUrl ===
                                        `${getModuleUrl}${item.path}`
                                        ? theme.subMenuHoverColor &&
                                          theme.enableOverrideBranding === true
                                          ? theme.subMenuHoverColor
                                          : ""
                                        : "",
                                }}
                              // className={`${
                              //   getModuleUrl === "/setting" ? trimmedUrl === `${getModuleUrl}${item.path}`  ? "bg-[#292e37]"
                              //   : "" : trimmedUrl === `${getModuleUrl}${item.path}` ? `bg-[#292e37]` : ''
                              // } text-[16px] font-normal w-full hover:bg-[${theme.subMenuHoverColor}] active:bg-[${theme.subMenuHoverColor}] rounded-md py-3 mb-1 pl-[20px]`}
                              // style={{ color: theme.subMenuTextColor,background:  getModuleUrl === "/setting" ? trimmedUrl === `${getModuleUrl}${item.path}` ?  theme.subMenuHoverColor : "" : trimmedUrl === `${getModuleUrl}${item.path}` ? theme.subMenuHoverColor : "" }}
                              // style={{
                              //   "--color-default": colors.defaultColor,
                              //   "--color-hover": colors.hoverColor,
                              //   "--color-active": colors.activeColor,
                              // }}
                              >
                                {/* {item.name} */}
                                {t(`menu.${item.name}`)}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Alert
        type="info"
        description="info This is an error message about copywriting."
      /> */}
      {openChangePassword && (
        <ModalChangePassword setOpenChangePassword={setOpenChangePassword} />
      )}
    </section>
  );
};

export default Sidebar;
