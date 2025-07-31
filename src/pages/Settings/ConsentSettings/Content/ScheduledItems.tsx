import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import customStyles from "../../../../utils/styleForReactSelect";
import Table from "../../../../components/Table";
import ModalChangePassword from "../../../../components/Modals/ModalPlaceOnHold";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/CustomComponent/InputText";
import {
  Dropdown,
  DropdownOption,
} from "../../../../components/CustomComponent";
import {
  getDataRetentionLog,
  getDataRetentionLogRun,
} from "../../../../services/dataRetentionService";
import { formatDate } from "../../../../utils/Utils";
import { debounce } from "lodash";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
const ScheduledItems = () => {
  // ------------- STATE AND GLOBAL STATE -----------------
  const getUser = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") || "")
    : null;
    
  const customerId = getUser?.customer_id || "";
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();

  const themeColor = useSelector((state: any) => state.theme.themeColor);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openPlaceOnHoldModal, setOpenPlaceOnHoldModal] = useState(false);
  const [selectedStatusName, setSelectedStatusName] = useState({
    value: "all",
    label: t("settings.consentSetting.dataRetention.all"),
  });
  const [loading, setLoading] = useState(false);
  const stdStatus = [
    {
      value: "All",
      label: t("settings.consentSetting.dataRetention.all"),
    },
    {
      value: "Failed",
      label: t("settings.consentSetting.dataRetention.fail"),
    },
    {
      value: "Success",
      label: t("settings.consentSetting.dataRetention.success"),
    },
    {
      value: "Running",
      label: t("settings.consentSetting.dataRetention.running"),
    },
  ];
  const [selectedStatus, setSelectedStatus] = useState("");
  const [data, setData] = useState({
    data: [],
    pagination: { page: 1, per_page: 20, total_pages: 1, total_items: 1 },
  });
  const searchConditionRef = useRef({
    searchTerm: "",
    status: selectedStatusName.value,
    page: 1,
    pageSize: 10,
    sort: "desc",
    column: "",
  });

  // ------------- FUNCTIONS -----------------

  // ------------- USE EFFECT -----------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setExpandedRow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // ------------- DATA FOR TABLE -----------------

  const columns = useMemo(
    () => [
      {
        Header: (
          <>
            <div className="flex text-center justify-center">
              {t("settings.consentSetting.dataRetention.actionDate")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("actionDate")}
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
        accessor: "actionDate",
        Cell: ({ value }: { value: string }) => (
          <p className="text-center">{value}</p>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t(
                "settings.consentSetting.dataRetention.retentionActivitiesLogsID"
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("dataRetentionLogId")}
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
        accessor: "dataRetentionLogId",
        Cell: ({ value }: { value: string }) => <p className="">{value}</p>,
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("settings.consentSetting.dataRetention.dataType")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("dataType")}
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
        accessor: "dataType",
        Cell: ({ value }: { value: string }) => <p className="">{value}</p>,
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("settings.consentSetting.dataRetention.retentionItem")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("retentionItemsCount")}
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
        accessor: "retentionItemsCount",
        Cell: ({ value }: { value: string }) => (
          <p className="text-center">{value}</p>
        ),
      },
      {
        Header: (
          <>
            <div className="flex text-center justify-center">
              {t("settings.consentSetting.dataRetention.status")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("status")}
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
        accessor: "status",
        Cell: ({ value }: { value: string }) => (
          <p
            className={`text-center text-base font-semibold rounded py-1 px-3
                ${value === "Success" && "bg-[#DAF8E6] text-[#1A8245]"}
                ${value === "Running" && "bg-[#D0F0FD] text-[#3758F9]"}
                ${value === "Failed" && "bg-[#FEEBEB] text-[#E10E0E]"}
            `}
          >
            {value}
          </p>
        ),
      },
      {
        Header: (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("settings.consentSetting.dataRetention.actionType")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("actionType")}
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
        accessor: "actionType",
        Cell: ({ value }: { value: string }) => (
          <p className="text-center">{value}</p>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("settings.consentSetting.dataRetention.actionByName")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("actionByName")}
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
        accessor: "actionByName",
        Cell: ({ value }: { value: string }) => <p className="">{value}</p>,
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("settings.consentSetting.dataRetention.retentionPolicyName")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("retentionPolicyName")}
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
        accessor: "retentionPolicyName",
        Cell: ({ value }: { value: string }) => <p className="">{value}</p>,
      },
      {
        Header: "",
        accessor: "dataRetentionLogId2",
        Cell: ({ row }: { row: any }) => {
          return (
            row.original.status === "Failed" && (
          <div className="relative">
            <BsThreeDotsVertical
              className="cursor-pointer"
              onClick={() => {
                setExpandedRow(
                  expandedRow === row.original.dataRetentionLogId
                    ? null
                    : row.original.dataRetentionLogId
                );
              }}
            />
            {expandedRow === row.original.dataRetentionLogId && (
              <div
                ref={menuRef}
                className="absolute cursor-pointer flex right-0 mt-2  bg-white border border-gray-200 rounded shadow-lg z-50 p-3"
                onClick={() => {
                  setExpandedRow(null);
                  funcRetry(row.original.dataRetentionLogId);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <p>
                  {t(
                    "settings.consentSetting.dataRetention.retryRetentionTask"
                  )}
                </p>
              </div>
            )}
          </div>
          )
        )},
      },
    ],
    [expandedRow, selectedRows, data, t]
  );

  // ------------- FUNCTIONS FOR TABLE -----------------
  const funcRetry = (dataRetentionLogId: string) => {
    confirm({
      title: t("settings.consentSetting.dataRetention.confirmRetry"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t(
        "settings.consentSetting.dataRetention.confirmRetryDescription"
      ), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Retry, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        try {
          const res = await getDataRetentionLogRun(
            dataRetentionLogId,
            getUser?.user_account_id || ""
          );
          // if (res.data.isError === false) {
          //   getDataList(10);
          // } else {
          //   throw new Error(res.data.message || "Unknown error");
          // }
        } catch (error) {
          // console.error("error", error);
          throw error; // ส่ง error ไปยัง ConfirmModal
        }
      },
      notify: true,
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.successConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.errorConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };
  const handlePageChange = (page: number) => {
    let limit = 20;
    let searchTerm = "";
    let pageSize = 5;
    searchConditionRef.current.page = page;
       fetchDataRetentionActivitiesLog();
    // getDataList(limit);
  };
  const handleSort = (column: any) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;

    fetchDataRetentionActivitiesLog();
  };

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 10;
      searchConditionRef.current.searchTerm = searchTerm;
      fetchDataRetentionActivitiesLog();
    }, 300), // 300ms delay
    []
  );

  const fetchDataRetentionActivitiesLog = async () => {
    setLoading(true);
    try {
      const response = await getDataRetentionLog(
        searchConditionRef,
        customerId
      );
      if (response.data.isError === false) {
        const formatData = response.data.data.map((item: any) => {
          return {
            ...item,
            actionDate: formatDate("datetime", item.actionDate),
          };
        });
        setData({
          data: formatData,
          pagination: {
            page: response.data.pagination.page,
            per_page: response.data.pagination.per_page,
            total_pages: response.data.pagination.total_pages,
            total_items: response.data.pagination.total_items,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  // -------------- USE EFFECT FOR DATA FETCHING -----------------
  useEffect(() => {
    fetchDataRetentionActivitiesLog();
  }, [searchConditionRef]);
  return (
    <div className="bg-white w-full">
      <div className="flex pb-3">
        <div className="w-9/12 px-5 pt-7 pb-2">
          <h1 className="text-2xl font-semibold">
            {t("settings.consentSetting.dataRetention.retentionactivitieslogs")}
          </h1>
          <p className="">
            {t(
              "settings.consentSetting.dataRetention.theAmountOfActivitiesLogged"
            )}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex">
          <div className="w-2/12 relative w-auto  my-auto mx-0">
            <div className="absolute inset-y-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <Input
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
              placeholder={t("settings.consentSetting.dataRetention.search")}
              minWidth="20rem"
            ></Input>
          </div>
          <div className="w-2/12 my-auto mx-1">
            <Dropdown
              id="selectedStatus"
              title=""
              className="w-full"
              selectedName={selectedStatusName.label}
              disabled={false}
              isError={false}
              minWidth="10rem"
              customeHeight={true}
              customeHeightValue="185px"
              //   optionHeight="h-[8rem]"
            >
              {stdStatus.map((item) => (
                <DropdownOption
                  selected={selectedStatus === item.value}
                  onClick={() => {
                    searchConditionRef.current.status = item.value;
                    let limit = 10;
                    fetchDataRetentionActivitiesLog();
                    setSelectedStatusName(item);
                    fetchDataRetentionActivitiesLog();
                    // getDataList(limit);
                  }}
                  key={item.value}
                >
                  <span
                    className={`${
                      selectedStatus === item.value ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </DropdownOption>
              ))}
            </Dropdown>
          </div>
        </div>
        <Table
          columns={columns}
          data={data.data || []}
          pagination={data.pagination}
          handlePageChange={handlePageChange}
          loading={loading}
        />
        {openPlaceOnHoldModal && (
          <ModalChangePassword
            setOpenPlaceOnHoldModal={setOpenPlaceOnHoldModal}
          />
        )}
      </div>
    </div>
  );
};
export default ScheduledItems;
