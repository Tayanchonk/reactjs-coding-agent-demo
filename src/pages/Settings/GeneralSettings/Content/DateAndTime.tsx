import { useEffect, useState } from "react";
import {
  getAppDatetimePreference,
  updateAppDatetimePreference,
  getDateFormatList,
  getTimeZone,
} from "../../../../services/dateandtimeService";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { DateTimeSettings } from "../../../../interface/generalSetting.interface";
import { ModalType } from "../../../../enum/ModalType";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import {
  Dropdown,
  DropdownOption,
  InputText,
  Button,
  ComboBox,
  ComboBoxOption,
} from "../../../../components/CustomComponent";

const DateAndTime = () => {
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const getUserSession: any = sessionStorage.getItem("user");
  const userAccountId = JSON.parse(getUserSession).user_account_id;
  const customerId = JSON.parse(getUserSession).customer_id;
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );

  const { t, i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);

  const [dateTimeData, setdateTimeData] = useState<DateTimeSettings>({
    timeZoneName: "",
    dateFormat: "",
    timeFormat: "",
    customerId: "",
    dateFormatId: "",
    modifiedBy: "",
  });

  const [selectedDateFormat, setSelectedDateFormat] = useState<string>("");
  const [selectedTimeFormat, setSelectedTimeFormat] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  const [dateFormatOptions, setDateFormatOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionTimeZone, setOptionTimeZone] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState({
    value: "",
    label: "",
  });
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState(false);

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงค่า datetime preference
        const res1 = await getAppDatetimePreference(customerId);
        setdateTimeData(res1.data.data);
        setSelectedDateFormat(res1.data.data.dateFormat);
        setSelectedTimeFormat({
          value: res1.data.data.timeFormat,
          label:
            res1.data.data.timeFormat === "hh:mm A" ? "12 Hour" : "24 Hour",
        });
        setSelectedTimeZone({
          value: res1.data.data.timeZoneId,
          label: res1.data.data.timeZoneName,
        });
        // ดึงค่า date format list
        const res2 = await getDateFormatList();
        if (Array.isArray(res2.data.data)) {
          const options = res2.data.data.map((format: any) => ({
            value: format.dateFormatId,
            label: format.dateFormat,
          }));
          setDateFormatOptions(options);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    const fetchTimeZone = async () => {
      try {
        const res = await getTimeZone();

        if (res.data && res.data.data) {
          const sortedOptions = res.data.data
            .map((zone: any) => ({
              value: zone.timeZoneId,
              label: zone.timeZoneName,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label)); // Sort by label in ascending order
      
          setOptionTimeZone(sortedOptions);
            
        }
      } catch (error) {
        console.error("Error fetching time zone:", error);
      }
    };

    fetchData();
    fetchTimeZone();
  }, [refreshTrigger]);

  const handleSaveAndUpdate = async () => {

      const updatedData = {
        ...dateTimeData,
        dateFormat: selectedDateFormat,
        dateFormatId: dateFormatOptions.find(
          (option) => option.label === selectedDateFormat
        )?.value,
        timeFormat: selectedTimeFormat.value,
        modifiedBy: userAccountId,
        timeZoneName: selectedTimeZone.label,
        timeZoneId: selectedTimeZone.value,
      };
      openConfirmModal(updatedData);
 
  };

  const openConfirmModal = (updatedData: any) => {
    setConfirmTitle(t("modal.confirmSave"));
    setConfirmDetail(t("modal.descriptionConfirmSave"));
    setConfirmType(ModalType.Save);
    setConfirmAction(() => () => updateDatetime(updatedData));
    setIsConfirmModalOpen(true);
    setConfirmSuccessMessage(
      t("generalSetting.dateAndTime.updatedSuccessfully")
    );
    setConfirmErrorMessage(t("generalSetting.dateAndTime.error"));
  };

  const updateDatetime = async (updatedData: any) => {
    try {
      await updateAppDatetimePreference(updatedData);
      setRefreshTrigger((prev) => !prev);
      const datetimeFormat = JSON.parse(
        localStorage.getItem("datetime") || "{}"
      );
      datetimeFormat.dateFormat = updatedData.dateFormat;
      datetimeFormat.timeFormat = updatedData.timeFormat;
      localStorage.setItem("datetime", JSON.stringify(datetimeFormat));
    } catch (error) {
      console.error("Update Failed:", error);
    }
  };

  const filteredOptions = optionTimeZone.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-[50vh]">
      <div className="flex pb-2 border-b border-solid border-1 ">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold">
            {" "}
            {t("generalSetting.dateAndTime.dateAndTime")}
          </h2>
          <p className="font-light text-base">
            {t("generalSetting.dateAndTime.description")}
          </p>
        </div>
        <div className="w-3/12 text-right">
          {permissionPage.isUpdate && (
            <Button
              onClick={() => handleSaveAndUpdate()}
              disabled={!permissionPage.isUpdate}
              className="text-white text-base font-semibold"
              variant="contained"
            >
              {t("saveandupdate")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex mt-5 border border-1 border-solid rounded-tl-md rounded-tr-md">
        <div className="w-5/12 p-5">
         
          <ComboBox
            id="ddlTimeZone"
            className=" text-base"
            placeholder={t("settings.organizations.create.selectOrgParent")}
            isError={errors}
            minWidth="100%"
            displayName={selectedTimeZone?.label}
            disabled={!permissionPage.isUpdate}
            onChange={(e) => {
              setQuery(e);
            }}
            onClose={() => setQuery("")}
            defaultValue={selectedTimeZone?.label}
          >
            {filteredOptions?.map((option: any, index: number) => (
              <ComboBoxOption
                key={index}
                className={`hover:bg-gray-100 text-base
                ${
                  option.value ===
                    selectedTimeZone.value &&
                  "text-white"
                }
                hover:text-black`}
                disabled={option.isDisabled}
                selected={option.value === selectedTimeZone.value}
                value={option}
                onClick={() => {
                  setSelectedTimeZone(option);
                }}
              >
                <span>{option.label}</span>
              </ComboBoxOption>
            ))}
          </ComboBox>
        </div>

        <div className="w-7/12 p-3 m-auto">
          <p className="text-base font-semibold">
            {t("generalSetting.dateAndTime.timeZone")}
          </p>
          {/* <p className="font-light text-base">
            <span className="text-red-600 text-base">
              {t("generalSetting.dateAndTime.important")}!{" "}
            </span>
            {t("generalSetting.dateAndTime.importantDescription")}
          </p> */}
        </div>
      </div>
      <div className="flex border-l border-r border-1 border-solid">
        <div className="w-5/12 p-5">
          <Dropdown
            id="selectDateFormatList"
            title=""
            className="w-full text-base"
            selectedName={selectedDateFormat}
            disabled={!permissionPage.isUpdate}
          >
            {dateFormatOptions.map((item) => (
              <DropdownOption
                className="h-[2.625rem] text-sm"
                onClick={() => {
                  setSelectedDateFormat(item.value);
                  setSelectedDateFormat(item.label);
                }}
                key={item.value}
              >
                <span>{item.label}</span>
              </DropdownOption>
            ))}
          </Dropdown>
        </div>
        <div className="w-7/12 p-3 m-auto">
          <p className="text-base font-semibold">
            {t("generalSetting.dateAndTime.dateFormat")}
          </p>
        </div>
      </div>
      <div className="flex mb-5 border-t border-l border-r border-b border-1 border-solid rounded-bl-md rounded-br-md">
        <div className="w-5/12 p-5">
          <Dropdown
            id="selectTimeFormatList"
            title=""
            className="w-full text-base"
            selectedName={selectedTimeFormat.label}
            disabled={!permissionPage.isUpdate}
          >
            {[
              { value: "HH:mm", label: "24 Hour" },
              { value: "hh:mm A", label: "12 Hour" },
            ].map((item) => (
              <DropdownOption
                className="h-[2.625rem] text-base"
                onClick={() => {
                  setSelectedTimeFormat(item);
                }}
                key={item.value}
              >
                <span>{item.label}</span>
              </DropdownOption>
            ))}
          </Dropdown>
        </div>
        <div className="w-7/12 p-3 m-auto">
          <p className="text-base font-semibold">
            {t("generalSetting.dateAndTime.timeFormat")}
          </p>
        </div>
      </div>
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
export default DateAndTime;
