import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dropdown,
  DropdownOption,
  InputText,
  CheckBox,
} from "../../../../components/CustomComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { setFilter } from "../../../../store/slices/filterReportDataSubjectSlice";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  getConsentReportFieldsList,
  getProfileIdentifierValuesList,
  getStandardPurposeValuesList,
  getStandardPurposeVersionValuesList,
  getInterfaceValuesList,
  getTransactionIdValuesList,
  getInteractionTypeValuesList,
  getInteractionByValuesList,
} from "../../../../services/consentReportService";
import { generateUUID } from "../../../../utils/Utils";
import { getAppDatetimePreference } from "../../../../services/dateandtimeService";

export interface SelectedFilter {
  id: string;
  consentReportFieldId: string;
  fieldCode: string;
  fieldName: string;
  fieldLabel: string;
  dataType: string;
  description: string;
  customerId: string;
  organizationId: string;
  isActiveStatus: boolean;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
  createdByName: string;
  modifiedByName: string;
}
export interface SelectedOperator {
  id: string;
  name: string;
}
const ModalFilter = ({
  openModalFilter,
  setOpenModalFilter,
  org,
}: {
  openModalFilter: boolean;
  setOpenModalFilter: React.Dispatch<React.SetStateAction<boolean>>;
  org: any[];
}) => {
  // ------------------- GLOBAL STATE -------------------
  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = JSON.parse(getUserSession).customer_id;
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const filterReportDataSubject = useSelector(
    (state: any) => state.filterReportDataSubjectSlice.filterItem
  );

  // ------------------- STATE -------------------
  const [oldDataFilter, setOldDataFilter] = useState<SelectedFilter[]>([]); // Store the original data filter

  const [dataFilter, setDataFilter] = useState<SelectedFilter[]>([]);
  const filterTypeDate = [
    {
      id: "1",
      name: "Between",
    },
    {
      id: "2",
      name: "Relative",
    },
  ];
  const filterTypeText = [
    {
      id: "3",
      name: "Equal To",
    },
    {
      id: "4",
      name: "Not Equal To",
    },
  ];

  const filterTypeInteger = [
    {
      id: "5",
      name: "Equal To",
    },
    {
      id: "6",
      name: "Not Equal To",
    },
    {
      id: "7",
      name: "Between",
    },
  ];
  const optionLenghtDate = [
    { id: 1, name: "Last 1 Day", type: "Last", days: 1 },
    { id: 2, name: "Last 7 Days", type: "Last", days: 7 },
    { id: 3, name: "Last 14 Days", type: "Last", days: 14 },
    { id: 4, name: "Last 30 Days", type: "Last", days: 30 },
  ];

  const [optionMuiltiSelect, setOptionsMultiSelect] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>();
  console.log("🚀 ~ selectedFilter:", selectedFilter);

  const [selectedOperator, setSelectedOperator] =
    useState<SelectedOperator | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<
    { id: string; label: string }[]
  >([]);
  const [selectValueDateLength, setSelectValueDateLength] = useState<{
    id: number;
    name: string;
    type: string;
    days: number;
  } | null>(null);
  const [valueBetweenForInteger, setValueBetweenForInteger] = useState({
    value1: null,
    value2: null,
  });
  const [valueEqualForInteger, setValueEqualForInteger] = useState(null);
  const [valueEqualForUUID, setValueEqualForUUID] = useState("");
  const [errorValue, setErrorValue] = useState(false);
  const [formatDate, setFormatDate] = useState("");

  // ------------------- FUNCTION -------------------

  const preferencesOptions = useMemo(() => {
    return optionMuiltiSelect.map((item: any) => {
      return {
        id: item.id,
        label: item.label,
      };
    });
  }, [optionMuiltiSelect]);

  const filteredOptions = useMemo(() => {
    return preferencesOptions.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, preferencesOptions]);

  const toggleSelectAll = () => {
    setSelectValue((prev: any) =>
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
  };

  const removeTag = (id: string) => {
    setSelectValue((prev) => prev.filter((item) => item.id !== id));
  };

  const isSelected = (id: string) =>
    selectValue.some((item: any) => item.id === id);

  const handleConfirm = () => {
    // Debug log for each validation logic

    if (
      selectedFilter === undefined ||
      selectedOperator === null ||
      ((selectedOperator?.name === "Equal To" ||
        selectedOperator?.name === "Not Equal To") &&
        selectedFilter?.dataType === "String" &&
        selectValue.length === 0) ||
      ((selectedOperator?.name === "Equal To" ||
        selectedOperator?.name === "Not Equal To") &&
        selectedFilter?.dataType === "UUID" &&
        valueEqualForUUID === "") ||
      ((selectedOperator?.name === "Equal To" ||
        selectedOperator?.name === "Not Equal To") &&
        selectedFilter?.dataType === "Integer" &&
        (valueEqualForInteger === null || valueEqualForInteger === "")) ||
      (selectedOperator?.name === "Between" &&
        selectedFilter?.dataType === "Integer" &&
        (valueBetweenForInteger.value1 === null ||
          valueBetweenForInteger.value1 === "" ||
          valueBetweenForInteger.value2 === null ||
          valueBetweenForInteger.value2 === "")) ||
      (selectedOperator?.name === "Between" &&
        selectedFilter?.dataType !== "Integer" &&
        (dateRange[0] === null || dateRange[1] === null)) ||
      (selectedOperator?.name === "Relative" &&
        selectedFilter?.dataType === "Date" &&
        selectValueDateLength === null) ||
      (selectedFilter?.dataType === "Date" && selectedOperator?.name === "")
    ) {
      setErrorValue(true);
    } else {
      confirm({
        title: t("roleAndPermission.confirmSave"),
        detail: t("roleAndPermission.descriptionConfirmSave"),
        modalType: ModalType.Save,
        onConfirm: async () => {
          const data = {
            consentReportFieldId: selectedFilter?.consentReportFieldId,
            operator: selectedOperator?.name,
            value:
              selectedOperator?.name === "Between" &&
              selectedFilter?.dataType === "Date"
                ? dateRange.map((date) => {
                    // แปลงวันที่ในรูปแบบที่ถูกต้องพร้อมชดเชย timezone
                    if (!date) return null;

                    // แปลงวันที่เป็น yyyy-MM-dd ที่ถูกต้องโดยใช้ toLocaleDateString
                    const localDate = new Date(date);
                    const year = localDate.getFullYear();
                    const month = String(localDate.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const day = String(localDate.getDate()).padStart(2, "0");
                    return `${year}-${month}-${day}`;
                  })
                : selectedOperator?.name === "Relative" &&
                  selectedFilter?.dataType === "Date"
                ? selectValueDateLength
                : (selectedOperator?.name === "Equal To" ||
                    selectedOperator?.name === "Not Equal To") &&
                  selectedFilter?.dataType !== "UUID" &&
                  selectedFilter?.dataType !== "Integer"
                ? selectValue
                : (selectedOperator?.name === "Equal To" ||
                    selectedOperator?.name === "Not Equal To") &&
                  selectedFilter?.dataType === "UUID"
                ? valueEqualForUUID
                : (selectedOperator?.name === "Equal To" ||
                    selectedOperator?.name === "Not Equal To") &&
                  selectedFilter?.dataType === "Integer"
                ? valueEqualForInteger
                : selectedOperator?.name === "Between" &&
                  selectedFilter?.dataType === "Integer"
                ? valueBetweenForInteger
                : null,
          };
          dispatch(
            setFilter({
              id: generateUUID(),
              filterId: selectedFilter.consentReportFieldId,
              filterCode: selectedFilter.fieldCode,
              filterName: selectedFilter.fieldName,
              filterType: selectedFilter.dataType,
              operator: data.operator,
              filterValue: data.value,
            })
          );
          setOpenModalFilter(false); // Close the modal after confirming
          setSelectedFilter(undefined); // Reset selected filter
          // setSelectedOperator();
          setDateRange([null, null]);
          setSearchQuery("");
          setSelectValue([]);
          setSelectValueDateLength(null);
          setIsDropdownOpen(false);
          setErrorValue(false); // Reset error state
        },
        notify: true,
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    }
  };
  // ------------------- USEEFFECT -------------------
  // ดึงค่าข้อมูลฟิลด์ใส่ใน dropdownตัวที่ 1
  useEffect(() => {
    getConsentReportFieldsList()
      .then((response) => {
        if (response.data.isError === false) {
          setOldDataFilter(
            response?.data?.data.sort((a: SelectedFilter, b: SelectedFilter) =>
              a.fieldName.localeCompare(b.fieldName)
            )
          );
          const getFilterId = filterReportDataSubject.map(
            (item: any) => item.filterId
          );
          const filteredDataFilter = response?.data?.data
            .sort((a: SelectedFilter, b: SelectedFilter) =>
              a.fieldName.localeCompare(b.fieldName)
            )
            .filter(
              (item: any) => !getFilterId.includes(item.consentReportFieldId)
            );
          setDataFilter(filteredDataFilter);
          setSelectedFilter(undefined);

          if (response?.data?.data[0]?.fieldCode === "PROFILE_IDENTIFIER") {
            getProfileIdentifierValuesList(customerId).then((response) => {
              if (response.data.isError === false) {
                const options = response.data.data
                  .map((item: any) => ({
                    id: item.profileIdentifier,
                    label: item.profileIdentifier,
                  }))
                  .sort((a: any, b: any) => a.label.localeCompare(b.label)); // เรียงลำดับตัวอักษร A-Z
                setOptionsMultiSelect(options);
              }
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching consent report fields:", error);
      });
    getAppDatetimePreference(customerId).then((response) => {
      console.log("🚀 ~ .then ~ response:", response);
      if (response.data.isError === false && response.data.data) {
        const formatMap: any = {
          DD: "dd",
          MM: "MM", // เหมือนเดิม
          YYYY: "yyyy",
        };

        // Check if dateFormat exists and has dateFormat property
        const dateFormat = response.data.data.dateFormat;
        if (dateFormat) {
          const mappedDateFormat = dateFormat.replace(
            /DD|MM|YYYY/g,
            (match: any) => formatMap[match]
          );

          // Use the mapped format for DatePicker
          setFormatDate(mappedDateFormat);
        } else {
          // If dateFormat structure is different, just use what we have
          setFormatDate(dateFormat || "");
        }
      }
    });
  }, []);

  useEffect(() => {
    const getFilterId = filterReportDataSubject.map(
      (item: any) => item.filterId
    );
    const filteredDataFilter = oldDataFilter.filter(
      (item) => !getFilterId.includes(item.consentReportFieldId)
    );
    setDataFilter(filteredDataFilter);
    setSelectedFilter(undefined);
  }, [filterReportDataSubject.length]);

  useEffect(() => {
    setSelectedOperator(null);
    setDateRange([null, null]);
    // Reset selected filter type when selected filter changes
    // if (selectedFilter?.dataType === "Date") {
    //   setSelectedOperator(filterTypeDate[0]);
    // } else {
    //   setSelectedOperator(filterTypeText[0]);
    // }
    // setOptionValue
    if (selectedFilter?.fieldCode === "PROFILE_IDENTIFIER") {
      getProfileIdentifierValuesList(customerId).then((response) => {
        if (response.data.isError === false) {
          const options = response.data.data
            .map((item: any) => ({
              id: item.profileIdentifier,
              label: item.profileIdentifier,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label));
          setOptionsMultiSelect(options);
        }
      });
    } else if (selectedFilter?.fieldCode === "STANDARD_PURPOSE") {
      getStandardPurposeValuesList(customerId, org).then((response: any) => {
        if (response.data.isError === false) {
          const options = response.data.data
            .map((item: any) => ({
              id: item.standardPurposeId,
              label: item.standardPurposeName,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label));
          setOptionsMultiSelect(options);
        }
      });
    } else if (selectedFilter?.fieldCode === "PURPOSE_VERSION") {
      setOptionsMultiSelect([]);
    } else if (selectedFilter?.fieldCode === "INTERFACE") {
      getInterfaceValuesList(customerId, org).then((response: any) => {
        if (response.data.isError === false) {
          const options = response.data.data
            .map((item: any) => ({
              id: item.interfaceId,
              label: item.interfaceName,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label));
          setOptionsMultiSelect(options);
        }
      });
    } else if (selectedFilter?.fieldCode === "TRANSACTION_ID") {
      // getTransactionIdValuesList("4a36c412-276d-4b70-a75d-d1203922a9bb").then(
      //   (response: any) => {
      //     if (response.data.isError === false) {
      //       const options = response.data.data.map((item: any) => ({
      //         id: item.transactionId,
      //         label: item.transactionId,
      //       }));
      //       setOptionsMultiSelect(options);
      //     }
      //   }
      // );
      setOptionsMultiSelect([]);
    } else if (selectedFilter?.fieldCode === "INTERACTION_TYPE") {
      getInteractionTypeValuesList(org).then((response: any) => {
        if (response.data.isError === false) {
          if (response.data.data.length === 0) {
            setOptionsMultiSelect([]);
          } else {
            const options = response.data.data
              .map((item: any) => ({
                id: item.interactionTypeId,
                label: item.interactionTypeName,
              }))
              .sort((a: any, b: any) => a.label.localeCompare(b.label));
            setOptionsMultiSelect(options);
          }
        }
      });
    } else if (selectedFilter?.fieldCode === "INTERACTION_BY") {
      getInteractionByValuesList(org).then((response: any) => {
        if (response.data.isError === false) {
          const options = response.data.data
            .map((item: any) => ({
              id: item.interactionById,
              label: item.interactionByName,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label));
          setOptionsMultiSelect(options);
        }
      });
    }
  }, [selectedFilter]);

  useEffect(() => {
    setSelectValue([]); // Reset selectValue when selectedOperator changes
    setSelectValueDateLength(null);
    setIsDropdownOpen(false); // Close dropdown when filter type changes
  }, [selectedOperator]);

  return (
    <>
      {openModalFilter && (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div className="relative p-2 w-full max-w-xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between py-4 px-10 border-b rounded-t dark:border-gray-600 border-gray-200">
                <button
                  className=" text-right flex justify-end absolute w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
                  onClick={() => setOpenModalFilter(false)}
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
                <div>
                  <h3 className="text-xl font-semibold ">
                    {t("reportDataSubjectProfileConsent.filter")}
                  </h3>
                </div>
              </div>

              <div
                className={`py-3 px-10 ${
                  selectValue.length > 4 ? "h-[65vh] overflow-y-auto " : ""
                }`}
              >
                <p className="font-semibold text-base">
                  {t("reportDataSubjectProfileConsent.fieldName")}
                </p>

                <Dropdown
                  id="ddl-filter"
                  customeHeight={true}
                  customInModal={true}
                  customeHeightValue="300px"
                  isError={errorValue && !selectedFilter}
                  className="w-full mt-2 relative" // เพิ่ม relative ที่นี่
                  selectedName={
                    selectedFilter?.fieldName
                      ? t(
                          `reportDataSubjectProfileConsent.${selectedFilter?.fieldName}`
                        )
                      : t("roleAndPermission.pleaseSelect")
                  }
                >
                  <div className=" z-[1000] absolute  bg-white w-full dark:bg-gray-700 dark:border-gray-600">
                    {dataFilter.map((item: any, index: number) => (
                      <DropdownOption
                        key={index}
                        onClick={() => {
                          setSelectedFilter(item);
                        }}
                        className={`${
                          selectedFilter?.fieldName === item.fieldName
                            ? "bg-blue-50 text-blue"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {t(`reportDataSubjectProfileConsent.${item.fieldName}`)}
                      </DropdownOption>
                    ))}
                  </div>
                </Dropdown>
                {errorValue && !selectedFilter && (
                  <p className="text-red-500 text-sm mt-1">
                    {t("thisfieldisrequired")}
                  </p>
                )}
                <p className="font-semibold text-base pt-4">
                  {t("reportDataSubjectProfileConsent.operator")}
                </p>
                <Dropdown
                  id="ddl-operator"
                  isError={errorValue && !selectedOperator?.name}
                  // customeHeight={true}
                  // customeHeight={true}
                  customInModal={true}
                  className="w-full mt-2 relative "
                  selectedName={
                    selectedOperator?.name
                      ? t(
                          `reportDataSubjectProfileConsent.${selectedOperator.name}`
                        )
                      : t("roleAndPermission.pleaseSelect")
                  }
                  //  isError={errors.selectedFieldType}
                >
                  <div className="h-[150px] z-[1000] absolute bg-white w-full dark:bg-gray-700 dark:border-gray-600">
                    {selectedFilter?.dataType === "Date"
                      ? filterTypeDate.map((item) => (
                          <DropdownOption
                            key={item.id}
                            onClick={() => {
                              setSelectedOperator(item);
                            }}
                          >
                            {t(`reportDataSubjectProfileConsent.${item.name}`)}
                          </DropdownOption>
                        ))
                      : selectedFilter?.dataType === "Integer"
                      ? filterTypeInteger.map((item) => (
                          <DropdownOption
                            key={item.id}
                            onClick={() => {
                              setSelectedOperator(item);
                            }}
                          >
                            {t(`reportDataSubjectProfileConsent.${item.name}`)}
                          </DropdownOption>
                        ))
                      : filterTypeText.map((item) => (
                          <DropdownOption
                            key={item.id}
                            onClick={() => {
                              setSelectedOperator(item);
                            }}
                          >
                            {t(`reportDataSubjectProfileConsent.${item.name}`)}
                          </DropdownOption>
                        ))}
                  </div>
                </Dropdown>
                {errorValue && !selectedOperator?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {t("thisfieldisrequired")}
                  </p>
                )}

                {selectedOperator?.name === "Between" &&
                  selectedFilter?.dataType !== "Integer" && (
                    <>
                      <p className="font-semibold text-base pt-4">
                        {t("reportDataSubjectProfileConsent.value")}
                      </p>{" "}
                      <div className="flex flex-col mt-2 mb-4">
                        {" "}
                        <DatePicker
                          selected={startDate}
                          onChange={(update) => {
                            const formattedDates = update.map((date) => {
                              if (!date) return null;

                              // สร้างวันที่ที่มีการชดเชย timezone
                              // กำหนดเวลาเป็น 07:00:00 เพื่อให้เมื่อแปลงเป็น UTC จะได้วันที่ถูกต้อง
                              const correctedDate = new Date(date);
                              correctedDate.setHours(7, 0, 0, 0);
                              return correctedDate;
                            }) as [Date | null, Date | null];
                            setDateRange(formattedDates);
                          }}
                          startDate={startDate}
                          dateFormat={formatDate}
                          endDate={endDate}
                          placeholderText={t(
                            "reportDataSubjectProfileConsent.pleaseSelectStartEndDate"
                          )}
                          selectsRange
                          isClearable
                          className={`w-full border rounded-md p-2 ${
                            errorValue && (!dateRange[0] || !dateRange[1])
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                        />
                        {errorValue && (!dateRange[0] || !dateRange[1]) && (
                          <p className="text-red-500 text-sm mt-1">
                            {t("thisfieldisrequired")}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                {selectedOperator?.name === "Relative" && (
                  <>
                    <p className="font-semibold text-base pt-4">
                      {t("reportDataSubjectProfileConsent.value")}
                    </p>
                    <div className="flex flex-col mt-2 mb-4">
                      <Dropdown
                        id="ddl-optionLenghtDate"
                        customInModal={true}
                        className="w-full mt-2 relative"
                        selectedName={
                          selectValueDateLength?.name ?  t(
                                `reportDataSubjectProfileConsent.${selectValueDateLength.name}`
                              ):
                          t("reportDataSubjectProfileConsent.pleaseSelect")
                        }
                        isError={errorValue && !selectValueDateLength?.name}
                        customeHeight={true}
                        customeHeightValue={"170px"}
                      >
                        <div className=" z-[1000] absolute bg-white w-full dark:bg-gray-700 dark:border-gray-600">
                          {optionLenghtDate.map((item) => (
                            <DropdownOption
                              key={item.id}
                              onClick={() => {
                                // Handle selection logic here
                                setSelectValueDateLength(item);
                              }}
                            >
                              {t(
                                `reportDataSubjectProfileConsent.${item.name}`
                              )}
                            </DropdownOption>
                          ))}
                        </div>
                      </Dropdown>
                      {errorValue && !selectValueDateLength?.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {t("thisfieldisrequired")}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {(selectedOperator?.name === "Equal To" ||
                  selectedOperator?.name === "Not Equal To") &&
                  selectedFilter?.dataType !== "UUID" &&
                  selectedFilter?.dataType !== "Integer" &&
                  selectedFilter && (
                    <>
                      <p className="font-semibold text-base pt-4">
                        {t("reportDataSubjectProfileConsent.value")}
                      </p>
                      <div className="mt-2 relative">
                        <div className="relative z-10">
                          <InputText
                            type="text"
                            isError={errorValue && selectValue.length === 0}
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
                                    selectValue.length ===
                                      filteredOptions.length &&
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
                              <div key={option.id}>
                                {/* แก้ไข: ใส่ onClick ที่ label, เอา onChange ออกจาก CheckBox */}
                                <label
                                  onClick={() => toggleSelect(option)} // <--- ใส่ onClick ที่นี่
                                  className={`flex items-center space-x-4 px-4 py-2 cursor-pointer hover:bg-gray-100 
                      ${index !== filteredOptions.length - 1 ? "" : ""}`}
                                >
                                  <CheckBox
                                    shape="square"
                                    checked={isSelected(option.id)}
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
                        <div className="mt-4 flex flex-wrap gap-2 w-full">
                          {selectValue.map((item) => (
                            <span
                              key={item.id}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-base flex items-center gap-2"
                            >
                              {item.label}
                              <button
                                onClick={() => removeTag(item.id)}
                                className="text-gray-600 hover:text-gray-600"
                              >
                                <FaTimes size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                {(selectedOperator?.name === "Equal To" ||
                  selectedOperator?.name === "Not Equal To") &&
                  selectedFilter?.dataType === "Integer" && (
                    <>
                      <p className="font-semibold text-base pt-4">
                        {t("reportDataSubjectProfileConsent.value")}
                      </p>
                      <InputText
                        type="number"
                        isError={
                          errorValue &&
                          (valueEqualForInteger === null ||
                            valueEqualForInteger === "")
                        }
                        className="mt-2"
                        onChange={(e) => {
                          setValueEqualForInteger(e.target.value);
                        }}
                        value={valueEqualForInteger || ""} // Ensure value is a string
                      />
                      {errorValue &&
                        (valueEqualForInteger === null ||
                          valueEqualForInteger === "") && (
                          <p className="text-red-500 text-sm mt-1">
                            {t("thisfieldisrequired")}
                          </p>
                        )}
                    </>
                  )}
                {selectedOperator?.name === "Between" &&
                  selectedFilter?.dataType === "Integer" && (
                    <>
                      <p className="font-semibold text-base pt-4">
                        {t("reportDataSubjectProfileConsent.value")}
                      </p>
                      <div className="flex items-center">
                        <div>
                          <InputText
                            type="number"
                            isError={
                              errorValue &&
                              (valueBetweenForInteger.value1 === null ||
                                valueBetweenForInteger.value1 === "")
                            }
                            className="mt-2 w-[100px]"
                            minWidth={"100px"}
                            value={valueBetweenForInteger.value1 || ""}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setValueBetweenForInteger((prev) => {
                                const newArray = { ...prev };
                                newArray.value1 = newValue;
                                return newArray;
                              });
                            }}
                          />
                          {errorValue &&
                            (valueBetweenForInteger.value1 === null ||
                              valueBetweenForInteger.value1 === "") && (
                              <p className="text-red-500 text-sm mt-1">
                                {t("thisfieldisrequired")}
                              </p>
                            )}
                        </div>

                        <span className="mx-2 text-gray-500 w-2/12 text-center text-xl">
                          -
                        </span>
                        <div>
                          <InputText
                            type="number"
                            className="mt-2 w-5/12"
                            isError={
                              errorValue &&
                              (valueBetweenForInteger.value2 === null ||
                                valueBetweenForInteger.value2 === "")
                            }
                            minWidth={"100px"}
                            value={valueBetweenForInteger.value2 || ""}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setValueBetweenForInteger((prev) => {
                                const newArray = { ...prev };
                                newArray.value2 = newValue;
                                return newArray;
                              });
                            }}
                          />
                          {errorValue &&
                            (valueBetweenForInteger.value2 === null ||
                              valueBetweenForInteger.value2 === "") && (
                              <p className="text-red-500 text-sm mt-1">
                                {t("thisfieldisrequired")}
                              </p>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                {(selectedOperator?.name === "Equal To" ||
                  selectedOperator?.name === "Not Equal To") &&
                  selectedFilter?.dataType === "UUID" && (
                    <>
                      <p className="font-semibold text-base pt-4">
                        {t("reportDataSubjectProfileConsent.value")}
                      </p>
                      <InputText
                        type="text"
                        isError={errorValue && valueEqualForUUID === ""}
                        className="mt-2"
                        value={valueEqualForUUID}
                        onChange={(e) => setValueEqualForUUID(e.target.value)}
                      />
                      {errorValue && valueEqualForUUID === "" && (
                        <p className="text-red-500 text-sm mt-1">
                          {t("thisfieldisrequired")}
                        </p>
                      )}
                    </>
                  )}
              </div>
              <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <Button
                  className="rounded mx-1 bg-white py-2 px-4 text-base  border border-1 border-gray-200 text-blue font-medium"
                  onClick={() => setOpenModalFilter(!openModalFilter)}
                >
                  {t("roleAndPermission.cancel")}
                </Button>

                <Button
                  className=" rounded ml-1 bg-[#3758F9] py-2 px-4 text-base text-white font-semibold"
                  onClick={() => handleConfirm()}
                >
                  {t("reportDataSubjectProfileConsent.ok")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalFilter;
