import {
  useState,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Tag from "../../../../../components/CustomComponent/Tag";
import Checkbox from "../../../../../components/CustomComponent/CheckBox";
import { deleteReceiptById, getReceiptDetail, getReceiptList } from "../../../../../services/receiptsService";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getConsentInterfaceByID } from "../../../../../services/consentInterfaceService";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import { Button } from "../../../../../components/CustomComponent";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import ConfirmModal from "../../../../../components/Modals/ConfirmModal";
import { useConfirm, ModalType } from "../../../../../context/ConfirmContext";
import { setMenuHeader } from "../../../../../store/slices/menuHeaderSlice";
import { setMenuBreadcrumb } from "../../../../../store/slices/menuBreadcrumbSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

interface SubPurpose {
  label?: string;
  checked?: boolean;
  pre_title?: string;
  items?: { label: string; checked: boolean }[];
}

interface StandardPurpose {
  title: string;
  standardPurposeId: string;
  checked: boolean;
  IsAnonymizePurpose?: boolean;
  pre_title?: string;
  subPurposes?: SubPurpose[];
}

interface Transaction {
  transactionId: string;
  status: "Confirmed" | "Pending";
  version: string;
  purposes: StandardPurpose[];
}

const ReceiptDetailPage = () => {
  const [openDataElements, setOpenDataElements] = useState(true);
  const [openTransactions, setOpenTransactions] = useState(true);
  const [openTransactionsIndexes, setOpenTransactionsIndexes] = useState<number[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<any>(null);
  const [receiptElement, setReceiptElement] = useState<any>(null);
  const [transactionElement, setTransactionElement] = useState<any>(null);

  const dateTimeStr = localStorage.getItem("datetime") || undefined;
  const [latestTransaction, setLatestTransaction] = useState<any>("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const confirm = useConfirm();
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Delete);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const hasDeletePermission = permissionPage?.isDelete ?? false;
  console.log("permissionPage", permissionPage);

  const dispatch = useDispatch();
  const getUserSession: any = sessionStorage.getItem("user");
  const userAccountId = JSON.parse(getUserSession);

  useEffect(() => {
    console.log("ReceiptDetailPage mounted");
    console.log("id", id);
    console.log("hasDeletePermission", hasDeletePermission);

    if (id) {
      handleGetReceiptsDetail(id);
    } else {
      console.error("ID is undefined");
      navigate("/NoPage", { replace: true });
    }
  }, []);

  useEffect(() => {
    dispatch(setMenuHeader("path.receiptsDetails"));
    dispatch(setMenuBreadcrumb([
      { title: t("path.consent"), url: "/consent" },
      { title: t("path.receipts"), url: "/consent/receipts" },
      { title: t("path.receiptsDetails"), url: "" },
    ]));
    return () => {
      dispatch(setMenuHeader(""));
      dispatch(setMenuBreadcrumb([]));
    };
  }, [t]);

  const mapElementsToObject = (elements: any[]) => {
    return elements.reduce((acc: Record<string, string>, curr) => {
      const value = curr.value;

      if (
        value &&
        typeof value === "object" &&
        Array.isArray(value.options)
      ) {
        const selectedOptions = value.options
          .filter((opt: any) => opt.selected)
          .map((opt: any) => opt.text);
        acc[curr.name] = selectedOptions.join(", ") || "-";
      }

      else if (typeof value === "string" && value.length > 6 && !isNaN(Date.parse(value))) {
        acc[curr.name] = formatThaiDate(value);
      }

      else {
        acc[curr.name] = String(value ?? "-");
      }

      return acc;
    }, {});
  };

  const toggleTransaction = (index: number) => {
    setOpenTransactionsIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleGetReceiptsDetail = async (Id: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getReceiptDetail(Id);
      console.log("response", response);
      let interfaceName = "";
      if (response.interfaceId) {
        interfaceName = await handleGetInterface(response.interfaceId);
      }
      response.interfaceName = interfaceName;
      setReceipt(response);
      const receiptElement = mapElementsToObject(response.dataElementJson?.elements || []);


      setReceiptElement(receiptElement);
      console.log('receiptElement', receiptElement);
      //check if dataSubjectTransactions is an array and has elements
      if (response.dataSubjectTransactions && response.dataSubjectTransactions.length > 0) {
        const latestTransaction = getLatestTransaction(response.dataSubjectTransactions);
        setLatestTransaction(latestTransaction);
      }

      let transactionElement: any[] = [];


      if (Array.isArray(response.dataSubjectTransactions)) {
        transactionElement = response.dataSubjectTransactions.map((item: any) => {
          const transaction = item.transaction?.[0];

          return {
            transactionId: item.transactionId,
            status: transaction?.transactionStatusName || "Unknown",
            version: transaction?.standardPurposeVersion || "-",
            purposes: (transaction?.preferencePurposeTransaction?.length
              ? Object.values(
                transaction.preferencePurposeTransaction.reduce(
                  (acc: any, pref: any) => {
                    const key = transaction?.standardPurposeId || "-";
                    if (!acc[key]) {
                      acc[key] = {
                        title: transaction?.standardPurposeName || "-",
                        checked: transaction?.transactionStatusName === "Confirmed",
                        standardPurposeId: key,
                        IsAnonymizePurpose: transaction?.isAnonymizePurpose,
                        subPurposes: [],
                      };
                    }
                    acc[key].subPurposes.push({
                      pre_title: pref?.preferencePurposeName || "-",
                      items:
                        pref?.prefPurposeSelectionJson?.options?.map((opt: any) => ({
                          label: opt.Text || opt.text || "-",
                          checked: !!(opt.Selected ?? opt.selected),
                        })) || [],
                    });
                    return acc;
                  },
                  {}
                )
              )
              : [
                {
                  title: transaction?.standardPurposeName || "-",
                  checked: transaction?.transactionStatusName === "Confirmed",
                  IsAnonymizePurpose: transaction?.isAnonymizePurpose,
                  standardPurposeId: transaction?.standardPurposeId || "-",
                  subPurposes: [],
                },
              ]),
          };
        });
      }

      console.log("transactionElement", transactionElement);


      setTransactionElement(transactionElement);
      if (transactionElement.length > 0) {
        setOpenTransactionsIndexes(transactionElement.map((_: any, index: number) => index));
      }
      console.log("transactionElement", transactionElement);
      console.log("receipt?.isTestMode", receipt?.isTestMode);


      setLoading(false);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      navigate("/consent/receipts", { replace: true });
    }
  };


  const handleGetInterface = async (interfaceId: string) => {

    try {
      const response = await getConsentInterfaceByID(interfaceId);
      console.log("response", response);
      return response.interfaceName;
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }

  }

  function getLatestTransaction(dataSubjectTransactions: any[]) {
    if (!Array.isArray(dataSubjectTransactions) || dataSubjectTransactions.length === 0) {
      return null;
    }

    return dataSubjectTransactions.reduce((latest, current) => {
      const latestDate = new Date(latest.modifiedDate).getTime();
      const currentDate = new Date(current.modifiedDate).getTime();
      return currentDate > latestDate ? current : latest;
    });
  }

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Test":
        return "text-gray-600 bg-gray-200";
      case "Production":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-200";
    }
  };

  const getTransacStatusStyle = (status: string) => {
    switch (status) {
      case "Withdrawn": return "text-red-600 bg-red-100";
      case "Confirmed": return "text-green-700 bg-green-100";
      case "Not Given": return "text-yellow-500 bg-yellow-100";
      case "Expired": return "text-gray-600 bg-gray-200";
      default: return "text-gray-600 bg-gray-200";
    }
  };


  const formatDate = (dateString: string) => {
    let dateTimeString = "";
    if (dateTimeStr) {
      const dateTimeObj = JSON.parse(dateTimeStr);
      dateTimeString = dateTimeObj.dateFormat + " " + dateTimeObj.timeFormat;
    }
    //console.log(dateString);
    if (dateString === "-" || dateString === null) {
      return "-";
    }
    return dayjs(dateString).format(dateTimeString);
  };

  const formatThaiDate = (dateString: string) => {
    const date = dayjs(dateString);
    const buddhistYear = date.year() + 543;
    return `${date.date()}/${date.month() + 1}/${buddhistYear}`;
  };

  const handleDelete = async (receiptId: string) => {
    confirm({
      modalType: ModalType.Delete,
      onConfirm: async () => {
        try {
          const resp = await deleteReceiptById(receiptId, userAccountId.user_account_id);
          console.log("Deleted Success", resp);
          navigate(-1);
        } catch (error) {
          console.error("Deleted Failed:", error);
        }
      },
    });
  };

  function flattenObjectAllToString(obj: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
      const isNumericKeyedObject =
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).every(k => !isNaN(Number(k))) &&
        Object.values(value).every(v => v && typeof v === "object" && "text" in v && "checked" in v);

      if (isNumericKeyedObject) {
        result[key] = Object.values(value)
          .filter((v: any) => v.checked)
          .map((v: any) => v.text)
          .join(", ");
        continue;
      }

      if (
        Array.isArray(value) &&
        value.every(v => typeof v === "object" && "text" in v && "checked" in v)
      ) {
        result[key] = value
          .filter((v: any) => v.checked)
          .map((v: any) => v.text)
          .join(", ");
        continue;
      }

      result[key] = typeof value === "string" ? value : JSON.stringify(value);
    }

    return result;
  }

  return (
    <div className="p-1 bg-gray-50 min-h-screen flex flex-col space-y-1">
      <div className="flex justify-between items-center">
        <div className="absolute top-[120px] right-6 z-1 flex space-x-2 bg-white">
          <Button
            onClick={() => navigate(-1)}
            color="#DFE4EA"
            className=""
            variant="outlined"
          >
            <p className="text-base">{t("close")}</p>
          </Button>

          {hasDeletePermission && receipt?.isTestMode == "Test" ? (

            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="cursor-pointer h-[40px] w-[40px] flex items-center justify-center">
                <BsThreeDotsVertical />
              </MenuButton>
              <MenuItems className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <MenuItem>
                  <button
                    className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                    onClick={() => {
                      console.log("Delete receipt:", receipt?.receiptId);
                      handleDelete(receipt?.receiptId);
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
                    <span style={{ marginTop: "5px", color: "#000" }}>
                      Delete
                    </span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : ""
          }


        </div>
      </div>
      {loading && (
        <LoadingSpinner />
      )}
      {!loading && (
        <div className="p-1 bg-gray-50 min-h-screen flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Column */}
            <div className="w-full md:w-5/12 ">
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <div className="space-y-1">
                  <div className="text-base text-xl font-semibold text-gray-900">{t("dataSubjectReceipt.details.title")} </div>
                  <div className="text-base text-gray-500">{t("dataSubjectReceipt.details.desc")}</div>
                  <div className="">
                    <Tag
                      size="sm"
                      minHeight="1.625rem"
                      className={`px-2 rounded-md text-xs max-w-max mt-3 ${getStatusStyle(receipt?.isTestMode)}`}
                    >
                      <p className="text-base font-semibold">{receipt?.isTestMode}</p>
                    </Tag>
                  </div>
                </div>

                <div className="text-sm text-gray-800 mt-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div className="flex gap-2 mr-8">
                      <span className="text-base font-semibold">{t("dataSubjectReceipt.details.receiptDate")}:</span>
                      <span className="text-base">{formatDate(receipt?.createdDate)} </span>
                    </div>
                  </div>
                </div>

                <div className="-mx-6">
                  <hr className="my-4 border-gray-200 border-dashed" />
                </div>


                <div className="space-y-4 text-sm ">
                  <div>
                    <div className="text-base font-semibold text-gray-800">{t("dataSubjectReceipt.details.receiptId")}</div>
                    <span className="break-words text-base">
                      {receipt?.receiptId}
                    </span>
                  </div>

                  <div>
                    <div className="text-base font-semibold text-gray-800">{t("dataSubjectReceipt.details.profileIdentifier")}</div>
                    {(receipt.isAnonymizeDataElement === true || receipt?.dataSubject.isDeleted === true) ? <div className="text-base">{receipt?.dataSubject?.profileIdentifier}</div> :
                      <a href={"/consent/data-subject/view/" + receipt?.dataSubject?.dataSubjectId + "/information"} className="text-base text-blue-600 font-semibold">
                        {receipt?.dataSubject?.profileIdentifier}
                      </a>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-base font-semibold text-gray-800">{t("dataSubjectReceipt.details.interface")}</div>
                      <a
                        href={`/consent/consent-interface/view/${receipt?.interfaceId}/info`}
                        className="text-blue-600 font-semibold text-base"
                      >
                        {receipt?.interfaceName}
                      </a>
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                      <div className="text-base font-semibold text-gray-800">{t("dataSubjectReceipt.details.interfaceVersion")}</div>
                      <Tag
                        size="sm"
                        minHeight="1.25rem"
                        className="text-primary-blue font-medium px-2 py-0.5 rounded-md text-xs bg-blue-100 max-w-max px-2"
                      >
                        <p className="text-base font-semibold">
                          Version {receipt?.interfaceVersion}
                        </p>
                      </Tag>
                    </div>
                  </div>
                </div>

              </div>
            </div>


            {/* Right Column */}
            <div className="w-full md:w-7/12 flex flex-col gap-4">
              {/* Data Elements */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200 flex justify-between items-center p-4">
                  <div className="font-semibold text-black">
                    {t("dataSubjectReceipt.details.dataElement")}{" "}
                    <span className="text-base text-gray-500">
                      ({Object.keys(receiptElement || {}).length})
                    </span>
                  </div>

                  {/* ซ่อนปุ่มถ้าไม่มีข้อมูล */}
                  {Object.keys(receiptElement || {}).length > 0 && (
                    <button onClick={() => setOpenDataElements(!openDataElements)}>
                      {openDataElements ? (
                        <IoIosArrowUp className="text-gray-600 text-lg" />
                      ) : (
                        <IoIosArrowDown className="text-gray-600 text-lg" />
                      )}
                    </button>
                  )}
                </div>

                {Object.keys(receiptElement || {}).length > 0 && openDataElements && (
                  <div className="p-4 text-sm text-gray-800">
                    <div className="flex flex-wrap">
                      {Object.entries(receiptElement).map(([key, value], index, array) => {

                        const isArrayOfSelectableObjects = Array.isArray(value) &&
                          value.some((v) => v && typeof v === "object" && "text" in v && "checked" in v);

                        return (
                          <div
                            key={key}
                            className={`${index === array.length - 1 && array.length % 2 !== 0
                              ? "w-full"
                              : "w-full md:w-1/2"
                              } mb-3`}
                          >
                            <div className="text-base font-semibold">{key}</div>
                            <div className="text-base">
                              {/* {key === "Birthday"
                                ? formatThaiDate(value as string)
                                : isArrayOfSelectableObjects
                                  ? value
                                    .filter((v: any) => v.checked)
                                    .map((v: any) => v.text)
                                    .join(", ")
                                  : String(value) || "-"} */}
                              {
                                !value
                                  ? "-"
                                  : Array.isArray(value) && value.every(v => v && typeof v === "object" && "checked" in v)
                                    ? value.filter((v: any) => v.checked).map((v: any) => v.text).join(", ") || "-"
                                    : String(value)
                              }
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Transactions */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200 flex justify-between items-center p-4">
                  <div className="text-base font-semibold text-black">
                    {t("dataSubjectReceipt.details.transaction")} <span className="text-base text-gray-500">({transactionElement?.length || 0})</span>
                  </div>
                  {transactionElement && transactionElement.length > 0 && (
                    <button onClick={() => setOpenTransactions(!openTransactions)}>
                      {openTransactions ? (
                        <IoIosArrowUp className="text-gray-600 text-lg" />
                      ) : (
                        <IoIosArrowDown className="text-gray-600 text-lg" />
                      )}
                    </button>
                  )}
                </div>


                {transactionElement?.length > 0 && openTransactions && (
                  <div className="space-y-4 p-4">
                    {transactionElement.map((tx: any, index: number) => {
                      const isOpen = openTransactionsIndexes.includes(index);
                      const hasPurpose = tx.purposes && tx.purposes.length > 0;

                      return (
                        <div key={tx.transactionId} className="border rounded-lg bg-white p-4 space-y-4">
                          <div
                            className={`flex justify-between items-center ${hasPurpose ? "cursor-pointer" : ""}`}
                            onClick={() => hasPurpose && toggleTransaction(index)}
                          >
                            <div className="flex items-center flex-wrap gap-1 text-sm">
                              <span className="text-base font-semibold text-gray-800">
                                {t("dataSubjectReceipt.details.transactionId")}:
                              </span>
                              <a
                                href={`/consent/transaction/details/${tx.transactionId}`}
                                className="text-base text-blue-600 underline break-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {tx.transactionId}
                              </a>
                              <div className="flex items-center gap-2 ml-2">
                                <span className="text-gray-300">|</span>
                                <Tag
                                  size="sm"
                                  minHeight="1.25rem"
                                  className={`text-base font-medium px-2 py-0.5 rounded-md text-xs max-w-max ${getTransacStatusStyle(tx.status)}`}
                                >
                                  <p className="text-base font-semibold">{tx.status}</p>
                                </Tag>
                              </div>
                            </div>

                            {hasPurpose && (
                              isOpen ? (
                                <IoIosArrowUp className="text-gray-600 text-lg" />
                              ) : (
                                <IoIosArrowDown className="text-gray-600 text-lg" />
                              )
                            )}
                          </div>

                          {isOpen && hasPurpose && (
                            <div className="space-y-4">
                              <div className="-mx-4">
                                <hr className="border-t border-gray-200 w-full" />
                              </div>
                              {tx.purposes.map((purpose: StandardPurpose, idx: number) => (
                                <div key={idx} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <div className="text-base font-semibold text-gray-800">
                                      {t("dataSubjectReceipt.details.standardPurpose")}:
                                    </div>
                                    <Tag
                                      size="sm"
                                      minHeight="1.25rem"
                                      className="text-base text-blue-600 font-medium px-2 py-0.5 rounded-md bg-blue-100 max-w-max"
                                    >
                                      Version {tx.version}
                                    </Tag>
                                  </div>
                                  <div className="text-base font-medium leading-tight break-words">
                                    {purpose.IsAnonymizePurpose === true ? <div>{purpose.title}</div> :
                                      <a className="text-blue-600 " href={`/consent/purpose/standard-purpose/view-spurpose/${purpose?.standardPurposeId}`}>
                                        {purpose.title}
                                      </a>}
                                  </div>

                                  <div className="bg-gray-50 rounded p-4 space-y-4">
                                    <div className="bg-white rounded p-2 flex items-start gap-2">
                                      <Checkbox
                                        checked={purpose.checked}
                                        disabled={false}
                                        shape="square"
                                        color="#656668"
                                      />
                                      <span className="text-base text-gray-800 break-all">{purpose.title}</span>
                                    </div>

                                    {purpose.subPurposes?.map((group, groupIdx) => (
                                      <div key={groupIdx}>
                                        <div className="text-base text-[#656668] mt-4 mb-2 break-all">{group.pre_title}</div>
                                        <div className="bg-white rounded p-2 space-y-2">
                                          {Array.isArray(group.items) &&
                                            group.items.map((sub, subIdx) => (
                                              <div key={subIdx} className="flex items-start gap-2">
                                                <Checkbox
                                                  checked={sub.checked}
                                                  disabled={false}
                                                  shape="square"
                                                  color="#656668"
                                                />
                                                <span className="text-base text-gray-800 break-all" >{sub.label}</span>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>


            </div>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default ReceiptDetailPage;