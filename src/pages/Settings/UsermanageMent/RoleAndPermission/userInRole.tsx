import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { InputText,Button,MoreButton,Dropdown,DropdownOption } from "../../../../components/CustomComponent";
import { FaSearch } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import customStyles from "../../../../utils/styleForReactSelect";
import Select from "react-select";

import Table from "../../../../components/Table";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserInRolePermission,
} from "../../../../services/rolePermissionService";
import {  useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../../store";
import { formatDate } from "../../../../utils/Utils";
import { useTranslation } from "react-i18next";
import {
  setOpenLoadingFalse
} from "../../../../store/slices/loadingSlice";
import imgProfile from "../../../../assets/images/imgProfile.jpg";

import debounce from "lodash.debounce";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";

const UserInRole = () => {
  const location = useLocation();
  const {  rolePermissionId, roleName } = location.state || {};
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { t } = useTranslation();


  const [data, setData] = useState({
    data: [],
    pagination: { page: 1, per_page: 20, total_pages: 1, total_items: 1 },
  });
  const dispatch = useDispatch();


  const [loading, setLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState({ value: "all", label: t("roleAndPermission.statusall") });
  const searchConditionRef = useRef({
    searchTerm: "",
    status: "all",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "",
  });

  const columns = useMemo(
    () => [
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("roleAndPermission.AccountName")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("Name")}
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
        accessor: "name",
        Cell: ({ value, row }: { value: string; row: any }) => {
          return (
            <div className="flex">
              <div className="my-auto mx-0">
                <img className="w-[30px] h-[30px] rounded-full object-cover m-auto" src={row.original.profileImageBase64 != "" ? row.original.profileImageBase64  : imgProfile}/>
                </div>
              <div className="pl-3">
                <p className="font-semibold">{value}</p>
                <p className=" text-sm">{row.original.jobTitle}</p>
              </div>
            </div>
          );
        },
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("roleAndPermission.organization")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("organizationName")}
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

        accessor: "organizationName",
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("roleAndPermission.Email")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("Email")}
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
        accessor: "email",
      },
      {
        Header: (
          <>
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="w-1/12"></div>
                <div className="w-10/12 text-center">
                  {t("roleAndPermission.UserType")}
                </div>
                <div className="w-1/12">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 cursor-pointer"
                    style={{ marginLeft: "auto" }}
                    onClick={() => handleSort("AccountType")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                    />
                  </svg>
                </div>
              </div>
            </>
          </>
        ),
        // t("roleAndPermission.user"),
        accessor: "accountType",
        Cell: ({ value }: { value: string}) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              {value}
            </div>
          );
        },
      },

      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("roleAndPermission.Status")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("IsActiveStatus")}
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
        Cell: ({ value }) => {
           return <p className={value ? "font-normal bg-[#eff7f1]  p-1 rounded-md w-[70px] text-center text-[#157535]" : "border border-[#D8DCD9] text-center p-1 rounded-md"}>
            {value ? t('userManagement.active') : t('userManagement.inactive')}
          </p>
        }
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
              <div className="w-1/12"></div>
              <div className="w-10/12 text-center">
                {t("roleAndPermission.ExpirationDate")}
              </div>
              <div className="w-1/12">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 cursor-pointer"
                  style={{ marginLeft: "auto" }}
                  onClick={() => handleSort("ExpirationDate")}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </div>
            </div>
          </>
        ),
        // Header: t("roleAndPermission.createdDate"),
        accessor: "expirationDate",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
        // Cell: ({ value }) => {
        //   <div>{value.modifiedDate}</div>
        // }
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
              <div className="w-1/12"></div>
              <div className="w-10/12 text-center">
                {t("roleAndPermission.LastLoginDate")}
              </div>
              <div className="w-1/12">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 cursor-pointer"
                  style={{ marginLeft: "auto" }}
                  onClick={() => handleSort("LastLoginDate")}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </div>
            </div>
          </>
        ),
        accessor: "lastLoginDate",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },
    ],
    [ t]
  );
  // --------------- FUNCTION -----------------

  const handleSort = (column:any) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;
    let limit = 20;
    handleGetRoleAndPermission(limit);
  };
  useEffect(() => {
    let limit = 20;

    // dispatch(setOpenLoadingTrue());
    handleGetRoleAndPermission(limit);
  }, []);

  const handleGetRoleAndPermission = async (limit: number) => {
    try {
      setLoading(true);

      const response: any = await getUserInRolePermission(
        searchConditionRef.current,
        rolePermissionId
      );

      setData({
        data: response.data.data.map((data: any) => {
          return {
            name: data.name,
            jobTitle: data.jobTitle,
            organizationName: data.organizationName,
            email: data.email,
            accountType: data.accountType,
            isActiveStatus:
              data.isActiveStatus === true
                ? t("roleAndPermission.active")
                : t("roleAndPermission.inactive"),
            expirationDate: formatDate("datetime", data.expirationDate),
            lastLoginDate: formatDate("datetime", data.lastLoginDate),
            profileImageBase64: data.profileImageBase64,
          };
        }),
        pagination: response.data.pagination,
      });
      setLoading(false);
      dispatch(setOpenLoadingFalse());
    } catch (error) {
      setLoading(false);
      dispatch(setOpenLoadingFalse());
      console.error("error", error);
    }
  };

  const handlePageChange = (page: number) => {
    let limit = 20;
    searchConditionRef.current.page = page;
    handleGetRoleAndPermission(limit);
  };

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 20;
      searchConditionRef.current.searchTerm = searchTerm;

      handleGetRoleAndPermission(limit);
    }, 300), // 300ms delay
    []
  );
  const handleCancel = () => {
    confirm({
      title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      notify: false, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
      modalType: ModalType.Cancel, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        navigate("/setting/user-management/role-permission");
      }, //จำเป็น
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };

  const optionsStatus=[
    { value: "all", label: t("roleAndPermission.statusall") },
    { value: "active", label: t("roleAndPermission.active") },
    { value: "inactive", label: t("roleAndPermission.inactive") },
  ]

  return (
    <div className="bg-[#fff] px-12 py-5">
      <div className="flex pb-2  ">
        <div className="w-9/12">
          <h2 className="text-lg font-semibold">{roleName}</h2>
        </div>
      </div>
      <div className="flex">
        <div className="w-2/12 relative w-auto  my-auto mx-0">
          <div className="absolute inset-y-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
          {/* <input
            type="text"
            className="pl-10 pr-4 py-1 text-black text-sm w-48 h-[30px] border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("roleAndPermission.search")}
            // value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          /> */}
           <InputText
                        type="search"
                        placeholder={t("roleAndPermission.search")}
                        minWidth="20rem"
                        height="2.625rem"
                        // className=" mt-2"
                        onChange={(e) => handleSearch(e.target.value)}
                      ></InputText>
        </div>
        <div className="w-2/12 my-auto mx-1">
          {/* <Select
            className="text-sm"
            styles={customStyles}
            onChange={(selectedOption: any) => {
              searchConditionRef.current.status = selectedOption.value;
              let limit = 20;
              handleGetRoleAndPermission(limit);
            }}
            options={[
              { value: "all", label: t("roleAndPermission.statusall") },
              { value: "active", label: t("roleAndPermission.active") },
              { value: "inactive", label: t("roleAndPermission.inactive") },
            ]}
            placeholder={t("roleAndPermission.statusall")}
          /> */}
           <Dropdown
                  id="selectStatusRoleList"
                  title=""
                  className="w-full  text-base"
            
                  selectedName={(selectStatus.label)}
                
              >
                  {optionsStatus.map((item) => (
                      <DropdownOption
                          className="h-[2.625rem] text-base"
                          onClick={() => {
                            setSelectStatus(item)
                            searchConditionRef.current.status = item.value;
                            let limit = 20;
                            handleGetRoleAndPermission(limit);
                          }}
                          key={item.value}
                      >
                          <span>{item.label}</span>
                      </DropdownOption>
                  ))}
              </Dropdown>
        </div>
        <div className="w-2/12 flex my-auto mx-0">
          {/* <HiArrowsUpDown className="text-gray-500 text-2xl mx-2 cursor-pointer" onClick={handleSort} /> */}
          <IoFilterOutline className="text-gray-500 text-2xl mx-2 cursor-pointer" />
        </div>
        <div className="w-7/12 flex justify-end">
          <Button
            onClick={handleCancel}
            className="flex rounded border border-[#E2E8F0] ml-1 py-2 px-4"
          >
            <p className="m-auto  font-semibold">{t("roleAndPermission.cancel")}</p>
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        data={data.data || []}
        pagination={data.pagination}
        handlePageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};
export default UserInRole;
