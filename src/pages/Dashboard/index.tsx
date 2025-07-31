import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMenuBreadcrumb } from "../../store/slices/menuBreadcrumbSlice";
import { setMenuHeader } from "../../store/slices/menuHeaderSlice";
import { setMenuDescription } from '../../store/slices/menuDescriptionSlice';
import { useLocation } from 'react-router-dom'
import SpecificDateConsent from './SpecificDateConsent';
import DailyConsent from './DailyConsent';
import MonthlyConsent from './MonthlyConsent';
import YearlyConsent from './YearlyConsent';
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const [mainDashboardStatus, setMainDashboardStatus] = useState(false);
    type DashboardCard = { title: string; path: string };
    const [dashboard, setDashboard] = useState<DashboardCard[]>([]);

    useEffect(() => {
        console.log('location.pathname', location.pathname);
        if (location.pathname === '/dashboard/consent-dashboard') {
            setMainDashboardStatus(true);
        } else {
            setMainDashboardStatus(false);
        }

        const dashboard = [
            { title: t("dashboards.cards.specificDate"), path: '/dashboard/consent-dashboard/specific-date' },
            { title: t("dashboards.cards.daily"), path: '/dashboard/consent-dashboard/daily' },
            { title: t("dashboards.cards.monthly"), path: '/dashboard/consent-dashboard/monthly' },
            { title: t("dashboards.cards.yearly"), path: '/dashboard/consent-dashboard/yearly' },
        ];

        setDashboard(dashboard);

        dispatch(setMenuHeader(t("dashboards.title")));
        dispatch(setMenuBreadcrumb([
            { title: t("dashboards.dashboard"), url: "/dashboard/consent-dashboard" },
            { title: t("dashboards.consent"), url: "/dashboard/consent-dashboard" },
        ]));
        return () => {
            dispatch(setMenuHeader(""));
            dispatch(setMenuBreadcrumb([]));
        };
    }, [location.pathname]);

    return (

        <div className="min-h-screen bg-[#f6f5fc] px-4 sm:px-6 lg:px-8 py-4">

            {mainDashboardStatus && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1">
                    {dashboard.map((card, index) => (
                        <div key={index} className="p-1 sm:p-2">
                            <div
                                onClick={() => {
                                    navigate(card.path);
                                    setMainDashboardStatus(false);
                                }}
                                className="relative bg-white rounded-xl shadow-md h-[100px] flex items-start px-5 py-4 cursor-pointer hover:shadow-lg transition"
                            >
                                <div className="absolute top-2 bottom-2 left-2 w-[6px] bg-blue-600 rounded-full z-1"></div>

                                <div className="ml-6">
                                    <div className="text-xs text-gray-400 font-medium">{t("dashboards.cards.dashboard")}</div>
                                    <div className="text-base font-semibold text-gray-800 mt-1 whitespace-nowrap">

                                        {card.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {location.pathname === "/dashboard/consent-dashboard/specific-date" && (
                <SpecificDateConsent />
            )}
            {location.pathname === "/dashboard/consent-dashboard/daily" && (
                <DailyConsent />
            )}
            {location.pathname === "'/dashboard/consent-dashboard/monthly" && (
                <MonthlyConsent />
            )}
            {location.pathname === "/dashboard/consent-dashboard/yearly" && (
                <YearlyConsent />
            )}
        </div>

    );
};

export default DashboardPage;
