import React, { useState, useMemo, useEffect } from "react";
import { useConfirm, ModalType } from "../../../../../context/ConfirmContext";
import { useTranslation } from "react-i18next";
import {
  getDataSubjectById,
  createDataRetention,
  updateDataRetention,
  getTransactionStatus
} from "../../../../../services/dataRetentionService";
import LogInfo from "../../../../../components/CustomComponent/LogInfo";
import { formatDate } from "../../../../../utils/Utils";
import Dropdown from "../../../../../components/CustomComponent/Dropdown";
import DropdownOption from "../../../../../components/CustomComponent/Dropdown/DropdownOption";
import InputText from "../../../../../components/CustomComponent/InputText";
import {
  CheckBox,
} from "../../../../../components/CustomComponent";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
interface DrawerProps {
  isOpenSubJectRetention: boolean;
  toggleMenuSubjectRetention: () => void;
  isEdit?: boolean;
  policyId: string;
  refreshData: () => void; // Add this prop to refresh data
  isView?: boolean; // Optional prop to handle view mode
}

interface MenuItemType {
  id: string;
  label: string;
  value: string;
}

const SubjectRetention: React.FC<DrawerProps> = ({
  isOpenSubJectRetention,
  toggleMenuSubjectRetention,
  isEdit,
  policyId,
  refreshData, // Destructure the refreshData prop
  isView,
}) => {
  // for new multiple select
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<
    {
      value: string;
      label: string;
      textColor: string;
      backgroundColor: string;
    }[]
  >([]);
  //
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = JSON.parse(getUserSession).customer_id;
  const userId = JSON.parse(getUserSession).user_account_id;
  const currentOrg = localStorage.getItem("currentOrg");
  const getUserRole = sessionStorage.getItem("user");
  const user = getUserRole ? JSON.parse(getUserRole).user_account_id : null;
  if (currentOrg) {
    const parsedOrg = JSON.parse(currentOrg);
    const currentOrgId = parsedOrg.organizationId;
  }

  const [policyName, setPolicyName] = useState("");
  const [retentionDuration, setRetentionDuration] = useState("");
  const [retentionTimeType, setRetentionTimeType] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  const [retainDataBasedOn, setRetainDataBasedOn] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  const [enableKeepReceiptsTransactions, setEnableKeepReceiptsTransactions] =
    useState(false);
  const [purposeStatus, setPurposeStatus] = useState<
    { value: string; label: string; selected: boolean }[]
  >([]);
  const [isActiveStatus, setIsActiveStatus] = useState(true);
  const [createdByDate, setCreatedByDate] = useState("");
  const [modifyByDate, setModifyByDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [modifyBy, setModifyBy] = useState("");
  const [showPurposeStatus, setShowPurposeStatus] = useState(true);
  const [openAdvancedOptionAccordion, setOpenAdvancedOptionAccordion] =
    useState(false);

  const retentionTimeTypeOption = [
    { value: "Days", label: t("settings.consentSetting.dataRetention.days") },
    { value: "Weeks", label: t("settings.consentSetting.dataRetention.weeks") },
    {
      value: "Months",
      label: t("settings.consentSetting.dataRetention.months"),
    },
    { value: "Years", label: t("settings.consentSetting.dataRetention.years") },
  ];
  const retainDataBasedOnOption = [
    {
      value: "Last Transaction Date",
      label: t("settings.consentSetting.dataRetention.lastTransactionDate"),
    },
    {
      value: "Last Consent Date",
      label: t("settings.consentSetting.dataRetention.lastConsentDate"),
    },
  ];
  const [errors, setErrors] = useState({
    policyName: false,
    retentionDuration: false,
    retentionTimeType: false,
    retainDataBasedOn: false,
    // purposeStatus: false,
  });

  const [value, setValue] = useState([
    {
      value: "Confirmed",
      label: t("settings.consentSetting.dataRetention.confirmed"),
      textColor: "text-green-700",
      backgroundColor: "bg-green-100",
      selected: false,
    },
    {
      value: "Not Given",
      label: t("settings.consentSetting.dataRetention.notGiven"),
      textColor: "text-yellow-500",
      backgroundColor: "bg-yellow-100",
      selected: false,
    },
    {
      value: "Withdraw",
      label: t("settings.consentSetting.dataRetention.withdraw"),
      textColor: "text-red-600",
      backgroundColor: "bg-red-100",
      selected: false,
    },
    {
      value: "Expired",
      label: t("settings.consentSetting.dataRetention.expired"),
      textColor: "text-gray-600",
      backgroundColor: "bg-gray-100",
      selected: false,
    },
  ]);

  const [selectedValues, setSelectedValues] = useState<any[]>([]);


  const [query, setQuery] = useState("");

  const onItemChange = (label: string) => {
    const newValue = value.map((item) =>
      item.label === label ? { ...item, selected: !item.selected } : item
    );

    setValue(newValue);
    const selected = newValue.filter((item) => item.selected);

    setSelectedValues(selected);
    setPurposeStatus(selected);
    // console.log('PurposeStatus',value)
  };
  const toggleAdvanceOptionsAccordion = () => {
    setOpenAdvancedOptionAccordion(!openAdvancedOptionAccordion);
  };
  const filterValue = value.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );
  useEffect(() => {
    if (!isEdit && !isView) {
      clearData();
      const newErrors = {
        policyName: false,
        retentionDuration: false,
        retentionTimeType: false,
        retainDataBasedOn: false,
      };
      setErrors(newErrors);
    }
  }, [isOpenSubJectRetention, isView]);
  useEffect(() => {
 
    if (isEdit || isView) {
      getDataSubjectById(policyId).then((res: any) => {
        if (res?.data?.data) {
          const item = res?.data?.data;


          const getPurposeStatus = JSON.parse(item.purposeStatus);

          const result = value.filter((item) =>
            getPurposeStatus.PurposeStatus.includes(item.label)
          );
          setSelectValue(result);

          setPolicyName(item.policyName);
          setRetentionDuration(item.retentionDuration);
          const resultRetentionTimeType = retentionTimeTypeOption.find(
            (option) => option.value === item.retentionTimeType
          );
          setRetentionTimeType(resultRetentionTimeType);

          const resultRetainDataBasedOn = retainDataBasedOnOption.find(
            (option) => option.value === item.retainDataBasedOn
          );
          setRetainDataBasedOn(resultRetainDataBasedOn);
          // setRetentionTimeType(item.retentionTimeType);
          // setRetainDataBasedOn(item.retainDataBasedOn);
          setEnableKeepReceiptsTransactions(
            item.enableKeepReceiptsTransactions
          );
          const purposeStatus = JSON.parse(
            item.purposeStatus
          ).PurposeStatus.map((status: string) => {
            const option = value.find((option) => option.label === status);
            return {
              value: status,
              label: option ? option.label : status,
              selected: true,
            };
          });

          const updatedValue = value.map((item) => {
            const isSelected = purposeStatus.some(
              (status: any) => status.label === item.label
            );
            return { ...item, selected: isSelected };
          });

          setValue(updatedValue);
          setSelectedValues(purposeStatus);

          setIsActiveStatus(item.isActiveStatus);
          setCreatedByDate(formatDate("datetime", item.createdDate));
          setModifyByDate(formatDate("datetime", item.modifiedDate));
          setCreatedBy(item.createdByName);
          setModifyBy(item.modifiedByName);
        }
      });
    } else {
      clearData();
    }
  }, [isEdit, isView, policyId]);

  useEffect(() => {
    getTransactionStatus().then((res: any) => {
      if (res?.data?.data) {
        const transactionStatus = res.data.data.map((item: any) => ({

          //  value: "Confirmed",
          //       label: t("settings.consentSetting.dataRetention.confirmed"),
          //       textColor: "text-green-700",
          //       backgroundColor: "bg-green-100",
          //       selected: false,

          value: item.transactionStatusId,
          label: item.statusName,
          textColor: item.statusName === "Confirmed" ? "text-green-700" :
            item.statusName === "Not Given" ? "text-yellow-500" :
              item.statusName === "Withdrawn" ? "text-red-600" :
                item.statusName === "Expired" ? "text-gray-600" : "text-gray-900",
          backgroundColor: item.statusName === "Confirmed" ? "bg-green-100" :
            item.statusName === "Not Given" ? "bg-yellow-100" :
              item.statusName === "Withdrawn" ? "bg-red-100" :
                item.statusName === "Expired" ? "bg-gray-100" : "bg-gray-100"
          ,
          selected: false,
        }));
        setValue(transactionStatus);


      }
    });
  }, [])
  const clearData = async () => {
    setSelectedValues([]);
    setSelectValue([]);
    setSearchQuery("");
    setIsDropdownOpen(false);
    setPolicyName("");
    setRetentionDuration("");
    setRetentionTimeType({ value: "", label: "" });
    setRetainDataBasedOn({ value: "", label: "" });
    setEnableKeepReceiptsTransactions(false);
    setPurposeStatus([]);
    setIsActiveStatus(true);
    setCreatedByDate("-");
    setModifyByDate("-");
    setCreatedBy("-");
    setModifyBy("-");
    value.forEach((item) => {
      item.selected = false;
    });
  };
  const handleSubmit = () => {
    const newErrors = {
      policyName: !policyName,
      retentionDuration:
        isNaN(Number(retentionDuration)) || retentionDuration === "",
      retentionTimeType: retentionTimeType.value === "",
      retainDataBasedOn: retainDataBasedOn.value === "",
      // purposeStatus: purposeStatus.length === 0
    };
    setErrors(newErrors);
    //  console.log('purposeStatus', selectedValues)
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    const result: any = {};
    result["customerId"] = customerId;
    result["policyType"] = "DataSubjectRetentionPolicy";
    result["policyStatus"] = "Active";
    result["isActiveStatus"] = true;
    result["createdBy"] = userId;
    result["dataSubjectRetentionPolicy"] = {
      policyName: policyName,
      retentionDuration: Number(retentionDuration),
      retentionTimeType: retentionTimeType.value,
      retainDataBasedOn: retainDataBasedOn.value,
      enableKeepReceiptsTransactions: enableKeepReceiptsTransactions,
      purposeStatus: JSON.stringify({
        PurposeStatus: selectedValues.map((status) => status.label),
      }),
      isActiveStatus: isActiveStatus,
    };
    // console.log('result',result)
    if (isEdit) {
      result["policyId"] = policyId;
      result["modifiedBy"] = userId;
      // console.log('result update', result)

      confirm({
        title: t("modal.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("modal.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          try {
            //const res = await delRolePermission(rolePermissionId);
            updateDataRetention(result).then((res: any) => {
              if (res?.data?.data) {
                if (res.data.isError === false) {
                  clearData();
                  toggleMenuSubjectRetention(); // Close the drawer
                  refreshData(); // Refresh the data
                } else {
                  throw new Error(res.data.message || "Unknown error");
                }
              }
            });
          } catch (error) {
            //   console.error("error", error);
            throw error; // ส่ง error ไปยัง ConfirmModal
          }
        },
        notify: true,
        onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.successConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.errorConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    } else {
      confirm({
        title: t("modal.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("modal.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        // title: "Create Data Subject Retention", //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        // detail:"Confirm to Save Data Subject Retention", //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          try {
            //const res = await delRolePermission(rolePermissionId);
            createDataRetention(result).then((res: any) => {
              if (res?.data?.data) {
                if (res.data.isError === false) {
                  clearData();
                  toggleMenuSubjectRetention(); // Close the drawer
                  refreshData(); // Refresh the data
                } else {
                  throw new Error(res.data.message || "Unknown error");
                }
              }
            });
          } catch (error) {
            console.error("error", error);
            throw error; // ส่ง error ไปยัง ConfirmModal
          }
        },
        notify: true,
        onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.successConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.errorConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    }
  };

  // for new multiple select

  const removeTag = (label: string) => {
    setSelectValue((prev) => prev.filter((item: any) => item.label !== label));
    setPurposeStatus((prev) =>
      prev.filter((item: any) => item.label !== label)
    );
    setSelectedValues((prev) =>
      prev.filter((item: any) => item.label !== label)
    );
  };

  const isSelected = (value: string) =>
    selectValue.some((item: any) => item.label === value);
  const filteredOptions = useMemo(() => {
    return filterValue.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, filterValue]);

  const toggleSelectAll = () => {
    setSelectValue((prev: any) =>
      prev.length === filteredOptions.length
        ? []
        : filteredOptions.map((option) => ({
          value: option.value,
          label: option.label,
          textColor: option.textColor || "text-gray-900",
          backgroundColor: option.backgroundColor || "bg-gray-100",
        }))
    );
    setSelectedValues((prev: any) =>
      prev.length === filteredOptions.length
        ? []
        : filteredOptions.map((option) => ({
          value: option.value,
          label: option.label,
          textColor: option.textColor || "text-gray-900",
          backgroundColor: option.backgroundColor || "bg-gray-100",
          selected: true,
        }))
    );
    // console.log('filteredOptions', filteredOptions)
    setPurposeStatus((prev: any) =>
      prev.length === filteredOptions.length ? [] : filteredOptions
    );
  };

  const toggleSelect = (selectedItem: any) => {
    setSelectValue((prev) => {
      const isSelected = prev.some(
        (item: any) => item.label === selectedItem.label
      );
      return isSelected
        ? prev.filter((item: any) => item.label !== selectedItem.label)
        : [...prev, selectedItem];
    });

    setSelectedValues((prev) => {
      const isSelected = prev.some(
        (item: any) => item.label === selectedItem.label
      );
      return isSelected
        ? prev.filter((item: any) => item.label !== selectedItem.label)
        : [...prev, selectedItem];
    });
    setPurposeStatus((prev) => {
      const isSelected = prev.some(
        (item: any) => item.label === selectedItem.label
      );
      return isSelected
        ? prev.filter((item: any) => item.label !== selectedItem.label)
        : [...prev, selectedItem];
    });
  };
  //
  return (
    <div
      className={`h-[100vh] overflow-auto fixed z-[13] top-0 right-0 px-3 h-full w-[490px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpenSubJectRetention ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="p-4">
        <button
          className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
          onClick={toggleMenuSubjectRetention}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            className="size-6 h-[30px] w-[30px]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="mt-4">
          <h1 className="text-xl font-semibold">
            {isEdit ? (
              <span>{t("settings.consentSetting.dataRetention.edit")}</span>
            ) : (
              <span>{t("settings.consentSetting.dataRetention.create")}</span>
            )}{" "}
            {t("settings.consentSetting.dataRetention.dataSubjectRetention")}
          </h1>
          <p className="text-base">
            {t("settings.consentSetting.dataRetention.dataSubjectDescription")}
          </p>
          <label
            htmlFor="toggle1"
            className="flex items-center cursor-pointer pt-7"
          >
            <div className="relative">
              <input
                id="toggle1"
                type="checkbox"
                className="sr-only"
                checked={isActiveStatus}
                onChange={() => setIsActiveStatus(!isActiveStatus)}
                disabled={isView} // Disable the toggle if isView is true
              />
              <div
                className={`${isView && "bg-opacity-50 cursor-not-allowed"
                  } block w-12 h-6 rounded-full ${isActiveStatus ? "bg-blue-500" : "bg-gray-300"
                  }`}
              ></div>
              <div
                className={` dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition  ${isActiveStatus
                    ? "left-[12px] transform translate-x-full bg-white-500"
                    : ""
                  }`}
              ></div>
            </div>
            <p className="ms-3 font-semibold text-base">
              {t("settings.consentSetting.dataRetention.active")}
            </p>
          </label>
          <div className="pt-5">
            <h1 className="font-semibold pb-2">
              {/* <span className="text-[red]">* </span>  */}
              {/* {t("Policy Name")} */}
              {/* {("Policy Name")} */}
            </h1>

            <h1 className="font-semibold text-base">
              <span className="text-[red]">*</span>{" "}
              {t("settings.consentSetting.dataRetention.retentionPolicyName")}
            </h1>
            <InputText
              type="text"
              className={`w-full mt-2 h-8 border border-solid border-1 border-[#e5e7eb] rounded-md text-base px-4 ${errors.policyName ? "border-red-500" : "border-[#DFE4EA]"
                }"`}
              placeholder={t(
                "settings.consentSetting.dataRetention.retentionPolicyName"
              )}
              value={policyName}
              isError={errors.policyName ? true : false}
              onChange={(e) => setPolicyName(e.target.value)}
              disabled={isView} // Disable the input if isView is true
            />
            {errors.policyName && (
              <p className="text-red-500 pt-2 text-base">
                {t("settings.consentSetting.dataRetention.thisFieldIsRequired")}
                {/* {"This field is required"} */}
                {/* {"Please enter a valid information"} */}
              </p>
            )}
          </div>
          <div className="pt-5">
            <p className="font-semibold text-base">
              <span className="text-[red]">*</span>
              {t("settings.consentSetting.dataRetention.retentionPeriod")}
            </p>
            <p className="pl-3 text-base">
              {t(
                "settings.consentSetting.dataRetention.retentionPeriodDescription"
              )}
            </p>
            <div className="flex">
              <div className="w-4/12">
                <InputText
                  className={`w-full mt-2 h-[30px] border border-solid border-1 border-[#e5e7eb] rounded-md text-base px-4 ${errors.retentionDuration
                      ? "border-red-500"
                      : "border-[#DFE4EA]"
                    }"`}
                  placeholder={t(
                    "settings.consentSetting.dataRetention.duration"
                  )}
                  value={retentionDuration}
                  isError={errors.retentionDuration ? true : false}
                  onChange={(e) => setRetentionDuration(e.target.value)}
                  disabled={isView} // Disable the input if isView is true
                />
                {errors.retentionDuration && retentionDuration !== "" && (
                  <p className="text-red-500 pt-2 text-base">
                    {t(
                      "settings.consentSetting.dataRetention.pleaseEnterAValidInformation"
                    )}
                    {/* {"This field is required number only"} */}
                    {/* {"Please enter a valid information"} */}
                  </p>
                )}
                {errors.retentionDuration && retentionDuration === "" && (
                  <p className="text-red-500 pt-2 text-base">
                    {t(
                      "settings.consentSetting.dataRetention.thisFieldIsRequired"
                    )}
                    {/* {"This field is required number only"} */}
                    {/* {"Please enter a valid information"} */}
                  </p>
                )}
              </div>
              <div className="w-8/12  ml-1">
                {/* <Select
                                    className="text-sm mt-2"
                                    styles={customStyles}
                                    placeholder={t("settings.consentSetting.dataRetention.search")}
                                    value={retentionTimeType}
                                    onChange={(selectedOption) => {
                                        setRetentionTimeType(selectedOption ? { value: selectedOption.value, label: selectedOption.label } : null);
                                    }}
                                    options={retentionTimeTypeOption} 
                                    /> */}
                <Dropdown
                  id="retentionTimeType"
                  title={t("settings.consentSetting.dataRetention.search")}
                  className="w-full mt-2 text-base"
                  selectedName={retentionTimeType.label}
                  disabled={isView}
                  isError={errors.retentionTimeType ? true : false}
                  minWidth="10rem"
                  customeHeight={true}
                  customeHeightValue="175px"
                >
                  <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-9px] w-[270px] text-base">
                    {retentionTimeTypeOption.map((item) => (
                      <DropdownOption
                        className="h-[2.625rem]"
                        selected={retentionTimeType.value === item.value}
                        onClick={() => {
                          setRetentionTimeType({
                            value: item.value,
                            label: item.label,
                          });
                        }}
                        key={item.value}
                      >
                        <span
                          className={`${retentionTimeType.value === item.value
                              ? "text-white text-base"
                              : ""
                            }`}
                        >
                          {item.label}
                        </span>
                      </DropdownOption>
                    ))}
                  </div>
                </Dropdown>
                {errors.retentionTimeType && (
                  <p className="text-red-500 pt-2 text-base">
                    {t(
                      "settings.consentSetting.dataRetention.thisFieldIsRequired"
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="pt-5">
            <p className="font-semibold text-base">
              <span className="text-[red]">*</span>{" "}
              {t("settings.consentSetting.dataRetention.retainDataBasedOn")}
            </p>
            <p className="text-base mt-1 ml-3">
              {t(
                "settings.consentSetting.dataRetention.retainDataBasedOnDescription"
              )}
            </p>

            <Dropdown
              id="retainDataBasedOn"
              title={t("settings.consentSetting.dataRetention.search")}
              className="w-full mt-2 text-base"
              selectedName={retainDataBasedOn?.label}
              disabled={isView}
              isError={errors.retainDataBasedOn ? true : false}

            // customeHeight={true}
            >
              <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-9px] ">
                {retainDataBasedOnOption.map((item) => (
                  <DropdownOption
                    className="h-[2.625rem] w-full"
                    selected={retainDataBasedOn?.value === item.value}
                    onClick={() => {
                      setRetainDataBasedOn({
                        value: item.value,
                        label: item.label,
                      });
                    }}
                    key={item.value}
                  >
                    <span
                      className={`${retainDataBasedOn?.value === item.value
                          ? "text-white text-base"
                          : ""
                        }`}
                    >
                      {item.label}
                    </span>
                  </DropdownOption>
                ))}
              </div>
            </Dropdown>
            {errors.retainDataBasedOn && (
              <p className="text-red-500 pt-2 text-base">
                {t("settings.consentSetting.dataRetention.thisFieldIsRequired")}
              </p>
            )}
          </div>
          {showPurposeStatus && (
            <div className="pt-5">
              <p className="font-semibold text-base">
                {t("settings.consentSetting.dataRetention.purposeStatus")}
              </p>
              <p className="text-base mt-1">
                {t(
                  "settings.consentSetting.dataRetention.purposeStatusDescription"
                )}
              </p>
              <div className="mt-2 relative">
                <div className="relative z-10">
                  <InputText
                    type="text"
                    disabled={isView} // Disable the input if isView is true
                    // isError={errors.purposeStatus ? true : false}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={() => setIsDropdownOpen(true)}
                    placeholder={t("roleAndPermission.pleaseSelect")}
                    className="w-full border rounded-md px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 z-10"
                  >
                    {isDropdownOpen ? (
                      <IoIosArrowUp className="text-gray-500 " />
                    ) : (
                      <IoIosArrowDown className="text-gray-500 " />
                    )}
                  </button>
                </div>

                {isDropdownOpen && filteredOptions.length > 0 && (
                  <div className="relative w-full mt-0 p-0 bg-white border rounded-md max-h-60 overflow-y-auto ">
                    {/* Select All */}
                    <div className="p-2">
                      {/* แก้ไข: ใส่ onClick ที่ label, เอา onChange ออกจาก CheckBox */}
                      <label
                        className="flex items-center gap-4 pl-2 cursor-pointer"
                        onClick={toggleSelectAll} // <--- ใส่ onClick ที่นี่
                      >
                        <CheckBox
                          shape="square"
                          checked={
                            selectValue.length === filteredOptions.length &&
                            filteredOptions.length > 0
                          }
                        // onChange={toggleSelectAll} // <--- เอา onChange ออก
                        />
                        <span className="text-gray-900 font-medium">
                          {t(
                            "purpose.standardPurpose.preferenceModal.selectAll"
                          )}
                        </span>
                      </label>
                    </div>
                    <hr className="w-[96%] mx-auto border-gray-200" />
                    {/* List Items */}
                  
                    {filteredOptions.map((option, index) => (
                      <div key={option.value}>
                        {/* แก้ไข: ใส่ onClick ที่ label, เอา onChange ออกจาก CheckBox */}
                        <label
                          onClick={() => toggleSelect(option)} // <--- ใส่ onClick ที่นี่
                          className={`flex items-center space-x-4 px-4 py-2 cursor-pointer hover:bg-gray-100 
                                  ${index !== filteredOptions.length - 1
                              ? ""
                              : ""
                            }`}
                        >
                          <CheckBox
                            shape="square"
                            checked={isSelected(option.label)}
                          // onChange={() => toggleSelect(option)} // <--- เอา onChange ออก
                          />
                          <span className="text-gray-900 truncate">
                            {option.label}
                          </span>
                        </label>
                        {index !== filteredOptions.length - 1 && (
                          <hr className="w-[96%] mx-auto border-gray-200" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectValue.length > 0 && (
                <div className="flex flex-wrap w-full mt-2">
                  {selectValue.map((item) => (
                    <div
                      key={item.value}
                      className={` ${item.backgroundColor} ${item.textColor} px-3 my-1 py-1 mx-1 text-blue-600 rounded-md text-base flex items-center gap-2`}
                    >
                      {item.label}
                      {!isView && (
                        <button
                          onClick={() => removeTag(item.label)}
                          className="text-gray-600 hover:text-gray-600"
                        >
                          <FaTimes size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* <MultipleSelect
                onSearch={(e) => setQuery(e.target.value)}
                search
                className="h-auto w-full mt-2 text-base"
                height="h-auto"
                width="w-full"
                value={selectedValues}
                onClose={() => setQuery("")}
              >
                <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-60px] w-[434px] font-semibold text-base">
                  {filterValue.map((item) => (
                    <MutipleSelectOption
                      key={item.label}
                      selected={item.selected}
                      onChange={() => onItemChange(item.label)}
                      className="top-[-100px]"
                      backgroundColor={item.textColor}
                    >
                      <p className="text-base">{item.label}</p>
                    </MutipleSelectOption>
                  ))}
                </div>
              </MultipleSelect> */}
            </div>
          )}
          <div className="pt-5 border-b border-1 border-[gainsboro] pb-5">
            <div>
              <div id="accordion-collapse" data-accordion="collapse">
                <h2 id="accordion-collapse-heading-1">
                  <button
                    type="button"
                    className=" flex items-center justify-end w-full px-5 py-3 font-base rtl:text-right font-semibold"
                    onClick={toggleAdvanceOptionsAccordion}
                    aria-expanded={openAdvancedOptionAccordion}
                    aria-controls="accordion-collapse-body-1"
                  >
                    <div className="flex justify-end">
                      <div className="pt-5 border-b border-1 border-[gainsboro] pb-5"></div>
                      <span
                        style={{ fontSize: "16px" }}
                        className="font-base rtl:text-right m-auto pr-3"
                      >
                        {t(
                          "settings.consentSetting.dataRetention.advancedOption"
                        )}
                      </span>
                    </div>
                    <svg
                      data-accordion-icon
                      className={`w-3 h-3 shrink-0 transition-transform ${openAdvancedOptionAccordion ? "rotate-180" : ""
                        }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </h2>
                <div
                  id="accordion-collapse-body-1"
                  className={`${openAdvancedOptionAccordion ? "" : "hidden"}`}
                  aria-labelledby="accordion-collapse-heading-1"
                >
                  <div className="p-5 dark:border-gray-700 dark:bg-gray-900 flex flex-wrap">
                    <label
                      htmlFor="toggle2"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="relative">
                        <input
                          id="toggle2"
                          type="checkbox"
                          disabled={isView} // Disable the toggle if isView is true
                          className="sr-only"
                          checked={enableKeepReceiptsTransactions}
                          onChange={() =>
                            setEnableKeepReceiptsTransactions(
                              !enableKeepReceiptsTransactions
                            )
                          }
                        />

                        <div
                          className={`${isView && "bg-opacity-50 cursor-not-allowed"
                            } block w-12 h-6 rounded-full ${enableKeepReceiptsTransactions
                              ? "bg-blue-500"
                              : "bg-gray-300"
                            }`}
                        ></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition  ${enableKeepReceiptsTransactions
                              ? "left-[12px] transform translate-x-full bg-white-500"
                              : ""
                            }`}
                        ></div>
                      </div>

                      <p className="pl-3 font-semibold text-base">
                        {t(
                          "settings.consentSetting.dataRetention.keepReceiptsAndTransactions"
                        )}
                      </p>
                    </label>
                    <div className="relative ml-16">
                      <p className="text-base mt-1">
                        {t(
                          "settings.consentSetting.dataRetention.keepReceiptsAndTransactionsDescription"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <LogInfo
                createdBy={createdBy}
                createdDate={createdByDate}
                modifiedBy={modifyBy}
                modifiedDate={modifyByDate}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="bg-white text-black border border-1 border-[gainsboro] text-base px-4 py-2 rounded-md mt-5 "
              onClick={toggleMenuSubjectRetention}
            >
              {t("modal.cancel")}
            </button>
            {!isView && (
              <button
                className="ml-1 bg-[#3758F9] text-white text-base px-4 py-2 rounded-md mt-5"
                onClick={handleSubmit}
              >
                {t("submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectRetention;
