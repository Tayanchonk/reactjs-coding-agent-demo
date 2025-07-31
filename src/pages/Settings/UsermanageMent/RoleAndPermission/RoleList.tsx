import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
// import { Button } from "@headlessui/react";
import { FaSearch } from "react-icons/fa";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import customStyles from "../../../../utils/styleForReactSelect";
import Select, { StylesConfig } from "react-select";
import Table from "../../../../components/Table";
import { useSelector, useDispatch } from "react-redux";
import {
  InputText,
  Button,
  MoreButton,
  Dropdown,
  DropdownOption,
} from "../../../../components/CustomComponent";
import {
  getrolePermission,
  delRolePermission,
} from "../../../../services/rolePermissionService";
import { rolePermission } from "../RoleAndPermission/interface";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
// import { ModalType } from "../../../../enum/ModalType";
import { RootState } from "../../../../store";
import { extractOrgs, formatDate } from "../../../../utils/Utils";
import { useTranslation } from "react-i18next";
import {
  setOpenLoadingFalse,
  setOpenLoadingTrue,
} from "../../../../store/slices/loadingSlice";
import imgProfile from "../../../../assets/images/imgProfile.jpg";

import debounce from "lodash.debounce";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import { getOrganizationChart } from "../../../../services/organizationService";

const RoleList = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );

  const [data, setData] = useState({
    data: [],
    pagination: { page: 1, per_page: 20, total_pages: 1, total_items: 1 },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const [arrOrgToFilterByGlobal, setArrOrgToFilterByGlobal] = useState([]);

  // for modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() =>
    Promise.resolve()
  );

  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );

  const [copyRoleId, setCopyRoleId] = useState("");
  const [openModalCopy, setOpenModalCopy] = useState(false);
  const [copyRoleName, setCopyRoleName] = useState("");
  const [copyDescription, setCopyDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectStatus, setSelectStatus] = useState({
    value: "all",
    label: t("roleAndPermission.statusall"),
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

  const columns = useMemo(
    () => [
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("roleAndPermission.roleName")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("rolePermissionName")}
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
        accessor: "rolePermissionName",
        Cell: ({ value, row }: { value: string; row: any }) => {
          return (
            <Link
              to="/setting/user-management/role-permission/role-permissions"
              className="text-[#3758F9] font-semibold text-base"
              state={{
                status: "view",
                rolePermissionId: row.original.rolePermissionId,
              }}
            >
              {value}
            </Link>
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
                onClick={() => handleSort("organizationId")}
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
              {t("roleAndPermission.descriptionInput")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
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
      },
      {
        Header: (
          <>
            <div style={{ justifyContent: "center", textAlign: "center" }}>
              {t("roleAndPermission.user")}
            </div>
          </>
        ),
        // t("roleAndPermission.user"),
        accessor: "users",
        Cell: ({ value, row }: { value: string; row: any }) => {
          const maxImages = 2;
          const displayedUsers = value.slice(0, maxImages);
          const remainingUsers = value.length - maxImages;
          return (
            <Link
              //${}
              to={`/setting/user-management/role-permission/user-in-role`}
              state={{
                statusRole: "view",
                rolePermissionId: row.original.rolePermissionId,
                roleName: row.original.rolePermissionName,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                }}
              >
                {displayedUsers.map((user, index) => (
                  <img
                    key={index}
                    src={
                      user.userProfileImageBase64 === ""
                        ? imgProfile
                        : user.userProfileImageBase64
                    } // สมมติว่ามี property profilePicture ใน user object
                    alt={user.name} // สมมติว่ามี property name ใน user object
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "5px",
                      marginLeft: "-15px",
                      border: "2px solid #e6e2e2",
                    }}
                  />
                ))}
                {remainingUsers > 0 && (
                  <div
                    style={{
                      marginLeft: "-15px",
                      width: 30,
                      height: 30,
                      background: "#3758F9",
                      borderRadius: "50%",
                      paddingTop: 1,
                      paddingLeft: remainingUsers > 9 ? 2 : 6,
                      border: "2px solid #e6e2e2",
                    }}
                  >
                    <span className="text-white text-xs">
                      +{remainingUsers}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        },
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
                style={{ marginLeft: "auto" }}
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
        // Header: t("roleAndPermission.createdBy"),
        accessor: "modifiedBy",
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
                {t("roleAndPermission.modifiedDate")}
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
                  onClick={() => handleSort("modifiedDate")}
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
        accessor: "modifiedDate",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
        // Cell: ({ value }) => {
        //   <div>{value.modifiedDate}</div>
        // }
      },
      // {
      //   Header: '',
      //   accessor: 'actions',
      //   Cell: () => <BsThreeDotsVertical className='cursor-pointer' />,
      // },
      {
        Header: "",
        accessor: "rolePermissionId",
        Cell: ({ value }: { value: string }) => (
          <div className="relative">
            {permissionPage.isRead === true &&
            permissionPage.isUpdate === false &&
            permissionPage.isDelete === false &&
            permissionPage.isCreate === false ? null : (
              <BsThreeDotsVertical
                className="cursor-pointer"
                onClick={() =>
                  setExpandedRow(expandedRow === value ? null : value)
                }
              />
            )}

            {expandedRow === value && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50"
              >
                <ul>
                  {permissionPage?.isUpdate && (
                    <Link
                      to="/setting/user-management/role-permission/role-permissions"
                      state={{ status: "edit", rolePermissionId: value }}
                    >
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex"
                        onClick={() => setExpandedRow(null)}
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

                        <p className="pt-1.5 pl-2 font-normal">
                          {t("roleAndPermission.edit")}
                        </p>
                      </li>
                    </Link>
                  )}

                  {permissionPage?.isCreate && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                      onClick={() => {
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
                      <p
                        className="pt-1.5 pl-2 font-normal pointer"
                        // onClick={() => {
                        //   showCfCopy(value);
                        // }}
                      >
                        {t("roleAndPermission.copy")}
                      </p>
                    </li>
                  )}
                  {permissionPage?.isDelete && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                      onClick={() => {
                        showDelAlert(value);
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
                </ul>
              </div>
            )}
          </div>
        ),
      },
    ],
    [expandedRow, t]
  );

  // --------------- FUNCTION -----------------

  const showDelAlert = async (rolePermissionId: string) => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        try {
          const res = await delRolePermission(rolePermissionId);
          if (res.data.isError === false) {
            let limit = 20;
            handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
            // getDataList();
          } else {
            throw new Error(res.data.message || "Unknown error");
          }
        } catch (error) {
          console.error("error", error);
          throw error; // ส่ง error ไปยัง ConfirmModal
        }
      },
      notify: true,
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };

  const showCfCopy = async (rolePermissionId: string) => {
    const getRoleNameAndDescription: any = data.data.find(
      (item: any) => item.rolePermissionId === rolePermissionId
    );
    setCopyRoleId(rolePermissionId);
    setCopyRoleName(getRoleNameAndDescription.rolePermissionName);
    setCopyDescription(getRoleNameAndDescription.description);
    setOpenModalCopy(true);
  };

  const handleCopyRole = async () => {
    setOpenModalCopy(false);
    navigate("/setting/user-management/role-permission/role-permissions", {
      state: {
        status: "copy",
        rolePermissionId: copyRoleId,
        copyRoleName: copyRoleName,
        copyDescription: copyDescription,
      },
    });
  };

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
      let limit = 20;
      handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
    }
  }, [arrOrgToFilterByGlobal]);

  const handleGetRoleAndPermission = async (limit: number, orgId: any[]) => {
    try {
      setLoading(true);

      getrolePermission(
        user.customer_id,
        limit,
        searchConditionRef.current,
        searchConditionRef.current.arrOrgToFilterByGlobal
      ).then((res: any) => {
        if (res.data.isError === false) {
          setData({
            data: res.data.data.map((data: rolePermission) => {
              return {
                rolePermissionId: data.rolePermissionId,
                rolePermissionName: data.rolePermissionName,
                organizationName: data.organization?.organizationName,
                users: data.users,
                description: data.description,
                modifiedBy: data.modifiedByName,
                modifiedDate: formatDate("datetime", data.modifiedDate),
                pagination: res.data.pagination,
              };
            }),
            pagination: res.data.pagination,
          });
          setLoading(false);
          dispatch(setOpenLoadingFalse());
        }
      });
    } catch (error) {
      setLoading(false);
      dispatch(setOpenLoadingFalse());
      console.error("error", error);
    }
  };

  const handlePageChange = (page: number) => {
    let limit = 20;
    let searchTerm = "";
    let pageSize = 5;
    searchConditionRef.current.page = page;
    // ?customerId=123e4567-e89b-12d3-a456-426614174000&page=1&pageSize=10&status=all
    handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
  };

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 20;
      searchConditionRef.current.searchTerm = searchTerm;
      handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
    }, 300), // 300ms delay
    [arrOrgToFilterByGlobal]
  );

  const handleSort = (column: any) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;
    let limit = 20;
    handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
  };

  const optionsStatus = [
    { value: "all", label: t("roleAndPermission.statusall") },
    { value: "active", label: t("roleAndPermission.active") },
    { value: "inactive", label: t("roleAndPermission.inactive") },
  ];

  return (
    <div className="  px-12 pl-1">
      <div className="flex pb-2  ">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold">
            {t("roleAndPermission.Role&Permission")}
          </h2>
          <p className="text-base">{t("roleAndPermission.descriptionList")}</p>
        </div>
      </div>
      <div className="flex">
        {/* <div className="absolute inset-y-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div> */}
        {/* <input
            type="text"
            className="pl-10 pr-4 py-1 text-black text-sm w-48 h-[42px] border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("roleAndPermission.search")}
            // value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          /> */}
        <InputText
          type="search"
          placeholder={t("roleAndPermission.search")}
          minWidth="20rem"
          height="2.625rem"
          className="text-base"
          onChange={(e) => handleSearch(e.target.value)}
        ></InputText>

        <div className="w-2/12 my-auto mx-1">
          <Dropdown
            id="selectStatusRoleList"
            title=""
            className="w-full text-base"
            selectedName={selectStatus.label}
            customeHeight={true}
            customeHeightValue="145px"
          >
            {optionsStatus.map((item) => (
              <DropdownOption
                className="h-[2.625rem] text-base"
                onClick={() => {
                  setSelectStatus(item);
                  searchConditionRef.current.status = item.value;
                  let limit = 20;
                  handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
                }}
                key={item.value}
              >
                <span className=" text-base">{item.label}</span>
              </DropdownOption>
            ))}
          </Dropdown>
        </div>
     
        <div className="w-6/12 flex justify-end">
          {permissionPage?.isCreate && (
            <Link
              to="/setting/user-management/role-permission/role-permissions"
              state={{ status: "create" }}
            >
              <Button className="flex rounded ml-1 bg-[#3758F9] py-2 px-4 text-xs text-white font-semibold">
                <IoAdd className="text-white text-lg mr-1 mt-1" />
                <p className="m-auto  text-base">
                  {t("roleAndPermission.createRole")}
                </p>
              </Button>
            </Link>
          )}
        </div>
      </div>
      {/* <Table columns={columns} data={data} /> */}

      <Table
        columns={columns}
        data={data.data || []}
        pagination={data.pagination}
        handlePageChange={handlePageChange}
        loading={loading}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={confirmTitle}
        modalType={confirmType}
        detail={confirmDetail}
        onConfirm={confirmAction}
        successMessage={confirmSuccessMessage}
        errorMessage={confirmErrorMessage}
      ></ConfirmModal>

      {/* modal copy */}
      {openModalCopy && (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 className="text-xl font-semibold ">
                  {t("roleAndPermission.copyarole")}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setOpenModalCopy(!openModalCopy)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed ">
                  {t("roleAndPermission.desccopyarole")}
                </p>
                <p className="font-semibold text-base">
                  <span className="text-red-500">* </span>
                  {t("roleAndPermission.roleName")}
                </p>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md dark:border-gray-600 text-base"
                  placeholder="Role name"
                  value={copyRoleName}
                  onChange={(e) => setCopyRoleName(e.target.value)}
                />
                <p className="font-semibold text-base">
                  <span className="text-red-500">* </span>{" "}
                  {t("roleAndPermission.descriptionInput")}
                </p>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md dark:border-gray-600 text-base"
                  placeholder="Description"
                  value={copyDescription}
                  onChange={(e) => setCopyDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                {/* <button
                  type="button"
                  onClick={() => setOpenModalCopy(!openModalCopy)}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  {t("roleAndPermission.cancel")}
                </button> */}

                <Button
                  className="rounded mx-1 bg-white py-2 px-4 text-base  border border-1 border-gray-200 text-blue font-medium"
                  onClick={() => setOpenModalCopy(!openModalCopy)}
                >
                  {t("roleAndPermission.cancel")}
                </Button>

                {/* <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => handleCopyRole()}
                >
                  {t("roleAndPermission.next")}
                </button> */}

                <Button
                  className=" rounded ml-1 bg-[#3758F9] py-2 px-4 text-base text-white font-semibold"
                  onClick={() => handleCopyRole()}
                >
                  {t("roleAndPermission.next")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RoleList;
