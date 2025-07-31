import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import Select, { StylesConfig } from "react-select";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import GroupIC from "../../../../assets/GroupIC.svg";
import customStyles from "../../../../utils/styleForReactSelect";
import Table from "../../../../components/Table";
import SubjectRetention from "./Drawer/SubjectRetention";
import SubjectReceiptRetention from "./Drawer/SubjectReceiptRetention";
import {
  getDataRetention,
  delRetention,
} from "../../../../services/dataRetentionService";
import { formatDate } from "../../../../utils/Utils";
import { RootState } from "../../../../store";
import { useTranslation } from "react-i18next";
import {
  setOpenLoadingFalse,
  setOpenLoadingTrue,
} from "../../../../store/slices/loadingSlice";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import debounce from "lodash.debounce";
import InputText from "../../../../components/CustomComponent/InputText";
import Input from "../../../../components/CustomComponent/InputText";
import Dropdown from "../../../../components/CustomComponent/Dropdown";
import DropdownOption from "../../../../components/CustomComponent/Dropdown/DropdownOption";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/CustomComponent";

interface StdStatus {
  id: string;
  label: string;
  value: string;
}
const DataRetention = () => {
  // ------------- STATE AND GLOBAL STATE -----------------
  const getUser = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") || "")
    : null;
  const customerId = getUser?.customer_id || "";
  const confirm = useConfirm();
  const themeColor = useSelector((state: any) => state.theme.themeColor);
  const [isOpenSubJectRetention, setIsOpenSubJectRetention] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isOpenSubJectReceiptRetention, setIsOpenSubJectReceiptRetention] =
    useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();
  const [policyId, setPolicyId] = useState("");
  const [selectedStatusName, setSelectedStatusName] = useState("All Status");
  const [selectedStatus, setSelectedStatus] = useState("");
  //  const [stdStatus, setStdStatus] = useState<StdStatus[]>([]);

  // ------------- FUNCTIONS -----------------
  //  const [arrToFilterByGlobal, setArrToFilterByGlobal] = useState([]);
  const toggleMenuSubjectRetention = () => {
    setIsOpenSubJectRetention(!isOpenSubJectRetention);
    setIsEdit(false);
    setIsView(false);
  };
  const toggleMenuSubjectReceiptRetention = () => {
    setIsOpenSubJectReceiptRetention(!isOpenSubJectReceiptRetention);
    setIsEdit(false);
    setIsView(false);
  };
  const refreshData = () => {
    getDataList(10);
  };
  // ------------- USE EFFECT -----------------
  //   useEffect(() => {
  //     refreshData();
  // }, []);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setExpandedRow(null);
      }
    };
    getDataList(10);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const EditRetention = (policyId: string, policyType: string) => {
    setPolicyId(policyId);
    setIsEdit(true);
    if (policyType === "DataSubjectRetentionPolicy")
      setIsOpenSubJectRetention(!isOpenSubJectRetention);
    else setIsOpenSubJectReceiptRetention(!isOpenSubJectReceiptRetention);
  };
  const stdStatus = [
    {
      value: "all",
      label: t("settings.consentSetting.dataRetention.allStatus"),
    },
    {
      value: "active",
      label: t("settings.consentSetting.dataRetention.active"),
    },
    {
      value: "inactive",
      label: t("settings.consentSetting.dataRetention.inactive"),
    },
  ];
  // ------------- DATA FOR TABLE -----------------
  const [data, setData] = useState({
    data: [],
    pagination: { page: 1, per_page: 20, total_pages: 1, total_items: 1 },
  });
  const searchConditionRef = useRef({
    searchTerm: "",
    status: "all",
    page: 1,
    pageSize: 10,
    sort: "desc",
    column: "",
    // arrToFilterByGlobal: [],
  });

  const showDelAlert = async (dataRetentionId: string) => {
    // console.log('dataRetentionId',dataRetentionId);
    confirm({
      title: t("modal.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("modal.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        try {
          const res = await delRetention(dataRetentionId);
          if (res.data.isError === false) {
            getDataList(10);
          } else {
            throw new Error(res.data.message || "Unknown error");
          }
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

  const columns = useMemo(
    () => [
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
                onClick={() => handleSort("policyName")}
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
        accessor: "policyName",
        Cell: ({ value, row }: { value: string; row: any }) => (
          <p
            className="cursor-pointer text-[#3758F9] font-semibold text-base"
            onClick={() => {
              console.log("id", row.original.dataRetentionId);
              console.log("policyType", row.original.policyType);
              if (row.original.policyType === "DataSubjectRetentionPolicy") {
                setIsView(true);
                setIsOpenSubJectRetention(true);
                setPolicyId(row.original.policyId);
                setIsEdit(false);
              } else {
                setIsView(true);
                setIsOpenSubJectReceiptRetention(true);
                setPolicyId(row.original.policyId);
                setIsEdit(false);
              }
            }}
          >
            {value}
          </p>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("settings.consentSetting.dataRetention.retentionPolicyType")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("policyType")}
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
        accessor: "policyType",
        Cell: ({ value }: { value: string }) => (
          <p>
            {value === "DataSubjectRetentionPolicy"
              ? t(
                  "settings.consentSetting.dataRetention.dataSubjectRetentionPolicy"
                )
              : t(
                  "settings.consentSetting.dataRetention.dataReceiptRetentionPolicy"
                )}
          </p>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("settings.consentSetting.dataRetention.retentionPolicyStatus")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
                onClick={() => handleSort("policyStatus")}
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
        accessor: "isActiveStatus",
        Cell: ({ row }: { row: any }) =>{
          console.log("🚀 ~ DataRetention ~ value:",  row.original.isActiveStatus)
          return(
        
          <div style={{ width: "170px" }}>
            <p
              className={`m-auto font-medium p-1 rounded-md w-[90px] text-center  ${
                row.original.isActiveStatus
                  ? "bg-[#c4ead0] text-[#157535]"
                  : "bg-[#f5c6cb] text-[#721c24]"
              }`}
            >
              { row.original.isActiveStatus 
                ? t("settings.consentSetting.dataRetention.active")
                : t("settings.consentSetting.dataRetention.inactive")}
            </p>
          </div>
        )},
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("roleAndPermission.modifiedBy")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
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
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("roleAndPermission.modifiedDate")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "10px" }}
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
      },
      {
        Header: "",
        accessor: "dataRetentionId",
        Cell: ({ row }: { row: any }) => (
          <div className="relative">
            <BsThreeDotsVertical
              className="cursor-pointer"
              onClick={() => {
                setExpandedRow(
                  expandedRow === row.original.dataRetentionId
                    ? null
                    : row.original.dataRetentionId
                );
              }}
            />
            {expandedRow === row.original.dataRetentionId && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50"
              >
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex"
                    onClick={() => {
                      setExpandedRow(null);
                      setIsView(false);
                      EditRetention(
                        row.original.policyId,
                        row.original.policyType
                      );
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
                    <p className="pt-1.5 pl-2 font-normal">{"Edit"}</p>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                    onClick={() => {
                      setExpandedRow(null);
                      showDelAlert(row.original.dataRetentionId);
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
                    <Button className="pt-1.5 pl-2 font-normal">
                      {"Delete"}
                    </Button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ),
      },
    ],
    [expandedRow, t]
  );

  // ------------- SELECT OPTIONS -----------------
  const getDataList = async (limit: number) => {
    // console.log("🚀 ~ getDataList ~ limit:", limit);
    try {
      setLoading(true);
      getDataRetention(limit, searchConditionRef.current,customerId).then((res: any) => {
        if (res?.data?.data?.length) {
          const item = res?.data?.data?.map((data: any) => {
            return {
              dataRetentionId: data.dataRetentionId,
              policyId: data.policyId,
              policyName: data.policyName,
              policyType: data.policyType,
              policyStatus: data.policyStatus,
              modifiedBy: data.modifiedByName,
              modifiedDate: formatDate("datetime", data.modifiedDate),
              pagination: res?.data?.pagination,
              isActiveStatus: data.isActiveStatus,
            };
          });
          //console.log('item',item);
          setData({ data: item, pagination: res?.data?.pagination });
          setExpandedRow(null);
          setLoading(false);
        } else {
          setData({ data: [], pagination: res?.data?.pagination });
          setLoading(false);
        }
      });

      // dispatch(setOpenLoadingFalse());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 10;
      searchConditionRef.current.searchTerm = searchTerm;
      getDataList(limit);
    }, 300), // 300ms delay
    []
  );
  const handlePageChange = (page: number) => {
    let limit = 20;
    let searchTerm = "";
    let pageSize = 5;
    searchConditionRef.current.page = page;
    getDataList(limit);
    // ?customerId=123e4567-e89b-12d3-a456-426614174000&page=1&pageSize=10&status=all
    // handleGetRoleAndPermission(limit);
  };
  const handleSort = (column: any) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;
    let limit = 20;
    getDataList(limit);
  };

  return (
    <div className="w-full">
      <div className="flex pb-2  ">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold">
            {t("settings.consentSetting.dataRetention.title")}
          </h2>
          <p className="text-base">
            {t("settings.consentSetting.dataRetention.description")}
          </p>
        </div>
      </div>
      <div className="flex mb-2">
        <div className="flex space-x-4 items-center mr-2">
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            type="search"
            placeholder={t("settings.consentSetting.dataRetention.search")}
            minWidth="20rem"
          ></Input>
        </div>
        <div className="w-2/12">
          <Dropdown
            id="selectedStatus"
            title=""
            className="w-full"
            selectedName={selectedStatusName}
            disabled={false}
            isError={false}
            minWidth="10rem"
            customeHeight={true}
            customeHeightValue="140px"
            // optionHeight="h-[8rem]"
          >
            {stdStatus.map((item) => (
              <DropdownOption
                selected={selectedStatus === item.value}
                onClick={() => {
                  searchConditionRef.current.status = item.value;
                  setSelectedStatusName(item.value);
                  let limit = 10;
                  getDataList(limit);
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
        <div className="w-2/12 flex my-auto mx-0"></div>
        <div className="w-6/12 flex justify-end">
          {/* <Link to="/setting/consent-setting/scheduled-items">
            <Button className="rounded mx-1 bg-white py-2 px-4 text-xs text-blue-500 border border-1 border-blue-500 text-blue hover:shadow-lg font-bold" >
              {t("settings.consentSetting.dataRetention.viewScheduledItems")}
            </Button>
          </Link>  */}
          <Button
            className="rounded mx-1 bg-white py-2 px-4 text-xs text-blue-500 border border-1 border-blue-500 text-blue font-semibold"
            onClick={() => navigate(`/setting/consent-setting/data-retention/retention-activities-logs`)}
          >
            <span className="m-auto text-base">
              {t(
                "settings.consentSetting.dataRetention.retentionActivitiesLogs"
              )}
            </span>
          </Button>

          <Menu>
            <MenuButton className="flex rounded ml-1 bg-[#3758F9] py-2 px-4 text-xs text-white hover:#163AEB font-semibold pt-3">
              <p className="text-white m-auto  text-base">
                {t(
                  "settings.consentSetting.dataRetention.createRetentionPolicy"
                )}
              </p>
              {/* <span className="text-white text-sm font-bold ">
                {t("settings.consentSetting.dataRetention.createRetentionPolicy")}
              </span> */}
              <BsThreeDotsVertical className="text-lg " />
            </MenuButton>

            <MenuItems className="absolute right-[80px] top-[360px] mt-2 w-[270px] origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-[9999]">
              <div className="py-1">
                <MenuItem>
                  <Button
                    className="text-sm p-2 px-5 border-b w-full text-left h-[42px]"
                    onClick={toggleMenuSubjectRetention}
                  >
                    {" "}
                    {t(
                      "settings.consentSetting.dataRetention.dataSubjectRetention"
                    )}
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    className="text-sm p-2 px-5 h-[42px]"
                    onClick={toggleMenuSubjectReceiptRetention}
                  >
                    {" "}
                    {t(
                      "settings.consentSetting.dataRetention.dataReceiptRetention"
                    )}
                  </Button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
      {/* <Table  columns={columns} data={data}    pagination={1} /> */}
      <Table
        columns={columns}
        data={data.data || []}
        pagination={data.pagination}
        handlePageChange={handlePageChange}
        loading={loading}
      />

      {/* OPEN DRAWER AND BACKGROUP OPACITY */}      
      {isOpenSubJectRetention && (
        <div
          className="fixed z-[12] inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={toggleMenuSubjectRetention}
        ></div>
      )}
  
        <SubjectRetention
          isOpenSubJectRetention={isOpenSubJectRetention}
          toggleMenuSubjectRetention={toggleMenuSubjectRetention}
          isEdit={isEdit}
          isView={isView}
          policyId={policyId}
          refreshData={refreshData}
        />
     

      {isOpenSubJectReceiptRetention && (
        <div
          className="fixed z-[12] inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={toggleMenuSubjectReceiptRetention}
        ></div>
      )}

      <SubjectReceiptRetention
        isOpenSubJectReceiptRetention={isOpenSubJectReceiptRetention}
        toggleMenuSubjectReceiptRetention={toggleMenuSubjectReceiptRetention}
        isEdit={isEdit}
        isView={isView}
        policyId={policyId}
        refreshData={refreshData}
      />
    </div>
  );
};
export default DataRetention;
