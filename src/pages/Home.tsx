// gen home component
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setThemeColors } from "../store/slices/themeSlice";
import { Button } from "@headlessui/react";
import bgBanner from "../assets/images/Thumbnail.png";
import allTransectionIcon from "../assets/images/all.png";
import confirmed from "../assets/images/confirmed.png";
import notgiven from "../assets/images/notgiven.png";
import withdrawn from "../assets/images/withdrawn.png";
import consent from "../assets/images/consent.png";
import privacy from "../assets/images/privacy.png";
import dashboard from "../assets/images/dashboard.png";
import settings from "../assets/images/setting.png";
import expired from "../assets/images/expired.png";
import arrowOutward from "../assets/images/arrow_outward.png";
import arrowOutwardno from "../assets/images/arrow_outwardno.png";
import { getDashboardData } from "../services/dashboardService";
import LoadingSpinner from "../components/LoadingSpinner";
import { use } from "i18next";
import { RootState } from "../store";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/Utils";
import { setModules } from "../store/slices/module";
import { useTranslation } from "react-i18next";
import"./Card.css";

interface dataDashboard {
  allTransactions: number;
  confirmedTransactions: number;
  expired: number;
  notGiven: number;
  withdrawn: number;
}

const Home: React.FC = () => {

    let { t, i18n } = useTranslation();

  const [hoverModule, setHoverModule] = React.useState<any>({
    c: false,
    p: false,
    d: false,
    s: false,
  });

  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const modules = useSelector((state: RootState) => state.module);

  const [dateNow, setDateNow] = React.useState<string>(new Date().toString());

    const reloadorg = useSelector(
      (state: RootState) => state.reloadorg.reloadorg
    );

  const [dateData, setDateData] = React.useState<string>(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) as string
  );
  const [timeData, setTimeData] = React.useState<string>(
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }) as string
  );

  const [dataDashboard, setDataDashboard] = React.useState<dataDashboard>({
    allTransactions: 0,
    confirmedTransactions: 0,
    expired: 0,
    notGiven: 0,
    withdrawn: 0,
  });

  const [firstName, setFirstName] = React.useState<string>(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") || "").first_name
      : ""
  );

  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f8fb";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // useEffect(() => {
  //   handleGetDashboardData();
  // }, []);

  // useEffect(() => {
  //   handleGetDashboardData();
  // }, [reloadorg]);

  useEffect(() => {
     handleGetDashboardData();
    const interval = setInterval(() => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setDateData(formattedDate);

      setDateNow(currentDate.toString());

      const formattedTime = currentDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTimeData(formattedTime);
    }, 1000); // อัปเดตทุก 1 วินาที

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  function collectAllOrganizationIds(org: any): string[] {
    let ids = [org.organizationId];
    if (org.children && org.children.length > 0) {
      org.children.forEach((child: any) => {
        ids = ids.concat(collectAllOrganizationIds(child));
      });
    }
    return ids;
  }

 useEffect(() => {
  const handleCurrentOrgChange = (event: CustomEvent) => {
    const currentOrgString = localStorage.getItem("currentOrg");
    if (currentOrgString) {
      const currentOrg = JSON.parse(currentOrgString);
     
     handleGetDashboardData();
    }
  };

  window.addEventListener("currentOrgChanged", handleCurrentOrgChange as EventListener);

  return () => {
    window.removeEventListener("currentOrgChanged", handleCurrentOrgChange as EventListener);
  };
}, []);

  const handleGetDashboardData = async () => {

    try {
    

      const userdata = sessionStorage.getItem("user") ;
      const orgParentId = localStorage.getItem("orgParent") || orgparent;
      const orgTreeRaw = localStorage.getItem("currentOrg");
   
      if (userdata && orgParentId && orgTreeRaw) {
            setLoading(true);
        const customer_id = JSON.parse(userdata).customer_id;
        const orgTree = JSON.parse(orgTreeRaw);

        // ฟังก์ชันค้นหา node ตาม id
        function findOrgNodeById(node: any, id: string): any | null {
          if (node.organizationId === id) return node;
          if (node.children && node.children.length > 0) {
            for (let child of node.children) {
              const found = findOrgNodeById(child, id);
              if (found) return found;
            }
          }
          return null;
        }

        // หา orgParentNode จาก tree
        const orgParentNode = findOrgNodeById(orgTree, orgParentId);

        let organizationIdArray: string[] = [];
        if (orgParentNode) {
          organizationIdArray = collectAllOrganizationIds(orgParentNode);
        }

        const data = {
          customerId: customer_id,
          organizationId: organizationIdArray,
        };

        const resp = await getDashboardData(data);
        setDataDashboard(resp.data);

        setLoading(false);
      }
      else {
        
        setLoading(true);
      }
    } catch (error) {
      // console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return  t('mainPage.goodMorning') || "Good Morning";
    if (hour >= 12 && hour < 17) return t('mainPage.goodAfternoon') || "Good Afternoon";
    if (hour >= 17 && hour < 21) return t('mainPage.goodEvening') || "Good Evening";
    return t('mainPage.goodNight') || "Good Night";
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>
  ) : (
    <div
    // style={{
    //   minHeight: "92vh",
    //   width: "100%", // เปลี่ยนจาก 100vw เป็น 100%
    //   backgroundColor: "#f5f7fa",
    //   overflowX: "hidden",
    //   boxSizing: "border-box", // เพิ่มบรรทัดนี้
    // }}
    >
      <div
        className="relative "
        style={{
          backgroundImage: `url(${bgBanner})`,
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* <div className="absolute inset-0 "></div> */}
        <div className="pt-8 pb-8 pl-8 text-white">
          <p className="mb-0" style={{ fontSize: "14px", opacity: "80%" }}>
            {/* Last 12/05/2025 20:3 */}
          </p>
          <h1 className="mb-0 ">
            {" "}
            <span style={{ fontSize: "42px", fontWeight: 800 }}>
              {getGreeting()},
            </span>{" "}
            <span style={{ fontSize: "42px", fontWeight: 400 }}>
              {firstName ? firstName : "User"}
            </span>{" "}
          </h1>
          <p className="mb-0" style={{ fontSize: "18px" }}>
           { t('mainPage.day')}, {formatDate("datetime", dateNow)}
          </p>
        </div>
      </div>
      <div className="m-8">
        <div>
          <h2 className="mb-4 " style={{ fontSize: "20px", opacity: "90%" }}>
            <span style={{fontWeight:500}}>{t('mainPage.day')},</span> {t('mainPage.transactions')}
          </h2>
          <div className="grid items-stretch grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <div>
              <div className="flex items-center justify-between  bg-[#2B47CF] rounded-lg shadow-sm">
                <div className="flex items-center p-2 ml-2">
                  <img
                    src={allTransectionIcon}
                    alt="Icon"
                    className="w-12 h-12 mr-4 rounded"
                  />
                  <div>
                    <h3 className="mt-3 ml-2 text-base text-white">
                      {t('mainPage.transactionAll')}
                    </h3>
                    <p
                      className="ml-2 text-white opacity-90"
                      style={{ fontSize: "40px" }}
                    >
                      {/* {dataDashboard.allTransactions} */}
                    { dataDashboard.allTransactions >= 1000 ? (dataDashboard.allTransactions / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })+"K": dataDashboard.allTransactions  }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                className="flex items-center justify-between  bg-[#FFFFFF] rounded-lg shadow-sm"
                //  style={{
                //   borderRight: "3px solid #47BDBC",
                //  }}
              >
                <div className="flex items-center p-2 ml-2">
                  <img
                    src={confirmed}
                    alt="Icon"
                    className="w-12 h-12 mr-4 rounded"
                  />
                  <div>
                    <h3 className="mt-3 ml-2 text-base text-[#656668]">
                      {t('mainPage.confirmed')}
                    </h3>
                    <p
                      className="ml-2 text-[#111928] opacity-90"
                      style={{ fontSize: "40px" }}
                    >
                      {dataDashboard.confirmedTransactions >= 1000 ? (dataDashboard.confirmedTransactions / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })+"K": dataDashboard.confirmedTransactions }
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: "6px",
                    height: "80px",
                    backgroundColor: "#47BDBC",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div
                className="flex items-center justify-between  bg-[#FFFFFF] rounded-lg shadow-sm"
                //  style={{
                //   borderRight: "3px solid #47BDBC",
                //  }}
              >
                <div className="flex items-center p-2 ml-2">
                  <img
                    src={notgiven}
                    alt="Icon"
                    className="w-12 h-12 mr-4 rounded"
                  />
                  <div>
                    <h3 className="mt-3 ml-2 text-base text-[#656668]">
                      {t('mainPage.notGiven')}
                    </h3>
                    <p
                      className="ml-2 text-[#111928] opacity-90"
                      style={{ fontSize: "40px" }}
                    >
                      {dataDashboard.notGiven >= 1000 ? (dataDashboard.notGiven / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })+"K": dataDashboard.notGiven }
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: "6px",
                    height: "80px",
                    backgroundColor: "#F6D448",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div
                className="flex items-center justify-between  bg-[#FFFFFF] rounded-lg shadow-sm"
                //  style={{
                //   borderRight: "3px solid #47BDBC",
                //  }}
              >
                <div className="flex items-center p-2 ml-2">
                  <img
                    src={withdrawn}
                    alt="Icon"
                    className="w-12 h-12 mr-4 rounded"
                  />
                  <div>
                    <h3 className="mt-3 ml-2 text-base text-[#656668]">
                      {t('mainPage.withDrawn')}
                    </h3>
                    <p
                      className="ml-2 text-[#111928] opacity-90"
                      style={{ fontSize: "40px" }}
                    >
                      {dataDashboard.withdrawn >= 1000 ? (dataDashboard.withdrawn / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })+"K": dataDashboard.withdrawn }
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: "6px",
                    height: "80px",
                    backgroundColor: "#E60E00",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
            <div>
              {" "}
              <div
                className="flex items-center justify-between  bg-[#FFFFFF] rounded-lg shadow-sm"
                //  style={{
                //   borderRight: "3px solid #47BDBC",
                //  }}
              >
                <div className="flex items-center p-2 ml-2">
                  <img
                    src={expired}
                    alt="Icon"
                    className="w-12 h-12 mr-4 rounded"
                  />
                  <div>
                    <h3 className="mt-3 ml-2 text-base text-[#656668]">
                      {t('mainPage.expired')}
                    </h3>
                    <p
                      className="ml-2 text-[#111928] opacity-90"
                      style={{ fontSize: "40px" }}
                    >
                      {dataDashboard.expired}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: "6px",
                    height: "80px",
                    backgroundColor: "#D7D7D7",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mt-8 mb-2 " style={{ fontSize: "20px" }}>
            <span style={{fontWeight:500}}>{t('mainPage.centerApplication')}</span>
          </h2>
          <div className="grid items-stretch grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
       
          >
            {modules.find(
              (module: any) => module.name === "Consent Management"
            ) && (
              <Link
                to={
                  `${
                    modules.find(
                      (module: any) => module.name === "Consent Management"
                    )?.path
                  }` || "/consent/purpose/standard-purpose"
                }
                onClick={() => {
                  const moduleName =
                    `${
                      modules.find(
                        (module: any) => module.name === "Consent Management"
                      )?.path
                    }` || "/consent/purpose/standard-purpose";

                  localStorage.setItem("activeMenu", moduleName);
                }}
                className="h-full "
              >
                <div
                  className="h-full card transition-transform bg-white duration-300 hover:scale-100 hover:shadow-lg hover:bottom-1 hover:border-[#3758F9] hover:rounded-lg"
                  onMouseEnter={() =>
                    setHoverModule({ ...hoverModule, c: true, p: false, d: false, s: false })
                  }
                  onMouseLeave={() =>
                    setHoverModule({ ...hoverModule, c: false })
                  }
                  style={{
                    borderRadius: "8px",
                  }}
                >
                  <div className="flex justify-between h-full rounded-lg shadow-sm">
                    <div className="flex p-2 ml-1">
                      <div className="mt-2 mb-3">
                        <img
                          src={consent}
                          alt="Icon"
                          className="ml-3 w-11"
                          style={{ height: "55px"}} 
                        />
                        <h3 className="mt-2 ml-2 text-lg opacity-90 font-weight-medium"
                          style={{ color: hoverModule.c ? "#3758F9" : "#3758F9" }}
                        >
                          {t('mainPage.consentManagement')}
                        </h3>
                        <p
                          className="ml-2 opacity-60"
                          style={{ fontSize: "11px", color: hoverModule.c ? "#111928" : "#111928" }}
                        >
                          {t('mainPage.consentManagementDesc')}
                        </p>
                      </div>
                      <div>
                        {hoverModule.c ? (
                          <img src={arrowOutward} alt="" className="w-6" />
                        ) : (
                          <img src={arrowOutwardno} alt="" className="w-7" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {modules.find(
              (module: any) => module.name === "Privacy Notice Management"
            ) && (
              <Link
                to={
                  `${
                    modules.find(
                      (module: any) =>
                        module.name === "Privacy Notice Management"
                    )?.path
                  }` || "/privacy/notice"
                }
                onClick={() => {
                  const moduleName =
                    `${
                      modules.find(
                        (module: any) =>
                          module.name === "Privacy Notice Management"
                      )?.path
                    }` || "/privacy/notice";
                  localStorage.setItem("activeMenu", moduleName);
                }}
                className="h-full"
              >
                <div
                  className="h-full card transition-transform bg-white duration-300 hover:scale-100 hover:shadow-lg hover:bottom-1 hover:border-[#3758F9] hover:rounded-lg"
                  onMouseEnter={() =>
                    setHoverModule({ ...hoverModule, p: true , c: false, d: false, s: false })
                  }
                  onMouseLeave={() =>
                    setHoverModule({ ...hoverModule, p: false })
                  }
                  style={{
                    
                    borderRadius: "8px",
                  }}
                >
                  <div className="flex justify-between h-full rounded-lg shadow-sm">
                    <div className="flex p-2 ml-1">
                      <div className="mt-3 mb-3">
                        <img
                          src={privacy}
                          alt="Icon"
                          className="h-12 ml-4 w-11"
                        />
                        <h3 className="mt-3 ml-2 text-lg opacity-90 font-weight-medium"
                        style={{ color: hoverModule.p ? "#3758F9" : "#3758F9"   }}

                        >
                          {t('mainPage.privacyNotice')}
                        </h3>
                        <p
                          className="ml-2 opacity-60"
                          style={{ fontSize: "11px", color: hoverModule.p ? "#111928" : "#111928" }}
                        >
                          {t('mainPage.privacyNoticeDesc')}
                        </p>
                      </div>
                      <div>
                        {hoverModule.p ? (
                          <img src={arrowOutward} alt="" className="w-7" />
                        ) : (
                          <img src={arrowOutwardno} alt="" className="w-8" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            
            {modules.find(
              (module: any) => module.name === "Dashboard & Report"
            ) && (
              <Link
                to={
                  `${
                    modules.find(
                      (module: any) => module.name === "Dashboard & Report"
                    )?.path
                  }` || "/dashboard/report-data-subject-profile-consent"
                }
                onClick={() => {
                  const moduleName =
                    `${
                      modules.find(
                        (module: any) => module.name === "Dashboard & Report"
                      )?.path
                    }` || "/dashboard/report-data-subject-profile-consent";

                  localStorage.setItem("activeMenu", moduleName);
                }}
                // to="/dashboard/report-data-subject-profile-consent"
                className="h-full"
              >
                <div
                  className="h-full card transition-transform bg-white duration-300 hover:scale-100 hover:shadow-lg hover:bottom-1 hover:border-[#3758F9] hover:rounded-lg"
                  onMouseEnter={() =>
                    setHoverModule({ ...hoverModule, d: true, c: false, p: false, s: false })
                  }
                  onMouseLeave={() =>
                    setHoverModule({ ...hoverModule, d: false })
                  }
                  style={{
                    
                    borderRadius: "8px",
                  }}
                >
                  <div className="flex justify-between h-full rounded-lg shadow-sm">
                    <div className="flex p-2 ml-1">
                      <div className="mt-3 mb-3">
                        <img
                          src={dashboard}
                          alt="Icon"
                          className="h-12 ml-4 w-11"
                        />
                        <h3 className="mt-3 ml-2 text-lg opacity-90 font-weight-medium"
                        
                          style={{ color: hoverModule.d ? "#3758F9" : "#3758F9" }}>
                          {t('mainPage.dashboardAndReports')}
                        </h3>
                        <p
                          className="pr-2 ml-2 opacity-60"
                          style={{ fontSize: "11px", color: hoverModule.d ? "#111928" : "#111928" }}
                        >
                          {t('mainPage.dashboardAndReportsDesc')}
                        </p>
                      </div>
                      <div>
                        {hoverModule.d ? (
                          <img src={arrowOutward} alt="" className="w-7" />
                        ) : (
                          <img src={arrowOutwardno} alt="" className="w-8" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {modules.find((module: any) => module.name === "Setting") && (
              <Link
                to={
                  `${
                    modules.find((module: any) => module.name === "Setting")
                      ?.link
                  }${
                    modules.find((module: any) => module.name === "Setting")
                      ?.path
                  }` || "/setting/user-management/organization"
                }
                onClick={() => {
                  const moduleName =
                    `${
                      modules.find((module: any) => module.name === "Setting")
                        ?.link
                    }${
                      modules.find((module: any) => module.name === "Setting")
                        ?.path
                    }` || "/setting/user-management/organization";

                  localStorage.setItem("activeMenu", moduleName);
                }}
                className="h-full"
              >
                <div
                  className="h-full card transition-transform bg-white duration-300 hover:scale-100 hover:shadow-lg hover:bottom-1 hover:border-[#3758F9] hover:rounded-lg"
                  onMouseEnter={() =>
                    setHoverModule({ ...hoverModule, s: true, c: false, p: false, d: false })
                  }
                  onMouseLeave={() =>
                    setHoverModule({ ...hoverModule, s: false })
                  }
                  style={{
                   
                    borderRadius: "8px",
                  }}
                >
                  <div className="flex justify-between h-full rounded-lg shadow-sm">
                    <div className="flex p-2 ml-1">
                      <div className="mt-0 mb-3">
                        <img
                          src={settings}
                          alt="Icon"
                          // className="h-16 ml-4 w-11"

                          style={{ height: "71px", width: "71px" }}
                        />
                        <h3 className="mt-0 ml-2 text-lg opacity-90 font-weight-medium"
                          style={{ color: hoverModule.s ? "#3758F9" : "#3758F9" }}>
                          {t('mainPage.settings')}
                        </h3>
                        <p
                          className="ml-1 opacity-60"
                          style={{ fontSize: "11px" , color: hoverModule.s ? "#111928" : "#111928" }}
                        >
                          {t('mainPage.settingsDesc')}
                        </p>
                      </div>
                      <div>
                        {hoverModule.s ? (
                          <img src={arrowOutward} alt="" className="w-7" />
                        ) : (
                          <img src={arrowOutwardno} alt="" className="w-8" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
