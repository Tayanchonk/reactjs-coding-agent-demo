// Layout.tsx
import React, { useEffect, useState } from "react";
import Headers from "./components/Header";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import "./utils/notify.css";
import { setOpenLoadingFalse } from "./store/slices/loadingSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logOutUser } from "./services/authenticationService";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
interface LayoutProps {
  children?: React.ReactNode;
}

interface PaddingLeft {
  plGlobal: number;
  plBreadcrumb: number;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const open = useSelector((state: RootState) => state.opensidebar.open);
  const session = useSelector((state: RootState) => state.session);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [pading, setPading] = useState(3);
  const [left, setLeft] = useState(0);
  const [isBorder, setIsBorder] = useState(true);
  const [timeLeft, setTimeLeft] = useState(session.sessionTimeoutDuration);
  const navigate = useNavigate();
  const location = useLocation();
  const [paddingLeft, setPaddingLeft] = useState<PaddingLeft>({
    plGlobal: open ? 360 : 80,
    plBreadcrumb: open ? 375 : 90,
  });

  useEffect(() => {
    setPaddingLeft({
      plGlobal: open ? 360 : 80,
      plBreadcrumb: open ? 375 : 90,
    });
  }, [open]);

  useEffect(() => {

    dispatch(setOpenLoadingFalse());
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setTimeLeft(session.sessionTimeoutDuration);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const formattedTime = dayjs
      .duration(timeLeft, "seconds")
      .format("HH:mm:ss");
    localStorage.setItem("TimeOut", formattedTime);
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
    if (timeLeft <= 0) {
      handleLogout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const clearlocalStorage = async () => {
    Object.keys(localStorage).forEach((k) => {
      if (k !== "companylogoicon") {
        localStorage.removeItem(k);
      }
    });
  };
  
  useEffect(() => {
    if (location.pathname.startsWith('/consent/consent-interface') || location.pathname.startsWith('/consent/transaction') || location.pathname.startsWith('/consent/receipts')) {
      setLeft(10)
      setPading(0)
    }
    else if (location.pathname.startsWith('/consent/data-subject')) {
      setLeft(10)
      setPading(0)
    }
    else {
      setLeft(0)
      setPading(3)
    }
    if (location.pathname.startsWith('/consent/consent-interface/')) {
      setIsBorder(false)
    } else {
      setIsBorder(true)
    }
    if (location.pathname.startsWith('/dashboard/report-data-subject-profile-consent')) {
      setIsBorder(false)
      setLeft(10)
      setPading(0)
    }
  }, [location.pathname])

  return (
    <div className={`${location.pathname === '/setting/user-management/organization' ? 'flex' : ''}`}>
      {/* {loading && <Loading />} */}
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Headers />
        <div
          className={`flex px-9 pb-3 ${isBorder && 'border-b'} border-gray-200 shadow-lg ${location.pathname == "/" ? 'pt-[60px]' : 'pt-[90px]'} `}
          style={{ paddingLeft: paddingLeft.plBreadcrumb }}
        >
          <Breadcrumb />
        </div>
        <div
          className={`flex-1 bg-[#f8f8fb] ${location.pathname == "/" ? 'p-[0px]' : 'p' + pading}`}
          style={{ paddingLeft: location.pathname == "/" ? paddingLeft.plGlobal - (left + 12) : paddingLeft.plGlobal - left }}
        >
          {children}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
