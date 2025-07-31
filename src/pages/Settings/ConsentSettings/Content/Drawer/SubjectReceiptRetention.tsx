import React, { useEffect, useState, useMemo } from "react";

import {
  getDataReceiptById,
  createDataRetention,
  updateDataRetention,
  getStandardPurposeList,
} from "../../../../../services/dataRetentionService";
import { useConfirm, ModalType } from "../../../../../context/ConfirmContext";
import { useTranslation } from "react-i18next";
import LogInfo from "../../../../../components/CustomComponent/LogInfo";
import { formatDate } from "../../../../../utils/Utils";
import InputText from "../../../../../components/CustomComponent/InputText";
import { Button } from "@headlessui/react";
import { CheckBox } from "../../../../../components/CustomComponent";
import Dropdown from "../../../../../components/CustomComponent/Dropdown";
import DropdownOption from "../../../../../components/CustomComponent/Dropdown/DropdownOption";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
interface DrawerProps {
  isOpenSubJectReceiptRetention: boolean;
  toggleMenuSubjectReceiptRetention: () => void;
  isEdit: boolean;
  isView?: boolean; // Optional prop for view mode
  policyId: string;
  refreshData: () => void; // Add this prop to refresh data
}

const SubjectReceiptRetention: React.FC<DrawerProps> = ({
  isOpenSubJectReceiptRetention,
  toggleMenuSubjectReceiptRetention,
  isEdit,
  isView,
  policyId,
  refreshData, // Destructure the refreshData prop
}) => {
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = JSON.parse(getUserSession).customer_id;
  const userId = JSON.parse(getUserSession).user_account_id;
  const currentOrg = localStorage.getItem("currentOrg");
  const getUserRole = sessionStorage.getItem("user");
  const user = getUserRole ? JSON.parse(getUserRole).user_account_id : null;
  // if (currentOrg) {
  const parsedOrg = JSON.parse(currentOrg);
  const currentOrgId = parsedOrg.organizationId;
  // }

  // ---- for example dropdown muilti select ----
  const [errorValue, setErrorValue] = useState(false);
  const [selectValue, setSelectValue] = useState<
    { id: string; label: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [optionMuiltiSelect, setOptionsMultiSelect] = useState([]);
  const isSelected = (id: string) =>
    selectValue.some((item: any) => item.id === id);
  const removeTag = (id: string) => {
    setSelectValue((prev) => prev.filter((item) => item.id !== id));
    setPurposeStatus((prev) => prev.filter((item) => item.id !== id));
  };

  //

  const [policyName, setPolicyName] = useState("");
  const [retentionDuration, setRetentionDuration] = useState("");
  // const [retentionTimeType, setRetentionTimeType] = useState<{ value: string, label: string }[]>([]);
  const [retentionTimeType, setRetentionTimeType] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  // const [retainDataBasedOn, setRetainDataBasedOn] = useState<{ value: string, label: string }[]>([]);
  const [retainDataBasedOn, setRetainDataBasedOn] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  // const [purposeStatus, setPurposeStatus] = useState<{ value: string, label: string }[]>([]);
  const [purposeStatus, setPurposeStatus] = useState<
    { value: string; label: string; selected: boolean }[]
  >([]);
  // const [consentStatus, setConsentStatus] = useState<{ value: string, label: string }[]>([]);
  const [consentStatus, setConsentStatus] = useState<
    { value: string; label: string; selected: boolean }[]
  >([]);
  const [retainReceiptsBasedOn, setRetainReceiptsBasedOn] = useState<
    { value: string; label: string; selected: boolean }[]
  >([]);
  const [isActiveStatus, setIsActiveStatus] = useState(true);
  const [isAnonymizeRecord, setIsAnonymizeRecord] = useState(false);
  const [createdByDate, setCreatedByDate] = useState("");
  const [modifyByDate, setModifyByDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [modifyBy, setModifyBy] = useState("");
  // const [interfaceReference, setInterfaceReference] = useState<
  //   { value: string; label: string; selected: boolean }[]
  // >([]);
  // const [interfaceOptions, setInterfaceOptions] = useState<
  //   { value: string; label: string; selected: boolean }[]
  // >([]);
  const [purposeOptions, setPurposeOptions] = useState<
    { value: string; label: string; selected: boolean }[]
  >([]);

  const [openAdvancedOptionAccordion, setOpenAdvancedOptionAccordion] =
    useState(false);
  const [errors, setErrors] = useState({
    policyName: false,
    retentionDuration: false,
    retentionTimeType: false,
    retainDataBasedOn: false,
    purposeStatus: false,
    // consentStatus: false,
  });
  // const getInterface = async () => {
  //   getInterfaceList(currentOrgId).then((res: any) => {
  //     if (res?.data?.data) {
  //       const data = res.data.data.map((item: any) => ({
  //         value: item.interfaceId,
  //         label: item.interfaceName + "_" + item.versionNumber,
  //       }));
  //       setInterfaceOptions(data);
  //     }
  //   });
  // };
  const toggleAdvanceOptionsAccordion = () => {
    setOpenAdvancedOptionAccordion(!openAdvancedOptionAccordion);
  };
  // const [consentStatusOptions, setConsentStatusOptions] = useState([
  //   {
  //     value: "All",
  //     label: t("settings.consentSetting.dataRetention.all"),
  //     selected: false,
  //   },
  //   {
  //     value: "Confirmed",
  //     label: t("settings.consentSetting.dataRetention.confirmed"),
  //     selected: false,
  //   },
  //   {
  //     value: "Withdraw",
  //     label: t("settings.consentSetting.dataRetention.withdraw"),
  //     selected: false,
  //   },
  //   {
  //     value: "Expired",
  //     label: t("settings.consentSetting.dataRetention.expired"),
  //     selected: false,
  //   },
  //   {
  //     value: "Not Given",
  //     label: t("settings.consentSetting.dataRetention.notGiven"),
  //     selected: false,
  //   },
  // ]);
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
      value: "Receipt Date",
      label: t("settings.consentSetting.dataRetention.receiptDate"),
    },
    // {
    //   value: "Last Trasaction Date",
    //   label: t("settings.consentSetting.dataRetention.lastTransactionDate"),
    // },
    // {
    //   value: "Last Consent Date",
    //   label: t("settings.consentSetting.dataRetention.lastConsentDate"),
    // },
  ];

  // const [value, setValue] = useState([
  //     { value: 'Confirmed', label: t("settings.consentSetting.dataRetention.confirmed"), selected: false },
  //     { value: 'Not Given', label: t("settings.consentSetting.dataRetention.notGiven"), selected: false  },
  //     { value: 'Pending', label: t("settings.consentSetting.dataRetention.pending"), selected: false  },
  //     { value: 'Withdraw', label: t("settings.consentSetting.dataRetention.withdraw") , selected: false },
  //     { value: 'Expired', label: t("settings.consentSetting.dataRetention.expired"), selected: false  },
  //     { value: 'Extend', label: t("settings.consentSetting.dataRetention.extend"), selected: false  }
  // ]);

  const [selectedValuesPurpostStatus, setSelectedValuesPurpostStatus] =
    useState<any[]>([]);
  const [queryPurpostStatus, setQueryPurpostStatus] = useState("");
  const onItemChangePurpostStatus = (value: string) => {
    const newValuePurpostStatus = purposeOptions.map((item) =>
      item.value === value ? { ...item, selected: !item.selected } : item
    );
    setPurposeOptions(newValuePurpostStatus);
    const selected = newValuePurpostStatus.filter((item) => item.selected);
    setSelectedValuesPurpostStatus(selected);
    setPurposeStatus(selected);
    // alert(selectedValuesPurpostStatus)
  };
  const filterValuePurpostStatus = purposeOptions.filter((item) =>
    item.value.includes(queryPurpostStatus.toLowerCase())
  );

  const [selectedValuesConsentStatus, setSelectedValuesConsentStatus] =
    useState<any[]>([]);
  // const [queryConsentStatus, setQueryConsentStatus] = useState("");
  // const onItemChangeConsentStatus = (value: string) => {
  //   const newValueConsentStatus = consentStatusOptions.map((item) =>
  //     item.value === value ? { ...item, selected: !item.selected } : item
  //   );
  //   setConsentStatusOptions(newValueConsentStatus);
  //   const selected = newValueConsentStatus.filter((item) => item.selected);
  //   // console.log('selected',selected)
  //   setSelectedValuesConsentStatus(selected);
  //   setConsentStatus(selected);
  //   console.log("ConsentStatus", selected);
  // };
  // const filterValueConsentStatus = consentStatusOptions.filter((item) =>
  //   item.value.includes(queryConsentStatus.toLowerCase())
  // );

  const [
    selectedValuesInterfaceReference,
    setSelectedValuesInterfaceReference,
  ] = useState<any[]>([]);
  // const [queryInterfaceReference, setQueryInterfaceReference] = useState("");
  // const onItemChangeInterfaceReference = (value: string) => {
  //   const newValueInterfaceReference = interfaceOptions.map((item) =>
  //     item.value === value ? { ...item, selected: !item.selected } : item
  //   );
  //   setInterfaceOptions(newValueInterfaceReference); // <-- แก้ตรงนี้
  //   const selected = newValueInterfaceReference.filter((item) => item.selected);
  //   setSelectedValuesInterfaceReference(selected);
  //   setInterfaceReference(selected);
  //   console.log("setInterfaceReference", selected);
  // };
  // const filterValueInterfaceReference = interfaceOptions.filter((item) =>
  //   item.value.includes(queryInterfaceReference.toLowerCase())
  // );

  const getStandardPurpose = async () => {
    getStandardPurposeList(currentOrgId).then((res: any) => {
      if (res?.data?.data) {
        const data = res.data.data
          .sort((a: any, b: any) => {
            const nameA = a.standardPurposeName + "_Ver" + a.versionNumber;
            const nameB = b.standardPurposeName + "_Ver" + b.versionNumber;
            return nameA.localeCompare(nameB); // เรียง A-Z
          })
          .map((item: any) => ({
            value: item.standardPurposeId,
            label: item.standardPurposeName + "_Ver" + item.versionNumber,
            selected: false,
          }));

        setPurposeOptions(data);
        // console.log('PurposeOptions',data)
      }
    });
  };
  const clearData = async () => {
    setPolicyName("");
    setRetentionDuration("");
    setRetentionTimeType({ value: "", label: "" });
    setRetainDataBasedOn({ value: "", label: "" });
    // setRetainDataBasedOnLabel([]);
    setPurposeStatus([]);
    // setConsentStatus([]);
    // setInterfaceReference([]);
    setIsActiveStatus(true);
    setIsAnonymizeRecord(true);
    setCreatedByDate("-");
    setModifyByDate("-");
    setCreatedBy("-");
    setModifyBy("-");
    setSelectValue([]);
    setIsDropdownOpen(false);
    setSearchQuery("");

    purposeStatus.forEach((item) => {
      item.selected = false;
    });
    setSelectedValuesPurpostStatus([]);
    consentStatus.forEach((item) => {
      item.selected = false;
    });
    // setSelectedValuesConsentStatus([]);
    // interfaceReference.forEach((item) => {
    //   item.selected = false;
    // });
    setSelectedValuesInterfaceReference([]);
    // console.log('consentStatusOptions',consentStatusOptions)
    // console.log('selectedValuesConsentStatus',selectedValuesConsentStatus)
  };
  useEffect(() => {
    // console.log('policyId', policyId);
    // getInterface();
    getStandardPurpose();
    if (isEdit || isView) {
      // Call api to get data
      getDataReceiptById(policyId).then((res: any) => {
        if (res?.data?.data) {
       
          const item = res?.data?.data;
        
          const getPurposeReference = JSON.parse(item.purposeReference);
         

          setSelectValue(getPurposeReference.PurposeReference);

          // console.log(item);
          // console.log(item.modifiedByName);
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
          // setRetainDataBasedOn(item.retainDataBasedOn);
          // setPurposeStatus(JSON.parse(item.purposeReference).PurposeReference.map((status: string) => ({ value: status, label: status })));
          const purposeStatus = JSON.parse(
            item.purposeReference
          ).PurposeReference.map((status: string) => {
            const option = purposeOptions.find(
              (option) => option.value === status
            );
            return {
              value: status,
              label: option ? option.label : status,
              selected: true,
            };
          });
          const updatedValuePurpose = purposeOptions.map((item) => {
            const isSelected = purposeStatus.some(
              (status: any) => status.value === item.value
            );
            return { ...item, selected: isSelected };
          });

          setPurposeOptions(updatedValuePurpose);
          setSelectedValuesPurpostStatus(purposeStatus);
          setPurposeStatus(purposeStatus);

          // setConsentStatus(JSON.parse(item.consentStatus).ConsentStatus.map((status: string) => ({ value: status, label: status })));
          // const consentStatus = JSON.parse(
          //   item.consentStatus
          // ).ConsentStatus.map((status: string) => {
          //   const option = consentStatusOptions.find(
          //     (option) => option.value === status
          //   );
          //   return {
          //     value: status,
          //     label: option ? option.label : status,
          //     selected: true,
          //   };
          // });

          // const updatedValueConsentStatus = consentStatusOptions.map((item) => {
          //   const isSelected = consentStatus.some(
          //     (status: any) => status.value === item.value
          //   );
          //   return { ...item, selected: isSelected };
          // });

          // setConsentStatusOptions(updatedValueConsentStatus);
          setSelectedValuesConsentStatus(consentStatus);
          setConsentStatus(consentStatus);

          // const interfaceRef = JSON.parse(
          //   item.interfaceReference
          // ).InterfaceReference.map((status: string) => {
          //   const option = interfaceOptions.find(
          //     (option) => option.value === status
          //   );
          //   return {
          //     value: status,
          //     label: option ? option.label : status,
          //     selected: true,
          //   };
          // });
          // const updatedValueInterfaceRef = interfaceOptions.map((item) => {
          //   const isSelected = interfaceRef.some(
          //     (status: any) => status.value === item.value
          //   );
          //   return { ...item, selected: isSelected };
          // });

          // setInterfaceOptions(updatedValueInterfaceRef);
          // setSelectedValuesInterfaceReference(interfaceRef);
          // setInterfaceReference(interfaceRef);

          setIsActiveStatus(item.isActiveStatus);
          setIsAnonymizeRecord(item.isAnonymizeRecord);
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
    //  console.log('isEdit',isEdit)
    if (!isEdit) {
      clearData();
    }
  }, [isOpenSubJectReceiptRetention]);
  const handleSubmit = () => {
    const newErrors = {
      policyName: !policyName,
      retentionDuration:
        isNaN(Number(retentionDuration)) || retentionDuration === "",
      retentionTimeType: retentionTimeType.value === "",
      retainDataBasedOn: retainDataBasedOn.value === "",
      purposeStatus: purposeStatus.length === 0,
      // consentStatus: consentStatus.length === 0
    };
    setErrors(newErrors);
    // console.log('newErrors', newErrors)
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    const result: any = {};
    result["customerId"] = customerId;
    result["policyType"] = "DataReceiptRetentionPolicy";
    result["policyStatus"] = "Active";
    result["isActiveStatus"] = true;
    result["createdBy"] = userId;
    result["dataReceiptRetentionPolicy"] = {
      policyName: policyName,
      retentionDuration: Number(retentionDuration),
      retentionTimeType: retentionTimeType.value,
      retainDataBasedOn: retainDataBasedOn.value,
      isAnonymizeRecord: isAnonymizeRecord,
      purposeReference: JSON.stringify({
        PurposeReference: selectValue,
      }),
      // consentStatus: JSON.stringify({
      //   ConsentStatus: selectedValuesConsentStatus.map(
      //     (status) => status.value
      //   ),
      // }),
      // interfaceReference: JSON.stringify({
      //   InterfaceReference: selectedValuesInterfaceReference.map(
      //     (status) => status.value
      //   ),
      // }),
      consentStatus: JSON.stringify({}),
      interfaceReference: JSON.stringify({}),
      isActiveStatus: isActiveStatus,
    };
    //  console.log('result',result)
    if (isEdit) {
      result["policyId"] = policyId;
      result["modifiedBy"] = userId;
      // console.log('result update', result)

      confirm({
        title: t("modal.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("modal.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        // title: "Update Data Receipt Retention", //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        // detail:"Confirm to Save Data Receipt Retention", //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          try {
            //const res = await delRolePermission(rolePermissionId);
            updateDataRetention(result).then((res: any) => {
              if (res?.data?.data) {
                if (res.data.isError === false) {
                  // console.log('Update data retention', res?.data?.data);
                  clearData();
                  toggleMenuSubjectReceiptRetention(); // Close the drawer
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
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.successConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.errorConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    } else {
      confirm({
        title: t("modal.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("modal.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          try {
            //const res = await delRolePermission(rolePermissionId);
            createDataRetention(result).then((res: any) => {
              if (res?.data?.data) {
                if (res.data.isError === false) {
                  // console.log('Create data retention', res?.data?.data);
                  clearData();
                  toggleMenuSubjectReceiptRetention(); // Close the drawer
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
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.successConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.errorConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    }
  };

  const preferencesOptions = useMemo(() => {
    return filterValuePurpostStatus?.map((item: any) => {
      return {
        id: item.value,
        label: item.label,
      };
    });
  }, [filterValuePurpostStatus]);

  const filteredOptions = useMemo(() => {
    return preferencesOptions.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, preferencesOptions]);

  const toggleSelectAll = () => {
    setSelectValue((prev: any) =>
      prev.length === filteredOptions.length ? [] : filteredOptions
    );
    setPurposeStatus((prev: any) =>
      prev.length === filteredOptions.length ? [] : filteredOptions
    );
  };

  const toggleSelect = (selectedItem: any) => {
    setSelectValue((prev) => {
      const isSelected = prev.some((item) => item.id === selectedItem.id);
      return isSelected
        ? prev.filter((item) => item.id !== selectedItem.id)
        : [...prev, selectedItem];
    });
    setPurposeStatus((prev) => {
      const isSelected = prev.some((item: any) => item.id === selectedItem.id);
      return isSelected
        ? prev.filter((item: any) => item.id !== selectedItem.id)
        : [...prev, selectedItem];
    });
  };

  return (
    <div
      className={`fixed z-[13] overflow-auto top-0 right-0 px-3 h-full w-[490px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpenSubJectReceiptRetention ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <button
          className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
          onClick={toggleMenuSubjectReceiptRetention}
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
            {t("settings.consentSetting.dataRetention.dataReceiptRetention")}
          </h1>
          <p className="text-base">
            {t("settings.consentSetting.dataRetention.dataReceiptDescription")}
          </p>
          <label
            htmlFor="togglex"
            className="flex items-center cursor-pointer pt-7"
          >
            <div className="relative">
              <input
                id="togglex"
                type="checkbox"
                disabled={isView}
                className={`sr-only`}
                checked={isActiveStatus}
                onChange={() => setIsActiveStatus(!isActiveStatus)}
              />
              <div
                className={`${
                  isView ? "bg-opacity-50 cursor-not-allowed" : ""
                } block w-12 h-6 rounded-full ${
                  isActiveStatus ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition  ${
                  isActiveStatus
                    ? "left-[12px] transform translate-x-full bg-white-500"
                    : ""
                }`}
              ></div>
            </div>
            <p className="ms-3 font-semibold text-base text-gray-900 dark:text-gray-300">
              {t("settings.consentSetting.dataRetention.active")}
            </p>
          </label>
          <div className="pt-5">
            <h1 className="font-semibold pb-2">
              {/* <span className="text-[red]">* </span>  */}
              {/* {t("Policy Name")} */}
              {/* {("Policy Name")} */}
            </h1>

            <p className="font-semibold text-base">
              <span className="text-[red]">*</span>{" "}
              {t("settings.consentSetting.dataRetention.retentionPolicyName")}
            </p>
            <InputText
              type="text"
              disabled={isView}
              className={`w-full mt-2 h-8 border border-solid border-1 border-[#e5e7eb] rounded-md text-base px-4 ${
                errors.policyName ? "border-red-500" : "border-[#DFE4EA]"
              }"`}
              placeholder={t(
                "settings.consentSetting.dataRetention.retentionPolicyName"
              )}
              value={policyName}
              isError={errors.policyName ? true : false}
              onChange={(e) => setPolicyName(e.target.value)}
            />
            {errors.policyName && (
              <p className="text-red-500 pt-2 text-base">
                {/* {t("roleAndPermission.roleNameError")} */}
                {t("settings.consentSetting.dataRetention.thisFieldIsRequired")}
                {/* {"Please enter a valid information"} */}
              </p>
            )}
          </div>
          <div className="pt-5">
            <p className="font-semibold text-base">
              <span className="text-[red]">*</span>{" "}
              {t("settings.consentSetting.dataRetention.retentionPeriod")}
            </p>
            <p className="text-base mt-1 ml-3">
              {t(
                "settings.consentSetting.dataRetention.retentionPeriodDescription"
              )}
            </p>
            <div className="flex">
              <div className="w-4/12">
                <InputText
                  disabled={isView}
                  className={`w-full mt-2 h-[30px] border border-solid border-1 border-[#e5e7eb] rounded-md text-base px-4 ${
                    errors.retentionDuration
                      ? "border-red-500"
                      : "border-[#DFE4EA]"
                  }"`}
                  placeholder={t(
                    "settings.consentSetting.dataRetention.duration"
                  )}
                  value={retentionDuration}
                  isError={errors.retentionDuration ? true : false}
                  onChange={(e) => setRetentionDuration(e.target.value)}
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
                <Dropdown
                  id="retentionTimeType"
                  title={t("settings.consentSetting.dataRetention.search")}
                  className="w-full mt-2"
                  selectedName={retentionTimeType.label}
                  disabled={isView}
                  isError={errors.retentionTimeType ? true : false}
                  minWidth="10rem"
                  customeHeight={true}
                  customeHeightValue="175px"
                >
                  <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-9px] w-[270px]">
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
                          className={`${
                            retentionTimeType.value === item.value
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
                    {/* {"This field is required"} */}
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
              className="w-full mt-2"
              selectedName={retainDataBasedOn?.label}
              isError={errors.retainDataBasedOn ? true : false}
              minWidth="10rem"
              disabled={isView}
            >
              <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-9px]">
                {retainDataBasedOnOption.map((item) => (
                  <DropdownOption
                    className="h-[2.625rem]"
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
                      className={`${
                        retainDataBasedOn?.value === item.value
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
          <div className="pt-5">
            <p className="font-semibold text-base">
              <span className="text-[red]">*</span>{" "}
              {t("settings.consentSetting.dataRetention.purposes")}
            </p>
            <p className="text-base mt-1 ml-3">
              {t("settings.consentSetting.dataRetention.purposesDescription")}
            </p>

            <div className="mt-2 relative">
              <div className="relative z-10">
                <InputText
                  type="text"
                  isError={errors.purposeStatus ? true : false}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => setIsDropdownOpen(true)}
                  placeholder={t("roleAndPermission.pleaseSelect")}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isView}
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
                        {t("purpose.standardPurpose.preferenceModal.selectAll")}
                      </span>
                    </label>
                  </div>
                  <hr className="w-[96%] mx-auto border-gray-200" />
                  {/* List Items */}
                  {filteredOptions.map((option, index) => (
                    <div key={option.id}>
                      {/* แก้ไข: ใส่ onClick ที่ label, เอา onChange ออกจาก CheckBox */}
                      <label
                        onClick={() => toggleSelect(option)} // <--- ใส่ onClick ที่นี่
                        className={`flex items-center space-x-4 px-4 py-2 cursor-pointer hover:bg-gray-100 
                                  ${
                                    index !== filteredOptions.length - 1
                                      ? ""
                                      : ""
                                  }`}
                      >
                        <CheckBox
                          shape="square"
                          checked={isSelected(option.id)}
                          // onChange={() => toggleSelect(option)} // <--- เอา onChange ออก
                        />
                        <span className="text-gray-900 truncate w-[320px]">
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
              <div className="mt-4  gap-2 w-full relative">
                {selectValue.map((item) => (
                  <div
                    key={item.id}
                    className={`${
                      item?.bgColor ? item?.bgColor : "bg-blue-100"
                    } px-3 my-2 py-2 text-blue-600 rounded-md text-base flex items-center gap-2`}
                  >
                    {item.label}
                    {!isView && (
                      <button
                        onClick={() => removeTag(item.id)}
                        className="text-gray-600 hover:text-gray-600 absolute right-2"
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* THIS OLD MULTI SELECT */}
            {/* <MultipleSelect
              customVerticalAlign={true}
              onSearch={(e) => setQueryPurpostStatus(e.target.value)}
              search
              className="h-auto w-full mt-2 text-base"
              height="h-auto"
              width="w-full"
              placeholder={t("settings.consentSetting.dataRetention.search")}
              value={selectedValuesPurpostStatus}
              isError={errors.purposeStatus ? true : false}
              onClose={() => setQueryPurpostStatus("")}
            >
              <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-60px] w-[434px]">
                {filterValuePurpostStatus.map((item) => (
                  <MutipleSelectOption
                    key={item.value}
                    selected={item.selected}
                    onChange={() => onItemChangePurpostStatus(item.value)}
                    className="top-[-100px]"
                  >
                    <p className="text-base">
                      {item.label}
                      <br />
                    </p>
                  </MutipleSelectOption>
                ))}
              </div>
            </MultipleSelect> */}
            {errors.purposeStatus && (
              <p className="text-red-500 pt-2 text-base">
                {t("settings.consentSetting.dataRetention.thisFieldIsRequired")}
              </p>
            )}
          </div>
          {/* <div className="pt-5">
            <p className="font-medium text-base">
              {t("settings.consentSetting.dataRetention.consentTouchPoints")}
            </p>
            <p className="text-base mt-1">
              {t(
                "settings.consentSetting.dataRetention.consentTouchPointsDescription"
              )}
            </p>
            <MultipleSelect
              customVerticalAlign={true}
              onSearch={(e) => setQueryInterfaceReference(e.target.value)}
              search
              className="h-auto w-full mt-2 text-base"
              height="h-auto"
              width="w-full"
              placeholder={t("settings.consentSetting.dataRetention.search")}
              value={selectedValuesInterfaceReference}
              onClose={() => setQueryInterfaceReference("")}
            >
              <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-60px] w-[434px]">
                {filterValueInterfaceReference.map((item) => (
                  <MutipleSelectOption
                    key={item.value}
                    selected={item.selected}
                    onChange={() => onItemChangeInterfaceReference(item.value)}
                    className="top-[-100px]"
                  >
                    <p className="text-base">{item.label}</p>
                  </MutipleSelectOption>
                ))}
              </div>
            </MultipleSelect>
          </div> */}
          {/* <div className="pt-5">
            <p className="font-semibold text-base">
              {t("settings.consentSetting.dataRetention.retainReceiptsBasedOn")}
            </p>
            <p className="text-base mt-1">
              {t(
                "settings.consentSetting.dataRetention.retainReceiptsBasedOnDescription"
              )}
            </p>
            {/* <Select
                            className="text-base mt-2 "
                            isSearchable
                            isMulti
                            closeMenuOnSelect={false}
                            placeholder={t("settings.consentSetting.dataRetention.search")}
                            value={consentStatus}
                            // styles={colourStyles}
                            onChange={(selectedOptions) => {
                                const values = selectedOptions ? selectedOptions.map(option => ({ value: option.value, label: option.label })) : [];
                                setConsentStatus(values);
                            }}
                            options={consentStatusOptions}
                        /> 
            <MultipleSelect
              customVerticalAlign={true}
              onSearch={(e) => setQueryConsentStatus(e.target.value)}
              search
              className="h-auto w-full mt-2 text-base"
              height="h-auto"
              width="w-full"
              placeholder={t("settings.consentSetting.dataRetention.search")}
              value={selectedValuesConsentStatus}
              onClose={() => setQueryConsentStatus("")}
            >
              <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg top-[-60px] w-[434px]">
                {filterValueConsentStatus.map((item) => (
                  <MutipleSelectOption
                    key={item.value}
                    selected={item.selected}
                    onChange={() => onItemChangeConsentStatus(item.value)}
                    className="top-[-100px]"
                  >
                    <p className="text-base">{item.label}</p>
                  </MutipleSelectOption>
                ))}
              </div>
            </MultipleSelect>
          </div> */}
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
                      className={`w-3 h-3 shrink-0 transition-transform ${
                        openAdvancedOptionAccordion ? "rotate-180" : ""
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
                      htmlFor="toggle3"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="relative">
                        <input
                          id="toggle3"
                          type="checkbox"
                          className="sr-only"
                          disabled={isView}
                          checked={isAnonymizeRecord}
                          onChange={() =>
                            setIsAnonymizeRecord(!isAnonymizeRecord)
                          }
                        />
                        <div
                          className={`${
                            isView ? "bg-opacity-50 cursor-not-allowed" : ""
                          } block w-12 h-6 rounded-full ${
                            isAnonymizeRecord ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={` dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition  ${
                            isAnonymizeRecord
                              ? "left-[12px] transform translate-x-full bg-white-500"
                              : ""
                          }`}
                        ></div>
                      </div>
                      <p className="pl-3 font-medium text-base">
                        {t(
                          "settings.consentSetting.dataRetention.anonymizyRecords"
                        )}
                      </p>
                    </label>
                    <div className="relative ml-16">
                      <p className="text-base mt-1">
                        {t(
                          "settings.consentSetting.dataRetention.anonymizyRecordsDescription"
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
            <Button
              className="bg-white text-black border border-1 border-[gainsboro] text-base px-4 py-2 rounded-md mt-5"
              onClick={toggleMenuSubjectReceiptRetention}
            >
              {t("modal.cancel")}
            </Button>
            {!isView && (
              <Button
                className="ml-1 bg-[#3758F9] text-white text-base px-4 py-2 rounded-md mt-5"
                onClick={handleSubmit}
              >
                {t("submit")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectReceiptRetention;
