import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMenuBreadcrumb } from "../../../store/slices/menuBreadcrumbSlice";
import { setMenuHeader } from "../../../store/slices/menuHeaderSlice";
import { setMenuDescription } from '../../../store/slices/menuDescriptionSlice';
import { Button } from "../../../components/CustomComponent";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import PowerBIReportEmbed from '../../../components/PowerBi/PowerBIReportEmbed';
import ExportPdfButton from '../../../components/PowerBi/ExportPdfButton';


const MonthlyConsent = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const powerBIWorkspaceId = "fb774d22-943a-4151-81dd-d752e9f3cd45";
  const powerBIDatasetId = "f1335714-ddd7-4d55-9ac8-03c0ab516a35";
  const powerBIReportId = "7a94e88a-fab5-4001-8b33-a7a09c74391d";
  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(setMenuHeader(t("dashboards.cards.monthly")));
    dispatch(setMenuBreadcrumb([
      { title: t("dashboards.dashboard"), url: "/dashboard/consent-dashboard" },
      { title: t("dashboards.consent"), url: "/dashboard/consent-dashboard" },
      { title: t("dashboards.cards.monthly"), url: "/dashboard/consent-dashboard/monthly" },
    ]))
    return () => {
      dispatch(setMenuHeader(""));
      dispatch(setMenuBreadcrumb([]));
    };
  }, []);

  const printPage = () => {
    const prevTitle = document.title;
    document.title = t("dashboards.fileName.monthly");
    window.print();
    document.title = prevTitle;

  }
  return (
    <div>
      <div className="absolute top-[120px] right-6 z-1 flex space-x-2 bg-white">
        <Button
          onClick={printPage}
          className="bg-primary-blue text-white"
          variant="outlined">
          <p className="text-base">{t("dashboards.saveToPDF")}</p>
        </Button>
      </div>
      <div className="mt-1" id="printArea" ref={printRef} >
        <PowerBIReportEmbed reportName='Monthly' />+
      </div>
    </div>
  );
};

export default MonthlyConsent;