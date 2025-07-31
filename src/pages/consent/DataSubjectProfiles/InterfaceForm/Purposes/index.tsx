// generate Purposes component
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useConfirm, ModalType } from "../../../../../context/ConfirmContext";
import BlockIcon from "../../../../../assets/icons/block.svg";
import CancelIcon from "../../../../../assets/icons/cancel.svg";
import CheckIcon from "../../../../../assets/icons/check_circle.svg";
import DonotDistrurbIcon from "../../../../../assets/icons/do_not_disturb_off.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { Link, useParams } from "react-router-dom";
import {
  Dropdown,
  DropdownOption,
  InputText,
  Button,
} from "../../../../../components/CustomComponent";
import { getOrganizationChart } from "../../../../../services/organizationService";
import { extractOrgs, formatDate } from "../../../../../utils/Utils";
import {
  deletePurposeBySubjectId,
  getDataSubjectPurposeById,
} from "../../../../../services/dataSubjectProfileService";
import { debounce, last } from "lodash";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import ImgNotFound from "../../../../../assets/images/NoDataFound.png";
import { setDataSubjectPurpose } from "../../../../../store/slices/dataSubjectSlice";
import { useDispatch } from "react-redux";

const Purposes = () => {
  // ------------ CONFIG -------------
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const confirm = useConfirm();

  // ------------ GLOBAL STATE --------------
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );

  const dataSubject = useSelector((state: RootState) => state.dataSubject);

  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);
  // ------------ STATE --------------
  const [dataGroups, setDataGroups] = useState([
    {
      id: 1,
      name: t("dataSubjectProfile.purposes.Confirmed"),
      icon: CheckIcon,
      color: "#47BDBC",
      count: 0,
    },
    {
      id: 2,
      name: t("dataSubjectProfile.purposes.notGiven"),
      icon: BlockIcon,
      color: "#F6D448",
      count: 0,
    },

    {
      id: 3,
      name: t("dataSubjectProfile.purposes.withDrawn"),
      icon: CancelIcon,
      color: "#E60E00",
      count: 0,
    },

    {
      id: 5,
      name: t("dataSubjectProfile.purposes.expired"),
      icon: DonotDistrurbIcon,
      color: "#637381",
      count: 0,
    },
  ]);

  const optionStatus = [
    {
      value: "All",
      name: t("dataSubjectProfile.purposes.allStatus"),
    },
    {
      value: "CONFIRMED",
      name: t("dataSubjectProfile.purposes.Confirmed"),
    },
    {
      value: "NOT_GIVEN",
      name: t("dataSubjectProfile.purposes.notGiven"),
    },
    {
      value: "WITHDRAWN",
      name: t("dataSubjectProfile.purposes.withDrawn"),
    },
    {
      value: "EXPIRED",
      name: t("dataSubjectProfile.purposes.expired"),
    },
  ];

  const optionReceivedMode = [
    {
      value: "All",
      name: t("dataSubjectProfile.purposes.allReceivedMode"),
    },
    {
      value: "Production",
      name: t("dataSubjectProfile.purposes.Production"),
    },
    {
      value: "Test",
      name: t("dataSubjectProfile.purposes.Test"),
    },
  ];

  const { mode, id } = useParams();
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [selectedStatus, setSelectedStatus] = useState(optionStatus[0]);
  const [selectedReceivedMode, setSelectedReceivedMode] = useState({
    value: dataSubject.statusRetriveMode,
    name:
      dataSubject.statusRetriveMode === "All"
        ? t(`dataSubjectProfile.purposes.allReceivedMode`)
        : dataSubject.statusRetriveMode === "Production"
        ? t(`dataSubjectProfile.purposes.Production`)
        : t(`dataSubjectProfile.purposes.Test`),
  });
  const [loading, setLoading] = useState(false);
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1, 2, 3]); // for tab sidebar
  const [arrSelectedPurpose, setArrSelectedPurpose] = useState<string[]>([]); // for selected purpose
  const [arrOrgToFilterByGlobal, setArrOrgToFilterByGlobal] = useState("");
  const [data, setData] = useState<any>();

  // group data for summary purpose
  const [purposeSummary, setPurposeSummary] = useState<number>(0);
  const [firstTransactionSummary, setFirstTransactionSummary] =
    useState<string>("");

  const [lastTransactionSummary, setLastTransactionSummary] =
    useState<string>("");
  const [confirmedSummary, setConfirmedSummary] = useState<number>(0);
  const [notGivenSummary, setNotGivenSummary] = useState<number>(0);
  const [withDrawnSummary, setWithDrawnSummary] = useState<number>(0);
  const [expiredSummary, setExpiredSummary] = useState<number>(0);

  const searchConditionRef = useRef({
    searchTerm: "",
    arrOrgToFilterByGlobal: [],
    receivedMode: dataSubject.statusRetriveMode,
    status: "All",
  });

  // ------------ FUNCTION -------------
  const handleGetDataSubjectPurpose = async () => {
    setLoading(true);
    try {
      const response: any = await getDataSubjectPurposeById(
        id || "",
        searchConditionRef.current
      );

      setData(response);
      if (response?.data && Array.isArray(response.data)) {
        setOpenIndexes(
          Array.from({ length: response.data.length }, (_, i) => i)
        );
      } else {
        setOpenIndexes([]);
      }
      setDataGroups([
        {
          id: 1,
          name: t("dataSubjectProfile.purposes.Confirmed"),
          icon: CheckIcon,
          color: "#47BDBC",
          count: response?.summarizePurpose?.transactionCount?.CONFIRMED,
        },
        {
          id: 2,
          name: t("dataSubjectProfile.purposes.notGiven"),
          icon: BlockIcon,
          color: "#F6D448",
          count: response?.summarizePurpose?.transactionCount?.NOT_GIVEN,
        },

        {
          id: 3,
          name: t("dataSubjectProfile.purposes.withDrawn"),
          icon: CancelIcon,
          color: "#E60E00",
          count: response?.summarizePurpose?.transactionCount?.WITHDRAWN,
        },

        {
          id: 5,
          name: t("dataSubjectProfile.purposes.expired"),
          icon: DonotDistrurbIcon,
          color: "#637381",
          count: response?.summarizePurpose?.transactionCount?.EXPIRED,
        },
      ]);
    } catch (error) {
      console.error("Error fetching data subject profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index: number) => {
    if (openIndexes.includes(index)) {
      // ถ้า index นี้เปิดอยู่ ให้ปิด
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      // ถ้า index นี้ยังไม่เปิด ให้เพิ่มเข้าไป
      setOpenIndexes([...openIndexes, index]);
    }
  };
  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    if (isChecked) {
      // เพิ่ม id เข้าไปใน array
      setArrSelectedPurpose((prev: any) => [...prev, id]);
    } else {
      // ลบ id ออกจาก array
      setArrSelectedPurpose((prev) => prev.filter((item: any) => item !== id));
    }
  };

  const handleDeletePurpose = () => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        setLoading(true);
        await deletePurposeBySubjectId(
          id || "",
          user.customer_id,
          arrSelectedPurpose
        )
          .then((res: any) => {
            handleGetDataSubjectPurpose();
            setArrSelectedPurpose([]);
            setLoading(false);
          })
          .catch((error: any) => {
            console.error("Error deleting purpose:", error);
          });
      },
      notify: true,
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      searchConditionRef.current.searchTerm = searchTerm;
      handleGetDataSubjectPurpose();
    }, 300), // 300ms delay
    [arrOrgToFilterByGlobal]
  );

  // --------------- USE EFFECT ---------------
  useEffect(() => {
    setLoading(true);
    handleGetDataSubjectPurpose();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = {
  //       searchTerm: "",
  //       arrOrgToFilterByGlobal: [],
  //       receivedMode: dataSubject.statusRetriveMode,
  //       status: "All",
  //     };

  //     const response: any = await getDataSubjectPurposeById(id || "", data);
  //     setPurposeSummary(response?.summarizePurpose?.countPurpose);
  //     setFirstTransactionSummary(
  //       formatDate("datetime", response?.summarizePurpose?.firstTransaction)
  //     );
  //     setLastTransactionSummary(
  //       formatDate("datetime", response?.summarizePurpose?.lastTransaction)
  //     );
  //     setConfirmedSummary(
  //       response?.summarizePurpose?.transactionCount?.CONFIRMED
  //     );
  //     setNotGivenSummary(
  //       response?.summarizePurpose?.transactionCount?.NOT_GIVEN
  //     );
  //     setWithDrawnSummary(
  //       response?.summarizePurpose?.transactionCount?.WITHDRAWN
  //     );
  //     setExpiredSummary(response?.summarizePurpose?.transactionCount?.EXPIRED);
  //     handleGetDataSubjectPurpose();
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <div className="bg-white py-5 px-7">
        <h2 className="font-semibold text-xl">
          {t("dataSubjectProfile.purposes.title")}
        </h2>
        <div className="flex flex-wrap my-3">
          <div className="w-4/12 border rounded-md p-2 flex">
            <div className="w-6/12 m-2">
              <div className="m-auto bg-[#3758F9] h-full rounded-md text-white pt-5 pb-1">
                <p className="text-base text-center font-semibold">
                  {t("dataSubjectProfile.purposes.Purposes")}
                </p>
                <h1 className="text-center">
                  {data?.summarizePurpose?.countPurpose}
                </h1>
              </div>
            </div>
            <div className="w-6/12 m-2">
              <p className="font-semibold">
                {t("dataSubjectProfile.firstTransaction")}:
              </p>
              <p className="pt-1">
                {data?.summarizePurpose?.firstTransaction
                  ? formatDate(
                      "datetime",
                      data?.summarizePurpose?.firstTransaction
                    )
                  : "-"}
              </p>
              <p className="font-semibold pt-2">
                {t("dataSubjectProfile.lastTransaction")}:
              </p>
              <p className="pt-1">
                {data?.summarizePurpose?.lastTransaction
                  ? formatDate(
                      "datetime",
                      data?.summarizePurpose?.lastTransaction
                    )
                  : "-"}
              </p>
            </div>
          </div>
          <div className="w-8/12 flex">
            {dataGroups.map((item: any) => (
              <div
                key={item.id}
                className="w-3/12 border rounded-md px-1 py-2 flex mx-1"
              >
                <div
                  className="mr-4 w-[5px] h-full rounded-md"
                  style={{ backgroundColor: item.color }}
                >
                  {/* {item.icon} */}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-base">{item.name}</p>
                  <h1 className="text-[40px]">
                    {item.name === "Confirmed"
                      ? data?.summarizePurpose?.transactionCount?.CONFIRMED
                      : item.name === "Not Given"
                      ? data?.summarizePurpose?.transactionCount?.NOT_GIVEN
                      : item.name === "Withdrawn"
                      ? data?.summarizePurpose?.transactionCount?.WITHDRAWN
                      : item.name === "Expired"
                      ? data?.summarizePurpose?.transactionCount?.EXPIRED
                      : 0}
                  </h1>
                </div>

                <div className="ml-auto flex  pt-1.5 pr-1 items-start">
                  <img src={item.icon} alt={item.name} className="w-[24px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-5 px-7 mt-4">
        <h2 className="font-semibold text-xl">
          {t("dataSubjectProfile.purposes.PurposeSummary")}
        </h2>
        <p>{t("dataSubjectProfile.purposes.purposeSumaryDesc")}</p>
        <div className="flex mt-4 items-center w-full">
          <InputText
            type="search"
            minWidth={"320px"}
            placeholder={t("dataSubjectProfile.purposes.Search")}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Dropdown
            id="ddl-status"
            className="ml-2"
            selectedName={selectedStatus.name}
            customeHeight={true}
            customeHeightValue="230px"
          >
            {optionStatus.map((item: any, i: number) => (
              <DropdownOption
                className={`  ${
                  item.value === selectedStatus.value
                    ? "bg-[#3758F9] text-white"
                    : "bg-white"
                }`}
                key={i}
                selected={item.value}
                onClick={() => {
                  setSelectedStatus(item);
                  searchConditionRef.current.status = item.value;
                  handleGetDataSubjectPurpose();
                }}
              >
                {item.name}
              </DropdownOption>
            ))}
          </Dropdown>
          <Dropdown
            id="ddl-mode"
            className="ml-2"
            selectedName={selectedReceivedMode.name}
            customeHeight={true}
            customeHeightValue="140px"
          >
            {optionReceivedMode.map((item: any, i: number) => (
              <DropdownOption
                className={`  ${
                  item.value === selectedReceivedMode.value
                    ? "bg-[#3758F9] text-white"
                    : "bg-white"
                }`}
                key={i}
                selected={item.value}
                onClick={() => {
                  setSelectedReceivedMode(item);
                  searchConditionRef.current.receivedMode = item.value;
                  handleGetDataSubjectPurpose();
                  dispatch(setDataSubjectPurpose(item.value)); // Update the Redux state with the selected value
                }}
              >
                {item.name}
              </DropdownOption>
            ))}
          </Dropdown>

          {permissionPage.isDelete && arrSelectedPurpose.length > 0 && (
            <div className="flex ml-auto">
              <p className="text-[#E60E00] font-semibold text-base mr-3 m-auto">
                {t("dataSubjectProfile.selected")} {arrSelectedPurpose.length}{" "}
                {t("dataSubjectProfile.items")}
              </p>
              <Button
                className="text-white bg-[#E60E00]"
                onClick={() => handleDeletePurpose()}
              >
                {t("dataSubjectProfile.deletePurpose")}
              </Button>
            </div>
          )}
        </div>
        {data?.data?.length === 0 && (
          <div className="flex justify-center items-center h-full mt-10">
            <img src={ImgNotFound} alt="No Data Found" className="w-[200px]" />
          </div>
        )}
        {data?.data
          ?.slice()
          ?.sort((a: any, b: any) => {
            const dateA = a?.transactionDate?.lastDate
              ? new Date(a.transactionDate.lastDate)
              : new Date(0);
            const dateB = b?.transactionDate?.lastDate
              ? new Date(b.transactionDate.lastDate)
              : new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
          .map((item: any, index: number) => {
            return (
              <div className="mt-4" key={index}>
                <div
                  className={`border-l border-r border-t ${
                    !openIndexes.includes(index) && `border-b`
                  } rounded-t-md flex py-2 cursor-pointer header-accordion`}
                >
                  <div className="pl-5 my-auto text-base font-semibold  text-[#3758F9] ">
                    <input
                      type="checkbox"
                      className="rounded"
                      disabled={permissionPage.isUpdate ? false : true}
                      readOnly
                      onChange={(e) =>
                        handleCheckboxChange(
                          item.standardPurposeId,
                          e.target.checked
                        )
                      } // ตัวอย่าง id = 1
                    />
                  </div>
                  <div
                    className="flex item-center w-full"
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="w-9/12 pl-3 my-auto text-base font-semibold pr-6 text-[#3758F9] min-w-[300px] max-w-[1600px] whitespace-normal break-words break-all">
                      {item.standardPurposeName}
                    </div>
                    <div
                      className={`w-3/12 pl-5 text-base font-semibold  flex items-center justify-end mr-3`}
                    >
                      <p className="text-[#3758F9] bg-[#4361FF1A] px-3 py-1 rounded-md m-1">
                        {t("dataSubjectProfile.purposes.version")}{" "}
                        {item.standardPurposeVersion}
                      </p>
                      <div className="border-r pr-2">
                        <p
                          className=" bg-[#DAF8E6] px-3 py-1 rounded-md m-1  "
                          style={{
                            backgroundColor:
                              item?.lastTransaction?.transactionStatusName ===
                              "Confirmed"
                                ? "#DAF8E6"
                                : item?.lastTransaction
                                    ?.transactionStatusName === "Not Given"
                                ? "#FFFBEB"
                                : item?.lastTransaction
                                    ?.transactionStatusName === "Withdrawn"
                                ? "#FDE8E8"
                                : item?.lastTransaction
                                    ?.transactionStatusName === "Expired"
                                ? "gainsboro"
                                : "",
                            color:
                              item?.lastTransaction?.transactionStatusName ===
                              "Confirmed"
                                ? "#1A8245"
                                : item?.lastTransaction
                                    ?.transactionStatusName === "Not Given"
                                ? "#D97706"
                                : item?.lastTransaction
                                    ?.transactionStatusName === "Withdrawn"
                                ? "#e02424"
                                : item?.lastTransaction
                                    ?.transactionStatusName === "Expired"
                                ? "#637381"
                                : "",
                          }}
                        >
                          {item?.lastTransaction?.transactionStatusName}
                        </p>
                      </div>
                      <div className="pl-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-label="Expand"
                          className={`size-6 transform transition-transform ${
                            openIndexes.includes(index) ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* <div className="w-1/12 ml-1 flex items-center flex pr-5 justify-end">
                      
                    </div> */}
                  </div>
                </div>
                {openIndexes.includes(index) && (
                  <>
                    <div
                      className="bg-white flex mb-5 border rounded-b-md"
                      key={index}
                    >
                      <div className="w-6/12 border-r p-5">
                        <div>
                          <p className="text-base font-semibold">
                            {t("dataSubjectProfile.transactions")}:{" "}
                            <Link
                              className="pl-3 font-normal text-[#3758F9]"
                              to={`/consent/data-subject/${mode}/${id}/transactions`}
                              state={{
                                purposeName: item.standardPurposeName,
                                purposeId: item.standardPurposeId,
                              }}
                            >
                              {Object.values(
                                item?.transactionCount as Record<string, number>
                              ).reduce((acc, val) => acc + val, 0)}
                            </Link>
                          </p>
                          <div className="flex pt-3">
                            <div className="w-6/12 border-r ">
                              <div className="flex">
                                <div className="w-5/12">
                                  <p>
                                    {t("dataSubjectProfile.firstTransaction")}:{" "}
                                  </p>
                                </div>
                                <div className="w-7/12 m-auto">
                                  <p>
                                    {formatDate(
                                      "dateime",
                                      item?.transactionDate?.firstDate
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex pt-1">
                                <div className="w-5/12">
                                  <p>
                                    {t("dataSubjectProfile.lastTransaction")}:{" "}
                                  </p>
                                </div>
                                <div className="w-7/12 m-auto">
                                  <p>
                                    {formatDate(
                                      "dateime",
                                      item?.transactionDate?.lastDate
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex pt-1">
                                <div className="w-5/12">
                                  <p>
                                    {t(
                                      "dataSubjectProfile.purposes.ConsentDate"
                                    )}
                                    :{" "}
                                  </p>
                                </div>
                                <div className="w-7/12 m-auto">
                                  <p>
                                    {item?.transactionDate?.consentDate
                                      ? formatDate(
                                          "dateime",
                                          item?.transactionDate?.consentDate
                                        )
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="w-6/12 pl-4">
                              <div className="flex">
                                <div className="w-5/12">
                                  <p>
                                    {t(
                                      "dataSubjectProfile.purposes.expireDate"
                                    )}
                                    :{" "}
                                  </p>
                                </div>
                                <div className="w-7/12 m-auto">
                                  <p>
                                    {item?.transactionDate?.expireDate === null
                                      ? "-"
                                      : formatDate(
                                          "dateime",
                                          item?.transactionDate?.expireDate
                                        )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex pt-1">
                                <div className="w-5/12">
                                  <p>
                                    {t(
                                      "dataSubjectProfile.purposes.modifiedDate"
                                    )}
                                    :{" "}
                                  </p>
                                </div>
                                <div className="w-7/12 m-auto">
                                  <p>
                                    {item?.transactionDate?.modifiedDate ===
                                    null
                                      ? "-"
                                      : formatDate(
                                          "dateime",
                                          item?.transactionDate?.modifiedDate
                                        )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex pt-1">
                                <div className="w-5/12">
                                  <p>
                                    {t(
                                      "dataSubjectProfile.purposes.withDrawalDate"
                                    )}
                                    :{" "}
                                  </p>
                                </div>
                                <div className="w-7/12 m-auto">
                                  <p>
                                    {item?.transactionDate?.withdrawDate ===
                                    null
                                      ? "-"
                                      : formatDate(
                                          "dateime",
                                          item?.transactionDate?.withdrawDate
                                        )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-6/12 p-5">
                        <p className="text-base font-semibold">
                          {t("dataSubjectProfile.purposes.consent")}:
                        </p>
                        <div className="px-4 py-3 bg-[#F6F6F6] rounded-md w-full">
                          <div className="bg-white rounded-md py-2 px-3 w-full flex items-center whitespace-normal break-words break-all">
                            <input
                              type="checkbox"
                              className="mr-2 rounded"
                              checked={
                                item?.lastTransaction?.transactionStatusName ===
                                "Confirmed"
                                  ? true
                                  : false
                              }
                              style={{
                                backgroundColor:
                                  item?.lastTransaction
                                    ?.transactionStatusName === "Confirmed"
                                    ? "#656668"
                                    : "transparent",
                              }}
                              readOnly
                            />{" "}
                            {item.standardPurposeName}
                          </div>
                          {item?.lastTransaction?.preferencePurpose?.map(
                            (item: any, i: number) => {
                              return (
                                <div className="w-full" key={i}>
                                  <p className="pb-2 mt-3">
                                    {item?.preferencePurposeName}
                                  </p>

                                  <div className="bg-white rounded-md py-2 px-3 w-full">
                                    {item?.prefPurposeSelectionJson?.options?.map(
                                      (dataOption: any, index: number) => {
                                        return (
                                          <div
                                            className="flex items-center py-1"
                                            key={index}
                                          >
                                            <input
                                              type="checkbox"
                                              className="mr-2 rounded"
                                              checked={dataOption?.selected}
                                              style={{
                                                backgroundColor:
                                                  dataOption?.selected
                                                    ? "#656668"
                                                    : "transparent",
                                              }}
                                              readOnly
                                            />{" "}
                                            {dataOption?.text}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div></div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
      {loading && (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
};
export default Purposes;
