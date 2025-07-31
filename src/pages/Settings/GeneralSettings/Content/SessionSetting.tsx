import { useState, useEffect } from "react";
import Select from "react-select";
import { AppSession } from "../../../../interface/generalSetting.interface";
import {
  updateAppSession,
  getAppSession,
} from "../../../../services/sessionSettingService";
import { useTranslation } from "react-i18next";
import notify from "../../../../utils/notification";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import {
  Dropdown,
  DropdownOption,
  InputText,
  Toggle,
  Button,
} from "../../../../components/CustomComponent";
import { getUserInfo } from "../../../../services/authenticationService";

const SessionSetting = () => {
  const confirm = useConfirm();
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const [appSessionData, setAppSessionData] = useState<AppSession | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { t, i18n } = useTranslation();
  const sessionType = [
    {
      value: "Hour",
      label: t("generalSetting.sessionSetting.sessionTimeout.type.hour"),
    },
    {
      value: "Minute",
      label: t("generalSetting.sessionSetting.sessionTimeout.type.minute"),
    },
  ];
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getAppSession(currentUser.customer_id);
        setAppSessionData(response.data as AppSession);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    if (currentUser.customer_id) {
      fetchSession();
    }
  }, [currentUser.customer_id]);

  useEffect(() => {
    if (appSessionData) {
      if (appSessionData?.sessionTimeoutDuration !== undefined) {
        setInputValue(appSessionData.sessionTimeoutDuration.toString());
      }
      setSelectedOption({
        value: appSessionData.sessionTimeoutTimeType,
        label:
          appSessionData.sessionTimeoutTimeType === "Hour"
            ? t("generalSetting.sessionSetting.sessionTimeout.type.hour")
            : t("generalSetting.sessionSetting.sessionTimeout.type.minute"),
      });
    }
  }, [appSessionData, i18n]);

  const setError = () => {
    let errorText = t("generalSetting.sessionSetting.sessionTimeout.error");
    notify.error(errorText);
  };

  const handleSave = async () => {
    if (!appSessionData) return;
    let duration = appSessionData.sessionTimeoutDuration;
    if (appSessionData.sessionTimeoutTimeType === "Hour") {
      if (duration > 24 || duration < 0) {
        setError();
        return;
      }
    } else {
      if (duration > 1440 || duration < 5) {
        setError();
        return;
      }
    }
    openConfirmModal();
  };

  const openConfirmModal = () => {
    confirm({
      modalType: ModalType.Save,
      onConfirm: async () => {
        setLoading(true);
        if (appSessionData) {
          setAppSessionData((prev) =>
            prev
              ? {
                ...prev,
                modifiedBy: currentUser.user_account_id,
                modifiedDate: dayjs().format(),
              }
              : null
          );
          await updateAppSession(appSessionData);
          await getUserInfo();
          setAppSessionData(appSessionData);
        }
        setLoading(false);
      },
    });
  };

  const customSelectStyles = {
    option: (provided: any) => ({
      ...provided,
      textAlign: "left",
    }),
    menu: (provided: any) => ({
      ...provided,
      textAlign: "left",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      textAlign: "left",
    }),
  };

  const handleSet = (newValue: string) => {
    setInputValue(newValue);
    let min = 1,
      max = 1440;

    if (newValue === "") {
      if (selectedOption?.value === "Hour") {
        setInputValue("1");
        setAppSessionData((prev) =>
          prev ? { ...prev, sessionTimeoutDuration: 1 } : null
        );
      } else if (selectedOption?.value === "Minute") {
        setInputValue("5");
        setAppSessionData((prev) =>
          prev ? { ...prev, sessionTimeoutDuration: 5 } : null
        );
      }
      return;
    }

    const numValue = parseInt(newValue, 10);
    if (isNaN(numValue)) return;



    if (selectedOption?.value === "Hour") {
      max = 24;
    } else if (selectedOption?.value === "Minute") {
      min = 5;
    }

    const clampedValue = Math.min(Math.max(numValue, min), max);
    setAppSessionData((prev) =>
      prev ? { ...prev, sessionTimeoutDuration: clampedValue } : null
    );
  };

  return (
    <>
      <div className="h-[50vh]">
        {/* Header */}
        <div className="flex pb-2 border-b border-solid border-1">
          <div className="w-9/12">
            <h2 className="text-xl font-semibold">
              {t("generalSetting.sessionSetting.sessionSetting")}
            </h2>
            <p className="text-base">
              {t("generalSetting.sessionSetting.description")}
            </p>
          </div>
          <div className="w-3/12 text-right">
            {permissionPage.isUpdate && (
              <Button
                onClick={() => handleSave()}
                disabled={!permissionPage.isUpdate}
                className="text-white text-base"
                variant="contained"
              >
                {t("generalSetting.sessionSetting.saveandupdate")}
              </Button>
            )}
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Session Timeout Input */}
            <div className="flex mt-5 border border-1 border-solid rounded-tl-md rounded-tr-md">
              <div className="w-full sm:w-3/12 min-w-[120px] max-w-[250px] m-auto p-3 text-right flex flex-wrap justify-end content-center">
                <InputText
                  id="numbers"
                  type="number"
                  minWidth="85px"
                  className="w-full mr-2 min-w-[20px] max-w-[85px] text-base"
                  value={inputValue}
                  disabled={!permissionPage.isUpdate}
                  onChange={(e) => handleSet(e.target.value)}
                />
                <Dropdown
                  id="status"
                  className="w-full mr-2 sm:w-[110px] text-base"
                  minWidth="110px"
                  selectedName={selectedOption?.label}
                  disabled={!permissionPage.isUpdate}
                >
                  {sessionType.map((item) => (
                    <DropdownOption
                      onClick={() => {
                        setSelectedOption(item);
                        setAppSessionData((prev) =>
                          prev
                            ? { ...prev, sessionTimeoutTimeType: item.value }
                            : null
                        );
                        setAppSessionData((prev) =>
                          prev
                            ? {
                              ...prev,
                              sessionTimeoutDuration:
                                item.value == "Hour" ? 1 : 5,
                            }
                            : null
                        );
                      }}
                      key={item.value}
                    >
                      <span>{item.label}</span>
                    </DropdownOption>
                  ))}
                </Dropdown>
              </div>
              <div className="w-10/12 p-4">
                <p className="text-base font-semibold">
                  {t("generalSetting.sessionSetting.sessionTimeout.title")}
                </p>
                <p className="text-base">
                  {t(
                    "generalSetting.sessionSetting.sessionTimeout.description"
                  )}
                </p>
              </div>
            </div>

            {/* Session Protection Toggle */}
            <div className="flex mb-5 border-b border-x border-t-0 border-solid rounded-bl-md rounded-br-md">
              <div className="w-full sm:w-3/12 min-w-[100px] max-w-[250px] m-auto p-3 text-right flex flex-wrap justify-end content-center">
                <label
                  htmlFor="sessionProtection"
                  className="flex items-center cursor-pointer"
                >
                  <Toggle
                    // id="sessionProtection"
                    checked={appSessionData?.enableSessionProtection ?? false}
                    disabled={!permissionPage.isUpdate}
                    onChange={() => {
                      setAppSessionData((prev) =>
                        prev
                          ? {
                            ...prev,
                            enableSessionProtection:
                              !prev.enableSessionProtection,
                          }
                          : null
                      );
                    }}
                  />
                </label>
              </div>
              <div className="w-10/12 p-4">
                <p className="text-base font-semibold">
                  {t(
                    "generalSetting.sessionSetting.enableSessionProtection.title"
                  )}
                </p>
                <p className="text-base">
                  {t(
                    "generalSetting.sessionSetting.enableSessionProtection.description"
                  )}
                </p>
              </div>
            </div>

            {/* Remember Last logind Organization */}
            {/* <div className="flex border border-solid rounded-bl-md rounded-br-md">
        <div className="w-2/12"></div>
        <div className="w-1/12 my-auto">
          <label htmlFor="enableRememberLastOrganization" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                id="enableRememberLastOrganization"
                type="checkbox"
                className="sr-only"
                checked={appSessionData?.enableRememberLastOrganization ?? false}
                onChange={() =>
                  setAppSessionData((prev) =>
                    prev ? { ...prev, enableRememberLastOrganization: !prev.enableRememberLastOrganization } : null
                  )
                }
              />
              <div
                className={`block w-12 h-6 rounded-full ${appSessionData?.enableRememberLastOrganization ? "bg-blue-500" : "bg-gray-300"
                  }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${appSessionData?.enableRememberLastOrganization ? "left-[12px] transform translate-x-full" : ""
                  }`}
              ></div>
            </div>
          </label>
        </div>
        <div className="w-10/12 p-4">
          <p className="text-md">{t("generalSetting.sessionSetting.rememberLastLoggedIn.title")}</p>
          <p className="font-light text-xs">
            {t("generalSetting.sessionSetting.rememberLastLoggedIn.description")}
          </p>
        </div>
      </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default SessionSetting;
