import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/CustomComponent";
import ModalFilter from "./ModalFilter";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import { RootState } from "../../../../store";
import { formatDate } from "../../../../utils/Utils";
import {
  deleteFilter,
  getFilterById,
  resetFilter,
  setAllFilterStatusSave,
} from "../../../../store/slices/filterReportDataSubjectSlice";
import ModalEditFilter from "./ModalEditFilter";
import { getConsentReportListViewsCreate } from "../../../../services/consentReportService";
const FilterDrawer = ({
  openFilterDrawer,
  setOpenFilterDrawer,
  status,
  org,
  onDataFetch, // รับ props onDataFetch
}: {
  openFilterDrawer: boolean;
  setOpenFilterDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  status: string;
  org: any[];
  onDataFetch?: (data: any) => void; // Optional callback for data fetching
}) => {
  // ------------------- GLOBAL STATE -------------------
  const { t } = useTranslation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = JSON.parse(getUserSession).customer_id;
  const filterReportDataSubject = useSelector(
    (state: any) => state.filterReportDataSubjectSlice.filterItem
  );
  const filterReportDataSubjectById = useSelector(
    (state: RootState) => state.filterReportDataSubjectSlice.filterById
  );

  // เพิ่ม state filterReportDataSubject

  // ------------------- STATE -------------------

  const [isVisible, setIsVisible] = useState(false);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalEditFilter, setOpenModalEditFilter] = useState(false);

  const mockupFilter = [
    {
      id: "1bb1faa8-ac88-4156-8a5e-2ee6411cbfba",
      name: "ConsentDate",
      type: "date",
      value: "19/05/2025 - 20/05/2025",
      operator: "Is Between",
    },
    {
      id: 2,
      name: "ExprireDate",
      type: "text",
      value: "Last 7 Days",
      operator: "Equal To",
    },
    {
      id: 3,
      name: "Standard Purposes",
      type: "text",
      value: "ขอความยินยอมให้ข้อมูลสุขภาพ",
      operator: "Equal To",
    },
    {
      id: 4,
      name: "Standard Purposes",
      type: "text",
      value: "ขอความยินยอมให้ข้อมูลสุขภาพ",
      operator: "Equal To",
    },
  ];
  // ------------------- FUNCTIONS -------------------
  const handleDeleteFilter = (filterId: string) => {
    confirm({
      title: t("roleAndPermission.confirmDelete"),
      detail: t("roleAndPermission.descriptionConfirmDelete"),
      modalType: ModalType.Delete,
      onConfirm: async () => {
        dispatch(deleteFilter(filterId));
        // Do not close the modal after deletion
      },
      notify: true,
      onClose: async () => {
        // Keep the modal open
        setOpenModalFilter(true);
      },
      successMessage: t("modal.success"),
      errorMessage: t("modal.error"),
    });
  };

  const clearAllFilter = () => {
    confirm({
      title: t("roleAndPermission.confirmDelete"),
      detail: t("roleAndPermission.descriptionConfirmDelete"),
      modalType: ModalType.Delete,
      onConfirm: async () => {
        dispatch(resetFilter());
      },
      notify: true,
      onClose: async () => {
        // Keep the modal open
        setOpenModalFilter(true);
      },
      successMessage: t("modal.success"),
      errorMessage: t("modal.error"),
    });
  };

  const handleCancel = () => {
    // ลบ filterItem ที่ status === 'draft'
    confirm({
      title: t("roleAndPermission.confirmCancel"),
      detail: t("roleAndPermission.descriptionConfirmCancel"),
      modalType: ModalType.Cancel,
      onConfirm: async () => {
        filterReportDataSubject.forEach((filter: any) => {
          if (filter.status === "draft") {
            dispatch(deleteFilter(filter.filterId));
          }
        });
        setOpenFilterDrawer(false);
      },
      notify: true,
      onClose: async () => {
        // Keep the modal open
        setOpenModalFilter(true);
      },
      successMessage: t("modal.success"),
      errorMessage: t("modal.error"),
    });
  };

  const handleSaveFilter = () => {
    confirm({
      title: t("roleAndPermission.confirmSave"),
      detail: t("roleAndPermission.descriptionConfirmSave"),
      modalType: ModalType.Save,
      onConfirm: async () => {
        // dispatch(setAllFilterStatusSave());
        // setOpenFilterDrawer(false);

        const dataToFilter = filterReportDataSubject.map((filter: any) => ({
          filterId: filter.filterId,
          id: filter.id,
          filterCode: filter.filterCode, // Optional field for filter code
          filterName: filter.filterName,
          filterType: filter.filterType,
          filterValue: JSON.stringify(filter.filterValue),
          operator: filter.operator,
          status: filter.status,
        }));
        handleDataFetch(org, customerId, true, 1, 20, dataToFilter);
        dispatch(setAllFilterStatusSave());
        setOpenFilterDrawer(false);

        // Call the onDataFetch callback if provided
      },
      notify: true,
      onClose: async () => {
        // Keep the modal open
        setOpenModalFilter(true);

        //  dispatch(resetFilter());
      },
      successMessage: t("modal.success"),
      errorMessage: t("modal.error"),
    });
  };

  const handleDataFetch = async (
    org: any[],
    customerId: string,
    isPage: boolean,
    page: number,
    pageSize: number,
    dataToFilter: any[]
  ) => {
    try {
      // Call the API to fetch data with the provided filters
      if (filterReportDataSubject.length) {
        await getConsentReportListViewsCreate(
          org,
          customerId,
          isPage,
          page,
          pageSize,
          dataToFilter
        ).then((res: any) => {
          if (res?.data?.isError === false) {
            //res?.data?.data
            if (onDataFetch) {
              onDataFetch(res?.data || []);
              setOpenFilterDrawer(false);
            }
          } else {
            console.error("Error fetching data:", res?.data?.message);
            if (onDataFetch) {
              onDataFetch(res?.data || []);
              setOpenFilterDrawer(false);
            }
          }
        });
      } else {
        if (onDataFetch) {
          onDataFetch([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (onDataFetch) {
        onDataFetch([]);
        setOpenFilterDrawer(false);
      }
    }
  };

  // ------------------- USEEFFECTS -------------------

  useEffect(() => {
    if (openFilterDrawer) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      // Wait for transition before hiding
      const timeout = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timeout);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openFilterDrawer]);

  // Remove from DOM only when both are false
  if (!openFilterDrawer && !isVisible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          openFilterDrawer && isVisible ? "opacity-100" : "opacity-0"
        }`}
        // onClick={() => setOpenFilterDrawer(false)}
      />
      <div
        ref={drawerRef}
        className={`bg-white w-[490px] fixed h-[100vh] top-0 right-0 z-50 shadow-lg p-6 transform transition-transform duration-300 ease-in-out ${
          openFilterDrawer && isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex item-center">
          <h2 className="text-xl font-semibold">
            {t("reportDataSubjectProfileConsent.filter")}
          </h2>

          <button
            className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
            onClick={() => setOpenFilterDrawer(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-6 h-[30px] w-[30px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="pt-2">
          {t("reportDataSubjectProfileConsent.filterDesc")}
        </p>

        <div
          className={`${
            status === "view"
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          } mt-5 pt-2 flex justify-center mt-2 h-[50px] w-full py-2 border-2 border-dashed border-[#3758F9] text-[#3758F9] rounded bg-white hover:bg-blue-50`}
          onClick={() => {
            status === "view" ? null : 
            
            setOpenModalFilter(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
            />
          </svg>

          <p className="pl-2  font-semibold text-lg">
            {t("reportDataSubjectProfileConsent.addFilter")}
          </p>
        </div>
        {/* CONTENT */}
        <div
          className="py-3 overflow-auto"
          style={{ height: "calc(100vh - 280px)" }}
        >
          {filterReportDataSubject.length
            ? filterReportDataSubject?.map((filter: any) => (
                <div
                  key={filter.id}
                  className={`relative flex flex-col space-y-4 mt-4 rounded-md border border-gray-200 p-4 hover:bg-blue-50 ${
                    status === "view" ? "" : "cursor-pointer"
                  }`}
                     onClick={() => {
                        if (status === "view") return;
                        dispatch(getFilterById(filter.filterId));
                        setOpenModalEditFilter(true);
                      }}
                >
                  <div className="flex">
                    <p
                      className={`text-base font-semibold  ${
                        status === "view" ? "" : "cursor-pointer"
                      }`}
                   
                    >
                      {t(
                        `reportDataSubjectProfileConsent.${filter.filterName}`
                      )}
                    </p>
                    <p className="text-base text-[#3758F9] pl-2">
                      {t(`reportDataSubjectProfileConsent.${filter.operator}`)}
                    </p>
                  </div>
                  <div style={{ marginTop: 10, marginRight: 25 }}>
                    {(filter.operator === "Equal To" ||
                      filter.operator === "Not Equal To") &&
                      filter.filterType !== "UUID" &&
                      filter.filterType !== "Integer" &&
                      filter.filterValue.map((value: any, index: number) => (
                        <div
                          key={index}
                          className="text-sm py-2 px-2 rounded rounded-md border my-2 bg-[#e1effe] text-[#1c64f2]"
                        >
                          {value.label}
                        </div>
                      ))}

                    {(filter.operator === "Equal To" ||
                      filter.operator === "Not Equal To") &&
                      filter.filterType === "UUID" && (
                        <div>{filter.filterValue}</div>
                      )}
                    {(filter.operator === "Equal To" ||
                      filter.operator === "Not Equal To") &&
                      filter.filterType === "Integer" && (
                        <div>{filter.filterValue}</div>
                      )}
                    {filter.operator === "Between" &&
                      filter.filterType !== "Integer" && (
                        <div>
                          {formatDate("date", filter.filterValue[0])} -{" "}
                          {formatDate("date", filter.filterValue[1])}
                        </div>
                      )}
                    {filter.operator === "Between" &&
                      filter.filterType === "Integer" && (
                        <div>
                          {filter?.filterValue?.value1} -{" "}
                          {filter?.filterValue?.value2}
                        </div>
                      )}
                    {filter.operator === "Relative" && (
                      <div>{t(
                        `reportDataSubjectProfileConsent.${filter.filterValue.name}`
                      )}</div>
                    )}
                  </div>
                  {status !== "view" && (
                    <div className="absolute bottom-5 right-1 mt-2 mr-2 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="red"
                        className="size-5"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating to parent div
                          handleDeleteFilter(filter.filterId);
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))
            : null}
        </div>
        {/* FOOTER */}
        <div className=" absolute bottom-7 right-0 left-0 justify-center mx-10">
          {status !== "view" && (
            <h1
              className="text-center text-base text-[#3758F9] pb-2 cursor-pointer"
              onClick={() => {
                clearAllFilter();
              }}
            >
              {t("reportDataSubjectProfileConsent.clearAllFilters")}
            </h1>
          )}

          <div className="flex border-t border-gray-200 w-full flex justify-between pt-4">
            <Button
              className={`rounded mx-1 bg-white py-2 px-4 text-base ${
                status === "view" ? "w-full" : "w-[50%]"
              }  border border-1 border-gray-200 text-blue font-medium`}
              onClick={() => {
                status === "view" ? setOpenFilterDrawer(false) : handleCancel();
              }}
            >
              {t("reportDataSubjectProfileConsent.cancel")}
            </Button>
            {status !== "view" && (
              <Button
                className="rounded bg-[#3758F9] py-2 px-4 text-base w-[50%]  text-white font-semibold ml-2"
                onClick={() => handleSaveFilter()}
              >
                {t("reportDataSubjectProfileConsent.apply")}
              </Button>
            )}
          </div>
        </div>
      </div>
      {openModalFilter && (
        <ModalFilter
          openModalFilter={openModalFilter}
          setOpenModalFilter={setOpenModalFilter}
          org={org}
        />
      )}

      {openModalEditFilter && (
        <ModalEditFilter
          openModalEditFilter={openModalEditFilter}
          setOpenModalEditFilter={setOpenModalEditFilter}
          org={org}
        />
      )}
    </>
  );
};
export default FilterDrawer;
