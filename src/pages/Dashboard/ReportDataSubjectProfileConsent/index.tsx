import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMenuDescription } from "../../../store/slices/menuDescriptionSlice";
import { InputText, Button } from "../../../components/CustomComponent";
import { RootState } from "../../../store";
import { IoAdd } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import ModalCopy from "./Components/ModalCopy";
import {
  deleteConsentReport,
  exportExcel,
  getConsentReportList,
} from "../../../services/consentReportService";
import { formatDate } from "../../../utils/Utils";
import { debounce } from "lodash";
import { useConfirm, ModalType } from "../../../context/ConfirmContext";
import { getOrganizationChart } from "../../../services/organizationService";
import { extractOrgs } from "../../../utils/Utils";
import notification from "../../../utils/notification";
const ReportDataSubjectProfileConsent: React.FC = () => {
  // ------------------- GLOBAL STATE -------------------
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  // ------------------- STATE -------------------

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [
    copyReportDataSubjectProfileConsentId,
    setCopyReportDataSubjectProfileConsentId,
  ] = useState("");
  const [copyReportName, setCopyReportName] = useState("");
  const [copyDescription, setCopyDescription] = useState("");
  const [openModalCopy, setOpenModalCopy] = useState(false);
  const [arrOrgToFilterByGlobal, setArrOrgToFilterByGlobal] = useState([]);

  const [data, setData] = useState({
    pagination: {
      page: 1,
      pageSize: 3,
      totalItems: 0,
      totalPages: 0,
    },
    data: [
      {
        reportName: "Consent of the Data Subject Profiles_Last 30 Days",
        description:
          "รายงานสำหรับเรียกดู ข้อมูลการให้ความยินยอมของ Data Subject Profile แบบย้อนหลัง 30 วัน",
        createdBy: "User A",
        createdDate: "2023-01-01",
        modifiedBy: "User B",
        modifiedDate: "2023-01-02",
        reportDataSubjectProfileConsentId: "1",
      },
      {
        reportName: "Consent of the Data Subject Profiles_Last 30 Days",
        description:
          "รายงานสำหรับเรียกดู ข้อมูลการให้ความยินยอมของ Data Subject Profile แบบย้อนหลัง 30 วัน",
        createdBy: "User C",
        createdDate: "2023-01-03",
        modifiedBy: "User D",
        modifiedDate: "2023-01-04",
        reportDataSubjectProfileConsentId: "2",
      },
    ],
  });
  const columns = useMemo(
    () => [
      {
        Header: (
          <>
            <div className="flex items-center justify-between w-full">
              <span> {t("reportDataSubjectProfileConsent.reportName")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("reportName")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: "reportName",
        Cell: ({ row }: any) => (
          <div className="flex items-center">
            <Link
              to={`/dashboard/report-data-subject-profile-consent/view/${row.original.reportDataSubjectProfileConsentId}`}
              state={{ status: "view" }}
              className="text-[#3758F9] font-semibold"
            >
              {row.original.reportName}
            </Link>
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-between w-full">
              <span> {t("reportDataSubjectProfileConsent.description")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("description")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: "description",
        Cell: ({ row }: any) => (
          <div className="flex items-center w-[250px] whitespace-break-spaces">
            {row.original.description}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.createdBy")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("createdBy")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: "createdBy",
        Cell: ({ row }: any) => (
          <div className="flex items-center">{row.original.createdBy}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex justify-center w-full">
              <span>{t("reportDataSubjectProfileConsent.createdDate")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("createdDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: "createdDate",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.createdDate}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-between w-full">
              <span>{t("reportDataSubjectProfileConsent.modifiedBy")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("modifiedBy")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: "modifiedBy",
        Cell: ({ row }: any) => (
          <div className="">{row.original.modifiedBy}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-center w-full">
              <span>{t("reportDataSubjectProfileConsent.modifiedDate")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer ml-2"
                onClick={() => handleSort("modifiedDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: "modifiedDate",
        Cell: ({ row }: any) => (
          <div className="text-center">{row.original.modifiedDate}</div>
        ),
      },
      {
        Header: <></>,
        accessor: "reportDataSubjectProfileConsentId",
        Cell: ({ value, row }: { value: string; row: any }) => (
          <div className="relative">
            {
              <BsThreeDotsVertical
                className="cursor-pointer"
                onClick={() =>
                  setExpandedRow(expandedRow === value ? null : value)
                }
              />
            }

            {expandedRow === value && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50"
              >
                <ul>
                  {row.original.consentReportFilter.length > 0 && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                      onClick={() => {
                        //   setOpenModalDeleteDataSubject(true);
                        //   setDataSubjectId([value]);
                        handleExport(value, row.original.reportName);
                        setExpandedRow(null);
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 mt-1"
                      >
                        <g clipPath="url(#clip0_7365_73033)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.2253 4.50337L13.9487 0.703572L13.3007 -0.0488281H5.55949C4.52029 -0.0488281 3.67969 0.792972 3.67969 1.83277V4.22377H4.84489L4.84429 2.29057C4.84549 1.70557 5.31589 1.23217 5.89909 1.23217L12.5195 1.22617V4.36297C12.5207 5.53117 13.4645 6.47677 14.6339 6.47677H16.9253L16.8125 15.5254C16.8107 16.1074 16.3385 16.5772 15.7571 16.582L5.81509 16.5772C5.28289 16.5772 4.85449 16.0552 4.85209 15.412V14.6458H3.68509V15.7882C3.68509 16.9354 4.45429 17.869 5.39869 17.869L16.0973 17.8666C17.1365 17.8666 17.9795 17.0206 17.9795 15.9832V5.37937L17.2253 4.50337Z"
                            fill="#111928"
                          />
                          <path
                            d="M12.1338 15.229H0V3.64062H12.1338V15.229ZM1.1658 14.0626H10.9656V4.80703H1.1658"
                            fill="#111928"
                          />
                          <path
                            d="M9.43837 12.4932H7.39537L6.00098 10.5228L4.53697 12.4932H2.48438L5.03077 9.29163L2.97457 6.49023H5.04757L6.00997 8.01303L7.03597 6.49023H9.14557L6.98977 9.29163L9.43837 12.4932Z"
                            fill="#111928"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_7365_73033">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <button
                        className="pt-1.5 pl-2 text-base"
                        // onClick={() => }
                      >
                        {t("reportDataSubjectProfileConsent.exportExcel")}
                      </button>
                    </li>
                  )}

                  {permissionPage?.isUpdate && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                      onClick={() => {
                        navigate(
                          `/dashboard/report-data-subject-profile-consent/edit/${value}`,
                          { state: { status: "edit", id: value } }
                        );
                        setExpandedRow(null);
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>

                      <button className="pt-1.5 pl-2 text-base">
                        {t("reportDataSubjectProfileConsent.edit")}
                      </button>
                    </li>
                  )}

                  {permissionPage?.isDelete && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                      onClick={() => {
                        handleDelete(value);
                        setExpandedRow(null);
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
                        // onClick={() => }
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
                        showCfCopy(value);
                        setExpandedRow(null);
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
                      >
                        {t("reportDataSubjectProfileConsent.copy")}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ),
      },
    ],
    [expandedRow, t]
  );

  const searchConditionRef = useRef({
    searchTerm: "",
    status: "all",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "",
    arrOrgToFilterByGlobal: [],
  });

  // ------------------- FUNCTIONS -------------------
  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 20;
      searchConditionRef.current.searchTerm = searchTerm;
      handleGetConsentReport();
    }, 300), // 300ms delay
    []
  );
  const handlePageChange = (page: number) => {
    // let limit = 20;
    // let searchTerm = "";
    // let pageSize = 5;
    searchConditionRef.current.page = page;
    // // ?customerId=123e4567-e89b-12d3-a456-426614174000&page=1&pageSize=10&status=all
    // handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
    handleGetConsentReport();
  };
  const showCfCopy = async (reportDataSubjectProfileConsentId: string) => {
    const getRoleNameAndDescription: any = data.data.find(
      (item: any) =>
        item.reportDataSubjectProfileConsentId ===
        reportDataSubjectProfileConsentId
    );
    setCopyReportDataSubjectProfileConsentId(reportDataSubjectProfileConsentId);
    setCopyReportName(getRoleNameAndDescription.reportName);
    setCopyDescription(getRoleNameAndDescription.description);
    setOpenModalCopy(true);
  };
  const handleSort = (column: any) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;
    let limit = 20;
    handleGetConsentReport();
  };

  const handleCopyReport = async () => {
    setOpenModalCopy(false);
    // navigate("/setting/user-management/role-permission/role-permissions", {
    //   state: {
    //     status: "copy",
    //     rolePermissionId: copyRoleId,
    //     copyRoleName: copyRoleName,
    //     copyDescription: copyDescription,
    //   },
    // });
  };

  const handleExport = (consentReportId: string, name: string) => {
    exportExcel(
      consentReportId,
      arrOrgToFilterByGlobal,
      user?.customer_id,
      name
    ).then((res: any) => {
      notification.success(
        t("reportDataSubjectProfileConsent.exportFileSuccess")
      );
    });
  };

  const handleGetConsentReport = async () => {
    const listOrgGlobal: any[] = [];
    try {
      setLoading(true);

      getConsentReportList(
        searchConditionRef.current,
        searchConditionRef.current.arrOrgToFilterByGlobal,
        user.customer_id
      ).then((res: any) => {
        if (res.data.isError === false) {
          setData({
            data: res.data.data.map((data: any) => {
              return {
                reportName: data.reportName,
                description: data.description,
                createdBy: data.createdByName,
                createdDate: formatDate("datetime", data.createdDate),
                modifiedBy: data.modifiedByName,
                modifiedDate: formatDate("datetime", data.modifiedDate),
                reportDataSubjectProfileConsentId: data.consentReportId,
                consentReportFilter: data.consentReportFilter,
              };
            }),
            pagination: res.data.pagination,
          });
          setLoading(false);
          // dispatch(setOpenLoadingFalse());
        }
      });
    } catch (error) {
      // setLoading(false);
      // dispatch(setOpenLoadingFalse());
      // console.error("error", error);
    }
  };

  const handleDelete = (reportDataSubjectProfileConsentId: string) => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        deleteConsentReport(reportDataSubjectProfileConsentId).then(
          (res: any) => {
            handleGetConsentReport();
          }
        );
      },
      notify: true,
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };
  // ------------------- USE EFFECT -------------------

  useEffect(() => {
    // if (arrOrgToFilterByGlobal.length > 0) {
    //   let limit = 20;
    handleGetConsentReport();
    // }
  }, []);

  useEffect(() => {
    const fetchOrgParent = async () => {
      if (orgparent !== "") {
        getOrganizationChart(user.customer_id, orgparent).then((res: any) => {
          if (res.data.isError === false) {
            const dataGlobalOrg = extractOrgs(res.data.data);
            if (dataGlobalOrg.length > 0) {
              const orgId = dataGlobalOrg.map((item: any) => item.value);
              setArrOrgToFilterByGlobal(orgId);
              searchConditionRef.current.arrOrgToFilterByGlobal = orgId;
            }
          }
        });
      }
    };

    fetchOrgParent();
  }, [orgparent]);

  useEffect(() => {
    if (arrOrgToFilterByGlobal.length > 0) {
      handleGetConsentReport();
    }
  }, [arrOrgToFilterByGlobal]);

    useEffect(() => {
      dispatch(
        setMenuDescription(t("reportDataSubjectProfileConsent.desc"))
      );
      return () => {
        dispatch(setMenuDescription(""));
      };
    }, [t]);

  return (
    <div className="bg-white">
      <div className="flex justify-between w-100 pt-4 px-6 pb-6 border-b shadow-sm">
        <div className="flex gap-2 items-center">
          <InputText
            onChange={(e) => handleSearch(e.target.value)}
            type="search"
            placeholder={t("interface.listview.input.search")}
            minWidth="20rem"
          ></InputText>
        </div>
        <div className="w-9/12 flex justify-end">
          {permissionPage?.isCreate && (
            <Button
              className="flex items-center gap-2 bg-primary-blue text-white"
              onClick={() => {
                navigate(
                  `/dashboard/report-data-subject-profile-consent/create-reports`,
                  { state: { status: "create" } }
                );
              }}
            >
              <IoAdd className="text-lg"></IoAdd>
              <span className="text-white text-sm font-semibold">
                {t("dataelement.form.create")}
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="pt-6 px-6">
        <Table
          columns={columns}
          data={data.data}
          pagination={data?.pagination}
          handlePageChange={handlePageChange}
          loading={loading}
        />
      </div>
      {openModalCopy && (
        <ModalCopy
          openModalCopy={openModalCopy}
          setOpenModalCopy={setOpenModalCopy}
          consentReportId={copyReportDataSubjectProfileConsentId}
          copyReportName={copyReportName}
          copyDescription={copyDescription}
        />
      )}
    </div>
  );
};

export default ReportDataSubjectProfileConsent;
