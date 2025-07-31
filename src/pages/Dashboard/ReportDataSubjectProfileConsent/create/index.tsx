import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setMenuDescription } from "../../../../store/slices/menuDescriptionSlice";
import { Button, InputText } from "../../../../components/CustomComponent";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoTriangle } from "react-icons/io5";
import { RootState } from "../../../../store";
import { extractOrgs, formatDate } from "../../../../utils/Utils";
import { IoFilterOutline } from "react-icons/io5";
import Table from "../../../../components/Table";
import FilterDrawer from "../Components/drawer";
import ModalCopy from "../Components/ModalCopy";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import {
  addConsentReport,
  deleteConsentReport,
  exportExcel,
  exportExcelCreate,
  getConsentReportById,
  getConsentReportFieldsList,
  getConsentReportListView,
  getConsentReportListViewsCreate,
  updateConsentReport,
} from "../../../../services/consentReportService";
import {
  resetFilter,
  setFilter,
} from "../../../../store/slices/filterReportDataSubjectSlice";
import { generateUUID } from "../../../../utils/Utils";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getOrganizationChart } from "../../../../services/organizationService";

import notification from "../../../../utils/notification";

const CreateReportDataSubjectProfileConsent: React.FC = () => {
  // -------------------- GLOBAL STATE ----------------------------
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const location = useLocation();
  const state = location.state;

  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );

  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);
  const getOrgLocalStorage: any = localStorage.getItem("currentOrg");
  const organizationId = JSON.parse(getOrgLocalStorage).organizationId;
  const customerId = JSON.parse(getUserSession).customer_id;
  const userData = JSON.parse(getUserSession);
  const [arrOrgToFilterByGlobal, setArrOrgToFilterByGlobal] = useState([]);
  const [filterListById, setFilterListById] = useState<any[]>([]);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const infoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const filterReportDataSubject = useSelector(
    (state: any) => state.filterReportDataSubjectSlice.filterItem
  );
  console.log("🚀 ~ filterReportDataSubject:", filterReportDataSubject)

  // -------------------------STATE ------------------------------
  const [expandedRow, setExpandedRow] = useState<boolean>(false);
  const [info, setInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState<boolean>(false);
  const [openModalCopy, setOpenModalCopy] = useState<boolean>(false);
  const [errorValue, setErrorValue] = useState<boolean>(false);

  const open = useSelector((state: RootState) => state.opensidebar.open);
  const [data, setData] = useState({
    pagination: {
      page: 1,
      pageSize: 1,
      totalItems: 0,
      total_pages: 0,
    },
    data: [],
  });
  const [dataExportXLSX, setDataExportXLSX] = useState<any[]>([]);
  const [dataDraftFilter, setDataDraftFilter] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: (
          <>
            <div className="justify-between w-full">
              <span>
                {" "}
                {t("reportDataSubjectProfileConsent.profileIdentifier")}
              </span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("ProfileIdentifier")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "profileIdentifier",
        Cell: ({ row }: any) => (
          <div className="flex items-center">
            {row.original.profileIdentifier}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="justify-between w-full">
              <span>
                {" "}
                {t("reportDataSubjectProfileConsent.standardPurpose")}
              </span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("StandardPurpose")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "standardPurpose",
        Cell: ({ row }: any) => (
          <div className="flex items-center w-[250px] whitespace-break-spaces">
            {row.original.standardPurpose}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.purposeVersion")}</span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("PurposeVersion")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "purposeVersion",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.purposeVersion}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.transactionStatusName")}</span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("PurposeVersion")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "transactionStatusName",
        Cell: ({ row }: any) => (
          <div className="text-center w-[130px] h-[35px] m-auto rounded-md flex items-center justify-center"
            style={{
                            
                            backgroundColor:
                              row.original.transactionStatusName ===
                              "Confirmed"
                                ? "#DAF8E6"
                                : row.original.transactionStatusName === "Not Given"
                                ? "#FFFBEB"
                                : row.original.transactionStatusName === "Withdrawn"
                                ? "#FDE8E8"
                                : row.original.transactionStatusName === "Expired"
                                ? "gainsboro"
                                : "",
                            color:
                              row.original.transactionStatusName ===
                              "Confirmed"
                                ? "#1A8245"
                                : row.original.transactionStatusName === "Not Given"
                                ? "#D97706"
                                : row.original.transactionStatusName === "Withdrawn"
                                ? "#e02424"
                                : row.original.transactionStatusName === "Expired"
                                ? "#637381"
                                : "",
                          }}
          >{row.original.transactionStatusName}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.interface")}</span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("interface")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "interface",
        Cell: ({ row }: any) => (
          <div className="flex items-center">{row.original.interface}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="justify-between w-full">
              <span>
                {t("reportDataSubjectProfileConsent.interfaceVersion")}
              </span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("interfaceVersion")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "interfaceVersion",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.interfaceVersion}</div>
        ),
      },
      {
        Header: (
          <>
            <div className=" justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.transactionId")}</span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("transactionId")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "transactionId",
        Cell: ({ row }: any) => (
          <div className="flex items-center">{row.original.transactionId}</div>
        ),
      },
      
      {
        Header: (
          <>
            <div className="text-center justify-between w-full">
              <span>
                {t("reportDataSubjectProfileConsent.transactionDate")}
              </span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("lastTransaction")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "transactionDate",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.transactionDate}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="text-center justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.consentDate")}</span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("consentDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "consentDate",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.consentDate}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.expireDate")}</span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("expireDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "expiredDate",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.expiredDate}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="text-center justify-between w-full">
              <span>
                {t("reportDataSubjectProfileConsent.interactionType")}
              </span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("interactionDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "interactionType",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.interactionType}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-between w-full">
              <span>
                {t("reportDataSubjectProfileConsent.interactionByName")}
              </span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("interactionBy")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "interactionByName",
        Cell: ({ row }: any) => (
          <div className="flex items-center">
            {row.original.interactionByName}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="text-center justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.withDrawalDate")}</span>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("withDrawalDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg> */}
            </div>
          </>
        ),
        accessor: "withDrawalDate",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.withdrawalDate}</div>
        ),
      },
    ],
    [expandedRow, t]
  );
  const [reportName, setReportName] = useState<string>("");

  const [description, setDescription] = useState<string>("");
  const [dataInfo, setDataInfo] = useState<any>({
    createdDate: "",
    modifiedDate: "",
    createdByName: "",
    modifiedByName: "",
  });

  const searchConditionRef = useRef({
    searchTerm: "",
    status: "all",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "",
    arrOrgToFilterByGlobal: [],
  });
  // -------------------- FUNCTIONS ----------------------------
  const exportToExcel = () => {
    if (dataDraftFilter) {
      const convertFilter = filterReportDataSubject.map((item: any) => {
        return {
          filterId: item.filterId,
          filterName: item.filterName,
          filterType: item.filterType,
          operator: item.operator,
          filterValue: JSON.stringify(item.filterValue),
          status: item.status,
        };
      });
      if (filterReportDataSubject.length > 0) {
     
        const mapFormat = filterReportDataSubject.map((item: any) => {
          return {
            filterId: item.filterId,
            id:   item.filterId,
            filterCode: item.filterCode,
            filterName:   item.filterName,
            filterType:   item.filterType,
            filterValue: JSON.stringify(item.filterValue),
              
            operator: item.operator,
            status: item.status,
          };
        });
        exportExcelCreate(arrOrgToFilterByGlobal, customerId,mapFormat,reportName).then(() => {
          notification.success(
            t("reportDataSubjectProfileConsent.exportFileSuccess")
          );
        });
      }
    } else {
      exportExcel(
        id ?? "",
        arrOrgToFilterByGlobal,
        customerId,
        reportName
      ).then(() => {
        notification.success(
          t("reportDataSubjectProfileConsent.exportFileSuccess")
        );
      });
    }
  };
  const showCfCopy = async (reportDataSubjectProfileConsentId: string) => {
    // const getRoleNameAndDescription: any = data.data.find(
    //   (item: any) =>
    //     item.reportDataSubjectProfileConsentId ===
    //     reportDataSubjectProfileConsentId
    // );
    // setCopyReportDataSubjectProfileConsentId(reportDataSubjectProfileConsentId);
    // setCopyReportName(getRoleNameAndDescription.reportName);
    // setCopyDescription(getRoleNameAndDescription.description);
    // setOpenModalCopy(true);
  };
  const handleSort = (column: string) => {
    // searchConditionRef.current.sort =
    //   searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    // searchConditionRef.current.column = column;
    // handleGetDataSubjectProfilesList(arrOrgToFilterByGlobal);
  };
  const handlePageChange = (page: number) => {
    // let limit = 20;
    // let searchTerm = "";
    // let pageSize = 5;
    searchConditionRef.current.page = page;

    if (dataDraftFilter) {
      const convertFilter = filterReportDataSubject.map((item: any) => {
        return {
          filterId: item.filterId,
          filterCode: item.filterCode,
          filterName: item.filterName,
          filterType: item.filterType,
          operator: item.operator,
          filterValue: JSON.stringify(item.filterValue),
          status: item.status,
        };
      });
      console.log("🚀 ~ convertFilter ~ convertFilter:", convertFilter)
      if (filterReportDataSubject.length > 0) {
        getConsentReportListViewsCreate(
          arrOrgToFilterByGlobal,
          customerId,
          true,
          searchConditionRef.current.page,
          20,
          convertFilter
        ).then((response) => {
          if (response.data.isError === false) {
            // formart data for table
            const formatData = response.data.data.map((item: any) => {
              return {
                reportDataSubjectProfileConsentId:
                  item.reportDataSubjectProfileConsentId,
                profileIdentifier: item.profileIdentifier,
                standardPurpose: item.standardPurpose,
                purposeVersion: item.purposeVersion,
                interface: item.interface,
                interfaceVersion: item.interfaceVersion,
                transactionId: item.transactionId,
                firstTransaction: item.firstTransaction
                  ? formatDate("dateTime", item.firstTransaction)
                  : "-",
                transactionDate: item.transactionDate
                  ? formatDate("dateTime", item.transactionDate)
                  : "-",
                consentDate: item.consentDate
                  ? formatDate("dateTime", item.consentDate)
                  : "-",
                expiredDate: item.expiredDate
                  ? formatDate("dateTime", item.expiredDate)
                  : "-",
                interactionType: item.interactionType,
                interactionBy: item.interactionBy,
                interactionByName: item.interactionByName
                  ? item.interactionByName
                  : "-",
                withdrawalDate: item.withdrawalDate
                  ? formatDate("dateTime", item.withdrawalDate)
                  : "-",
              };
            });
            setData({
              pagination: response.data.pagination,
              data: formatData,
            });
          }
        });
      }
    } else {
      handleGetConsentReportListView(filterReportDataSubject);
    }
    // searchConditionRef.current.page = page;
    // // ?customerId=123e4567-e89b-12d3-a456-426614174000&page=1&pageSize=10&status=all
    // handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
  };

  const handleCancel = () => {
    confirm({
      title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Cancel, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        navigate("/dashboard/report-data-subject-profile-consent");
      },
      notify: true,
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
    // navigate("/dashboard/report-data-subject-profile-consent");
  };

  const handleSubmit = () => {
    if (!reportName || !description) {
      setErrorValue(true);
      return;
    } else {
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          const mapDataFilter = filterReportDataSubject.map((item: any) => {
            return {
              consentReportFilterId:
                state.status === "edit"
                  ? item.consentReportFilterId
                  : "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              consentReportId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              consentReportFieldId: item.filterId,
              operator: item?.operator,
              value: JSON.stringify(item.filterValue),
              isActiveStatus: true,
              createdDate: "2025-06-13T09:46:05.530Z",
              modifiedDate: "2025-06-13T09:46:05.530Z",
              createdBy: userData.user_account_id,
              modifiedBy: userData.user_account_id,
            };
          });
          const data = {
            consentReportId:
              state?.status === "edit"
                ? id
                : "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            reportName: reportName,
            description: description,
            customerId: customerId,
            organizationId: organizationId,
            isActiveStatus: true,
            createdDate: "2025-06-13T09:46:05.530Z",
            modifiedDate: "2025-06-13T09:46:05.530Z",
            createdBy: userData.user_account_id,
            modifiedBy: userData.user_account_id,
            createdByName: userData.first_name + " " + userData.last_name,
            modifiedByName: "",
            consentReportFilter: mapDataFilter,
          };
          if (state.status === "edit") {
            updateConsentReport(data)
              .then((response) => {
                if (response?.data?.isError === false) {
                  navigate(
                    `/dashboard/report-data-subject-profile-consent/edit/${response?.data?.data?.consentReportId}`,
                    {
                      state: {
                        status: "edit",
                        id: response?.data?.data?.consentReportId,
                      },
                    }
                  );
                }
                // navigate("/dashboard/report-data-subject-profile-consent");
              })
              .catch((error) => {
                // Handle error
                console.error("Error creating consent report:", error);
              });
          } else {
            addConsentReport(data)
              .then((response) => {
                if (response?.data?.isError === false) {
                  navigate(
                    `/dashboard/report-data-subject-profile-consent/edit/${response?.data?.data?.consentReportId}`,
                    {
                      state: {
                        status: "edit",
                        id: response?.data?.data?.consentReportId,
                      },
                    }
                  );
                }
                // navigate("/dashboard/report-data-subject-profile-consent");
              })
              .catch((error) => {
                // Handle error
                console.error("Error creating consent report:", error);
              });
          }
        },
        notify: true,
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    }

    // Handle form submission logic here
  };
  const handleDelete = () => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        // Handle delete logic here
        deleteConsentReport(id ?? "").then((response) => {
          navigate("/dashboard/report-data-subject-profile-consent");
        });
      },
      notify: true,
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };

  const handleGetConsentReportListView = (filterById: any) => {
    if (filterById.length) {
      setLoading(true);

      getConsentReportListView(
        state.status === "copy" ? state.consentReportId : id ?? "",
        arrOrgToFilterByGlobal,
        customerId,
        true,
        searchConditionRef.current.page,
        searchConditionRef.current.pageSize
      )
        .then((response) => {
          if (response.data.isError === false) {
            const formatData = response.data.data.map((item: any) => {
              return {
                reportDataSubjectProfileConsentId:
                  item.reportDataSubjectProfileConsentId,
                profileIdentifier: item.profileIdentifier,
                standardPurpose: item.standardPurpose,
                transactionStatusName: item.transactionStatusName,
                purposeVersion: item.purposeVersion,
                interface: item.interface,
                interfaceVersion: item.interfaceVersion,
                transactionId: item.transactionId,
                firstTransaction: item.firstTransaction
                  ? formatDate("dateTime", item.firstTransaction)
                  : "-",
                transactionDate: item.transactionDate
                  ? formatDate("dateTime", item.transactionDate)
                  : "-",
                consentDate: item.consentDate
                  ? formatDate("dateTime", item.consentDate)
                  : "-",
                expiredDate: item.expiredDate
                  ? formatDate("dateTime", item.expiredDate)
                  : "-",
                interactionType: item.interactionType,
                interactionByName: item.interactionByName
                  ? item.interactionByName
                  : "-",
                withdrawalDate: item.withdrawalDate
                  ? formatDate("dateTime", item.withdrawalDate)
                  : "-",
              };
            });
            setData({
              data: formatData,
              pagination: {
                page: response.data.pagination.page,
                pageSize: 1,
                totalItems: response.data.pagination.total_items,
                total_pages: response.data.pagination.total_pages,
              },
            });
            setLoading(false);
          }
          // Handle the response data
        })
        .catch((error) => {
          // Handle error
          setData({
            data: [],
            pagination: {
              page: 1,
              pageSize: 1,
              totalItems: 1,
              total_pages: 1,
            },
          });
          setLoading(false);
          console.error("Error fetching consent report list view:", error);
        });
    }
  };

  // -------------------- USE EFFECTS ----------------------------
  useEffect(() => {
    if (state.status === "create") {
      dispatch(resetFilter());
    }
    if (state.status === "copy") {
      setReportName(state.reportName);
      setDescription(state.description);
    }
  }, [state.status]);

  useEffect(() => {
    const fetchOrgParent = async () => {
      let limit = 20;
      if (orgparent !== "") {
        getOrganizationChart(user.customer_id, orgparent).then((res: any) => {
          if (res.data.isError === false) {
            const dataGlobalOrg = extractOrgs(res.data.data);
            if (dataGlobalOrg.length > 0) {
              const orgId = dataGlobalOrg.map((item: any) => item.value);
              setArrOrgToFilterByGlobal(orgId);
            }
          }
        });
      }
    };

    fetchOrgParent();
  }, [orgparent]);

  useEffect(() => {
    dispatch(
      setMenuDescription(
        state.status === "view"
          ? t("reportDataSubjectProfileConsent.descViewReport")
          : state.status === "edit"
          ? t("reportDataSubjectProfileConsent.descEditReport")
          : t("reportDataSubjectProfileConsent.descCreateReport")
      )
    );
    return () => {
      dispatch(setMenuDescription(""));
    };
  }, [t]);

  useEffect(() => {
    setLoading(true);
    if (
      state.status === "view" ||
      state.status === "edit" ||
      state.status === "copy"
    ) {
      dispatch(resetFilter());
      getConsentReportById(
        state.status === "view" || state.status === "edit"
          ? id
          : state.status === "copy"
          ? state.consentReportId ?? ""
          : ""
      )
        .then((response) => {
          // Handle the response data
          if (response.data.isError === false) {
            getConsentReportFieldsList()
              .then((responseFields: any) => {
                if (state.status === "view" || state.status === "edit") {
                  setReportName(response.data.data.reportName);
                  setDescription(response.data.data.description);
                }

                setDataInfo({
                  createdDate: response.data.data.createdDate,
                  modifiedDate: response.data.data.modifiedDate,
                  createdByName: response.data.data.createdByName,
                  modifiedByName: response.data.data.modifiedByName,
                });
                const convertFilter =
                  response.data.data.consentReportFilter.map((item: any) => {
                    dispatch(resetFilter());
                    const consentReportFieldId = responseFields.data.data.find(
                      (field: any) =>
                        field.consentReportFieldId === item.consentReportFieldId
                    )?.consentReportFieldId;
                    const fieldName = responseFields.data.data.find(
                      (field: any) =>
                        field.consentReportFieldId === item.consentReportFieldId
                    )?.fieldName;
                    const dataType = responseFields.data.data.find(
                      (field: any) =>
                        field.consentReportFieldId === item.consentReportFieldId
                    )?.dataType;
                    const filterCode = responseFields.data.data.find(
                      (field: any) =>
                        field.consentReportFieldId === item.consentReportFieldId
                    )?.fieldCode;
                    console.log("🚀 ~ response.data.data.consentReportFilter.map ~ filterCode:", filterCode)
                  
                    return {
                      filterId: consentReportFieldId,
                      operator: item.operator,
                      filterValue: JSON.parse(item.value),
                      filterCode: filterCode,
                      filterName: fieldName,
                      filterType: dataType,
                      status: "save",
                    };
                  });

                setFilterListById(response.data.data.consentReportFilter);
                if (
                  arrOrgToFilterByGlobal.length &&
                  response.data.data.consentReportFilter.length
                ) {
                  handleGetConsentReportListView(
                    response.data.data.consentReportFilter
                  );
                }
                convertFilter.forEach((filter: any, index: number) => {
                  dispatch(
                    setFilter({
                      id: generateUUID(),
                      filterId: filter.filterId,
                      filterCode: filter.filterCode,
                      // consentReportFieldId: filter.filterId,
                      filterName: filter.filterName,
                      filterType: filter.filterType,
                      operator: filter.operator,
                      filterValue: filter.filterValue,
                      status: filter.status,
                    })
                  );
                });
                setLoading(false);
              })
              .catch((error: any) => {
                // Handle error
                console.error("Error fetching consent report fields:", error);
              });
          }
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching consent report:", error);
        });

      // setLoading(false);
    }
    if (state.status === "create") {
      setLoading(false);
    }
  }, [id, state.status, arrOrgToFilterByGlobal]);

  return (
    <>
      <div className="bg-white">
        <div className="absolute top-[120px] right-6 flex">
          <Button
            className="rounded mx-1 bg-white py-2 px-4 text-base  border border-1 border-gray-200 text-blue font-medium"
            onClick={() => {
              handleCancel();
            }}
          >
            {t("reportDataSubjectProfileConsent.cancel")}
          </Button>
          {state.status === "view" && permissionPage.isUpdate && (
            <Button
              className="rounded bg-[#000] py-2 px-4 text-base text-white font-semibold ml-2"
              onClick={() =>
                navigate(
                  `/dashboard/report-data-subject-profile-consent/edit/${id}`,
                  { state: { status: "edit" } }
                )
              }
            >
              {t("reportDataSubjectProfileConsent.edit")}
            </Button>
          )}
          {(state.status === "create" ||
            state.status === "copy" ||
            state.status === "edit") &&
            (permissionPage.isCreate || permissionPage.isUpdate) && (
              <Button
                className="rounded bg-[#3758F9] py-2 px-4 text-base text-white font-semibold ml-2"
                onClick={() => handleSubmit()}
              >
                {t("reportDataSubjectProfileConsent.save")}
              </Button>
            )}
          {state.status === "edit" &&
            permissionPage.isCreate &&
            permissionPage.isDelete && (
              <div>
                <BsThreeDotsVertical
                  className="cursor-pointer size-5 text-gray-600 mt-3 ml-2"
                  onClick={() => setExpandedRow(!expandedRow)}
                />

                {expandedRow && (
                  <div
                    ref={menuRef}
                    className="absolute right-6 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50"
                  >
                    <ul>
                      {permissionPage?.isDelete && (
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                          onClick={() => {
                            //   setOpenModalDeleteDataSubject(true);
                            //   setDataSubjectId([value]);
                            setExpandedRow(false);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5 mt-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                          <button
                            className="pt-1.5 pl-2 text-base"
                            onClick={() => handleDelete()}
                          >
                            {t("roleAndPermission.delete")}
                          </button>
                        </li>
                      )}
                      {permissionPage?.isCreate && (
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                          onClick={() => {
                            //   setOpenModalDeleteDataSubject(true);
                            //   setDataSubjectId([value]);
                            setExpandedRow(false);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5 mt-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                            />
                          </svg>
                          <button
                            className="pt-1.5 pl-2 text-base"
                            // onClick={() => }
                            onClick={() => {
                              setOpenModalCopy(true);
                              setExpandedRow(false);
                            }}
                          >
                            {t("reportDataSubjectProfileConsent.copy")}
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>
        <div className="flex pr-6 pl-3 border-b border-gray-200 pb-5 pt-4 shadow-sm">
          <div className="w-4/12 m-1">
            <p className="font-semibold">
              <span className="text-[red] mr-1">*</span>
              {t("reportDataSubjectProfileConsent.reportName")}
            </p>
            <InputText
              className="mt-2"
              disabled={state.status === "view"}
              value={reportName}
              isError={errorValue && !reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
            {errorValue && !reportName && (
              <p className="text-red-500 text-sm mt-1">
                {t("thisfieldisrequired")}
              </p>
            )}
          </div>
          <div className="w-7/12 m-1">
            <p className="font-semibold">
              <span className="text-[red] mr-1">*</span>
              {t("reportDataSubjectProfileConsent.description")}
            </p>

            <InputText
              className="mt-2"
              disabled={state.status === "view"}
              value={description}
              isError={errorValue && !description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errorValue && !description && (
              <p className="text-red-500 text-sm mt-1">
                {t("thisfieldisrequired")}
              </p>
            )}
          </div>
          <div className="w-2/12 m-1 justify-end flex items-center mt-[32px] ml-2">
            {state.status !== "create" && state.status !== "copy" && (
              <>
                <button
                  onClick={() => setInfo(!info)}
                  type="button"
                  className="h-[42px] relative flex mb-2 md:mb-0 text-black bg-[#ECEEF0] font-medium rounded-lg text-base px-5 py-1.5 text-center"
                >
                  <p className="pr-1 text-base m-auto">
                    {t("settings.organizations.create.loginfo")}
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 mt-[4px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                </button>
                {info && (
                  <div
                    ref={infoRef}
                    className={`arrow-box bg-black w-[325px] absolute text-white py-3 px-6 mt-[25px] rounded rounded-lg right-44`}
                    //   style={{
                    //     left: open ? "750px" : "750px",
                    //   }}
                  >
                    <div className="flex">
                      <div className="w-6/12">
                        <p className="font-semibold text-base text-[gainsboro]">
                          {t("settings.organizations.create.createDate")}
                        </p>
                        <p className=" text-base pt-2">
                          {formatDate("datetime", dataInfo.createdDate)}

                          {/* {dataInfo.createdDate} */}
                        </p>
                        <p className="font-semibold text-base pt-2 text-[gainsboro]">
                          {t("settings.organizations.create.updateDate")}
                        </p>
                        <p className=" text-base pt-2">
                          {formatDate("datetime", dataInfo.modifiedDate)}
                        </p>
                      </div>
                      <div className="w-6/12">
                        <p className="font-semibold text-base text-[gainsboro]">
                          {t("settings.organizations.create.createdBy")}
                        </p>
                        <p className=" text-base pt-2">
                          {dataInfo.createdByName}
                        </p>
                        <p className="font-semibold text-base pt-2 text-[gainsboro]">
                          {t("settings.organizations.create.updatedBy")}
                        </p>
                        <p className=" text-base pt-2">
                          {dataInfo.modifiedByName}
                        </p>
                      </div>
                    </div>
                    <IoTriangle
                      className="absolute top-[50px] right-[-10px] text-black"
                      style={{ transform: "rotate(205deg)" }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="m-4 rounded p-4 bg-white">
        <p className="font-semibold text-lg">
          {t("reportDataSubjectProfileConsent.consentOfTheDataSubjectProfiles")}
        </p>
        <div className="flex">
          <div className="w-9/12">
            <p className="text-base pt-1">
              {t("reportDataSubjectProfileConsent.descConsent")}
            </p>
          </div>

          <div className="w-3/12 flex justify-end items-center">
            {filterReportDataSubject.length > 0 && (
              <div className="mx-3 font-semibold text-base text-[red]">
                {t("reportDataSubjectProfileConsent.add")}{" "}
                {filterReportDataSubject.length}{" "}
                {t("reportDataSubjectProfileConsent.filters")}
              </div>
            )}
            <div className="pr-4 border-r border-[gainsboro]">
              <IoFilterOutline
                className="text-gray-500 size-5 text-2xl  cursor-pointer m-auto  "
                onClick={() => setOpenFilterDrawer(true)}
              />
            </div>
            <div className=" pl-3">
              {(data.data.length  > 0 && reportName !== "") && (
                <Button
                  className="bg-[#000] text-white rounded px-4 py-2"
                  // disabled={state.status === "view"}
                  onClick={exportToExcel}
                >
                  {t("reportDataSubjectProfileConsent.exportExcel")}
                </Button>
              )}
              {/* )} */}
            </div>
          </div>
        </div>
        <div>
          <Table
            id="reportDataSubjectProfileConsentTable"
            columns={columns}
            data={data.data}
            pagination={data?.pagination}
            handlePageChange={handlePageChange}
            loading={loading}
          />

          <FilterDrawer
            openFilterDrawer={openFilterDrawer}
            setOpenFilterDrawer={setOpenFilterDrawer}
            status={state.status}
            org={arrOrgToFilterByGlobal}
            onDataFetch={(data) => {
              setLoading(true);
              setDataDraftFilter(true);
              if (data?.data?.length) {
                const formatData = data.data.map((item: any) => {
                  return {
                    reportDataSubjectProfileConsentId:
                      item.reportDataSubjectProfileConsentId,
                    profileIdentifier: item.profileIdentifier,
                    standardPurpose: item.standardPurpose,
                    purposeVersion: item.purposeVersion,
                    interface: item.interface,
                    interfaceVersion: item.interfaceVersion,
                    transactionId: item.transactionId,
                    firstTransaction: item.firstTransaction
                      ? formatDate("dateTime", item.firstTransaction)
                      : "-",
                    transactionDate: item.transactionDate
                      ? formatDate("dateTime", item.transactionDate)
                      : "-",
                    consentDate: item.consentDate
                      ? formatDate("dateTime", item.consentDate)
                      : "-",
                    expiredDate: item.expiredDate
                      ? formatDate("dateTime", item.expiredDate)
                      : "-",
                    interactionType: item.interactionType,
                    interactionByName: item.interactionByName
                      ? item.interactionByName
                      : "-",
                    withdrawalDate: item.withdrawalDate
                      ? formatDate("dateTime", item.withdrawalDate)
                      : "-",
                  };
                });
                setData((prevData) => ({
                  ...prevData,
                  data: formatData,
                  pagination: data.pagination,
                }));
                setDataExportXLSX(data); // อัปเดต state ด้วยข้อมูลที่ได้รับ
                setLoading(false);
              } else {
                setData({
                  data: [],
                  pagination: {
                    page: 1,
                    pageSize: 1,
                    totalItems: 1,
                    total_pages: 1,
                  },
                });
                setLoading(false);
              }
            }}
          />
          {openModalCopy && (
            <ModalCopy
              openModalCopy={openModalCopy}
              setOpenModalCopy={setOpenModalCopy}
              consentReportId={id ?? ""}
              copyReportName={reportName}
              copyDescription={description}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CreateReportDataSubjectProfileConsent;
