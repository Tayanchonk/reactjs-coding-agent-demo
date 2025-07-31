import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { setMenuDescription } from "../../../store/slices/menuDescriptionSlice";
import { useDispatch } from "react-redux";
import { Button, InputText } from "../../../components/CustomComponent";
import Table from "../../../components/Table";
import { IoFilterOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import ModalDeleteDataSubject from "./Components/ModalDeleteDataSubject";
import {
  deleteDataSubjectProfiles,
  getDataSubjectProfilesList,
} from "../../../services/dataSubjectProfileService";
import { getConsentGeneral } from "../../../services/consentSettingService";
import { extractOrgs, formatDate } from "../../../utils/Utils";
import { getOrganizationChart } from "../../../services/organizationService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/index";
import { debounce } from "lodash";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useConfirm, ModalType } from "../../../context/ConfirmContext";
const DataSubjectProfiles = () => {
  //----------------CONFIGURATION-----------------
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const confirm = useConfirm();
  //---------------- GLOBAL STATE -----------------
  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const searchConditionRef = useRef({
    searchTerm: "",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "ModifiedDate",
    arrOrgToFilterByGlobal: [],
  });
  //---------------- STATE ------------------------
  const [dataSubjectId, setDataSubjectId] = useState<any[]>([]);
  const [data, setData] = useState({
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    },
  });

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteBtn, setOpenDeleteBtn] = useState(0);
  const [arrOrgToFilterByGlobal, setArrOrgToFilterByGlobal] = useState(""); // state for global filter org

  const [openModalDeleteDataSubject, setOpenModalDeleteDataSubject] =
    useState(false);
  const [enabledDeleteBtn, setEnabledDeleteBtn] = useState(true);

  const handleSelectAll = useCallback(
    (isChecked: boolean) => {
      if (data.data.length) {
        const updatedData = data.data.map((item: any) => ({
          ...item,
          isSelected: isChecked,
        }));
        setData((prev: any) => ({ ...prev, data: updatedData }));

        // ดึง dataSubjectId ทั้งหมดที่เลือก
        if (isChecked) {
          setDataSubjectId(updatedData.map((item: any) => item.dataSubjectId));
        } else {
          setDataSubjectId([]);
        }
      } else {
        console.warn("⚠️ No data in handleSelectAll");
      }
    },
    [data]
  );
  const isAllSelected =
    data.data.length > 0 && data.data.every((item: any) => item.isSelected);
  const columns = useMemo(
    () => [
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {permissionPage.isDelete && enabledDeleteBtn && (
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded-sm border-gray-300 text-blue-600"
                  style={{ marginRight: "8px" }}
                />
              )}
            </div>
          </>
        ),
        accessor: "selectAll",
        Cell: ({ row }: any) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {permissionPage.isDelete && enabledDeleteBtn && (
              <input
                type="checkbox"
                checked={row.original.isSelected || false}
                onChange={(e) =>
                  handleRowSelect(row.original, e.target.checked)
                }
                className="rounded-sm border-gray-300 text-blue-600"
              />
            )}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("dataSubjectProfile.profileIdentifier")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("ProfileIdentifier")}
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
        accessor: "profileIdentifier",
        Cell: ({ row }: any) => (
          <Link
            // /consent/data-subject-profiles/${mode}${id ? "/" + id : ""}/information
            to={`/consent/data-subject/view/${row.original.dataSubjectId}/information`}
            className="text-blue-500 hover:underline font-semibold no-underline"
            style={{ textDecoration: "none" }}
          >
            {row.original.profileIdentifier}
          </Link>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t("dataSubjectProfile.identifierType")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("IdentifierType")}
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
        accessor: "identifierType",
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">{value}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-center w-full gap-1">
              {t("dataSubjectProfile.receipts")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                onClick={() => handleSort("ReceiptCount")}
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
        accessor: "receiptCount",
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">{value}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-center w-full gap-1">
              {t("dataSubjectProfile.transactions")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                onClick={() => handleSort("TransactionCount")}
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
        accessor: "transactionCount",
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">{value}</div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-center w-full gap-1">
              {t("dataSubjectProfile.firstTransaction")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                onClick={() => handleSort("FirstTransactionDate")}
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
        accessor: "firstTransactionDate",
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {value}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-center w-full gap-1">
              {t("dataSubjectProfile.lastTransaction")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                onClick={() => handleSort("LastTransactionDate")}
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
        accessor: "lastTransactionDate",
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {value}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-center w-full gap-1">
              {t("dataSubjectProfile.createdDate")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                onClick={() => handleSort("CreatedDate")}
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
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {value}
          </div>
        ),
      },
      {
        Header: (
          <>
            <div className="flex items-center justify-center w-full gap-1">
              {t("dataSubjectProfile.modifiedDate")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                onClick={() => handleSort("ModifiedDate")}
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
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {value}
          </div>
        ),
      },
      {
        Header: <></>,
        accessor: "dataSubjectId",
        Cell: ({ value }: { value: string }) => (
          <div className="relative">
            {(enabledDeleteBtn && permissionPage.isDelete) &&
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
                className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50"
              >
                <ul>
                  {/* {permissionPage?.isUpdate && (
                    <Link
                      to={`/consent/data-subject/edit/${value}/information`}
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
                  )} */}

                  {enabledDeleteBtn && permissionPage?.isDelete && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex border-t border-1"
                      onClick={() => {
                        setOpenModalDeleteDataSubject(true);
                        setDataSubjectId([value]);
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
    [expandedRow, t, handleSelectAll]
  );
  //---------------- FUNCTION -----------------
  const handleSort = (column: string) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;

    handleGetDataSubjectProfilesList(arrOrgToFilterByGlobal);
  };

  const handleRowSelect = (row: any, isChecked: boolean) => {
    setData((prevData: any) => {
      const updatedData = prevData.data.map((item: any) =>
        item.dataSubjectId === row.dataSubjectId
          ? { ...item, isSelected: isChecked }
          : item
      );

      // ดึงเฉพาะ dataSubjectId ที่ isSelected: true
      const selectedIds = updatedData
        .filter((item: any) => item.isSelected)
        .map((item: any) => item.dataSubjectId);

      // อัปเดต state ของ dataSubjectId
      setDataSubjectId(selectedIds);

      return {
        ...prevData,
        data: updatedData,
      };
    });
  };
  const handlePageChange = (page: number) => {
    // let limit = 20;
    // let searchTerm = "";
    // let pageSize = 5;
    // searchConditionRef.current.page = page;
    // // ?customerId=123e4567-e89b-12d3-a456-426614174000&page=1&pageSize=10&status=all
    // handleGetRoleAndPermission(limit, arrOrgToFilterByGlobal);
  };

  const handleGetDataSubjectProfilesList = async (
    arrOrgToFilterByGlobal: any
  ) => {
    setLoading(true);
    const getSessionUser = sessionStorage.getItem("user");
    const customerId = getSessionUser
      ? JSON.parse(getSessionUser).customer_id : ''
    try {
      const response: any = await getDataSubjectProfilesList(

        customerId,
        arrOrgToFilterByGlobal,
        searchConditionRef.current
      );

      setData((prevData) => ({
        ...prevData,
        data: response.data.map((item: any) => ({
          ...item,
          createdDate: item.createdDate
            ? formatDate("datetime", item.createdDate)
            : "",
          modifiedDate: item.modifiedDate
            ? formatDate("datetime", item.modifiedDate)
            : "",
          firstTransactionDate: item.firstTransactionDate
            ? formatDate("datetime", item.firstTransactionDate)
            : "",
          lastTransactionDate: item.lastTransactionDate
            ? formatDate("datetime", item.lastTransactionDate)
            : "",
          isSelected: false, // กำหนดค่าเริ่มต้นเป็น false
        })),
        pagination: response.pagination,
      }));
    } catch (error) {
      console.error("Error fetching data subject profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 20;
      searchConditionRef.current.searchTerm = searchTerm;
      handleGetDataSubjectProfilesList(arrOrgToFilterByGlobal);
    }, 300), // 300ms delay
    [arrOrgToFilterByGlobal]
  );

  //---------------- USE EFFECT -----------------

  useEffect(() => {
    if (arrOrgToFilterByGlobal.length > 0) {
      handleGetDataSubjectProfilesList(arrOrgToFilterByGlobal);
    }
  }, [arrOrgToFilterByGlobal]);

  useEffect(() => {
    getConsentGeneral(user.customer_id).then((res: any) => {
      setEnabledDeleteBtn(res.data.enableDataSubjectsDeletion);
    });

  }, []);

  useEffect(() => {
    if (data.data.length > 0) {
      const checkIsSelected: any = data.data.filter((item: any) => {
        return item.isSelected === true;
      });
      if (checkIsSelected.length > 0) {
        setOpenDeleteBtn(checkIsSelected.length);
      } else {
        setOpenDeleteBtn(0);
      }
    }
  }, [data.data]);

  useEffect(() => {
    handleGetDataSubjectProfilesList(arrOrgToFilterByGlobal);
  }, []);

  const handleDelete = async (selectedOption: any) => {
    const dataToDelete = {
      deletedBy: user.user_account_id,
      delAll: selectedOption.delAll,
      dataSubjectIds: dataSubjectId,
    };
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        deleteDataSubjectProfiles(user.user_account_id, dataToDelete)
          .then(() => {
            handleGetDataSubjectProfilesList(arrOrgToFilterByGlobal); // Refresh data หลังจากลบสำเร็จ
            setOpenDeleteBtn(0); // รีเซ็ต openDeleteBtn
            // setEnabledDeleteBtn(false); // รีเซ็ต enabledDeleteBtn
            setOpenModalDeleteDataSubject(false); // ปิด Modal
          })
          .catch((error) => {
            console.error("Error deleting data subject profiles:", error);
          });
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });

    // try {
    //   await deleteDataSubjectProfiles(user.user_account_id, dataToDelete);
    //   console.log("Delete successful");
    //   handleGetDataSubjectProfilesList(arrOrgToFilterByGlobal); // Refresh data หลังจากลบสำเร็จ
    // } catch (error) {
    //   console.error("Error deleting data subject profiles:", error);
    // }
  };

  return (
    <div className="bg-white py-4 px-5">
      <div className="flex justify-between gap-2 items-center">
        <div className="px-2 flex items-center">
          <InputText
            onChange={(e) => handleSearch(e.target.value)}
            type="search"
            placeholder={t("interface.listview.input.search")}
            minWidth="20rem"
          ></InputText>
         
        </div>
        {permissionPage.isDelete && enabledDeleteBtn && openDeleteBtn > 0 && (
          <div className="justify-end">
            <span className="mr-3 font-semibold text-base text-[#E60E00]">
              {t("dataSubjectProfile.selected")} {openDeleteBtn}{" "}
              {t("dataSubjectProfile.items")}
            </span>
            <Button
              className="text-base px-4 py-2 border rounded-md text-white bg-[#E60E00]"
              onClick={() => setOpenModalDeleteDataSubject(true)}
            >
              {t("delete")}
            </Button>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        data={data?.data || []}
        pagination={data?.pagination}
        handlePageChange={handlePageChange}
        loading={loading}
      />

      <ModalDeleteDataSubject
        openModalDeleteDataSubject={openModalDeleteDataSubject}
        setOpenModalDeleteDataSubject={setOpenModalDeleteDataSubject}
        data={dataSubjectId}
        onDelete={handleDelete} // ส่งฟังก์ชัน handleDelete ไปยัง Modal
      />
    </div>
  );
};
export default DataSubjectProfiles;
