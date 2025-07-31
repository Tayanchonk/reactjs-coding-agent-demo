import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../../store";


const SettingHome = () => {
    const childmenu = useSelector((state: RootState) => state.childmenu);
    const permissionPage = useSelector((state: RootState) => state.permissionPage);

    useEffect(() => {

    });

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
};

export default SettingHome;
