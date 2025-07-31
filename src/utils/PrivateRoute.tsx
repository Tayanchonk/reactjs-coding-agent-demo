import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken, getUserInfo } from "../services/authenticationService";
import { getUserMenu } from "../services/userService";
import { setPermissionMenu, Permission } from "../store/slices/permissionMenuSlice";
import { RootState } from "../store";
import { setChildMenu } from "../store/slices/childMenuSlice";
import { setMenuDescription } from "../store/slices/menuDescriptionSlice";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userMenus, setUserMenu] = useState<Permission | null>(null);
  const [parentMenu, setParentMenu] = useState<any>([]);
  const [isUserMenuLoaded, setIsUserMenuLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModue, setIsModue] = useState<boolean>(false);
  const location = useLocation();
  const isMounted = useRef(true);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dateTimeFormat = useSelector((state: RootState) => state.dateTimeFormat);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await verifyToken();
        setIsAuthenticated(true);
        if (!sessionStorage.getItem("user") || currentUser.customer_id === "" || dateTimeFormat.dateFormat === "") {
          await getUserInfo();
        }
        const userPMenu = await getUserMenu(location.pathname);
        if (userPMenu.selectedMenu.moduleUrl) {
          localStorage.setItem("moduleSelect", userPMenu.selectedMenu.moduleUrl);
        }
        dispatch(setChildMenu(userPMenu.parentMenu));
        dispatch(setPermissionMenu(userPMenu.selectedMenu));
        setParentMenu(userPMenu.parentMenu);
        setUserMenu(userPMenu.selectedMenu);
        setIsModue(userPMenu.ismodule)
        setIsUserMenuLoaded(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, [location.pathname, dispatch]);
  
  const clearlocalStorage = async () => {
    Object.keys(localStorage).forEach((k) => {
      if (k !== "companylogoicon") {
        localStorage.removeItem(k);
      }
    });
  };

  if (isLoading || !isUserMenuLoaded) {
    return null;
  }

  if (!isAuthenticated) {
    clearlocalStorage();
    sessionStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (isModue && parentMenu.length > 0 && location.pathname !== "/") {
    return <Navigate to={parentMenu[0].fullUrl} state={{ from: location }} replace />;
  }
  if (userMenus && userMenus.isRead === false && location.pathname !== "/") {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
