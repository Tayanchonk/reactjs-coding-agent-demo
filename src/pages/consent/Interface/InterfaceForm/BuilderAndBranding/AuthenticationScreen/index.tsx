import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import {
  Button,
  Dropdown,
  DropdownOption,
  InputText,
  Toggle,
} from "../../../../../../components/CustomComponent";
import ColorPicker from "../../../../../../components/ColorPicker";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setAuthenticationScreen } from "../../../../../../store/slices/previewAuthenticationScreenSlice";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";



interface FontSize {
  value: string;
  label: string;
}
interface AuthenticationScreenProps {
  setOpenScreenAuthenticationScreen: (open: boolean) => void;
  mode: string;
}

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = ({
  setOpenScreenAuthenticationScreen,
  mode
}) => {
  // ------------- STATE -----------------
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const language = useSelector((state: RootState) => state.language.language);
  const authenticationScreen = useSelector(
    (state: RootState) => state.previewAuthenticationScreen
  );
  const [openVerificationScreenAccordion, setopenVerificationScreenAccordion] = useState<boolean>(true);
  const [openLogoutScreenAccordion, setopenLogoutScreenAccordion] = useState<boolean>(true);

  const [showVerificationScreen, setVerificationScreen] = useState<boolean>(authenticationScreen.authenScreenShow);
  const [verifyTitle, setVerifyTitle] = useState<string>(authenticationScreen.verifyTitle);
  const [verifyDescription, setVerifyDescription] = useState<string>(authenticationScreen.verifyDescription);
  const [verifyLabelButton, setVerifyLabelButton] = useState<string>(authenticationScreen.verifyLabelButton);
  const [fontSize, setFontSize] = useState<any>({
    value: authenticationScreen.verifyFontSize,
    label: authenticationScreen.verifyFontSize,
  });
  const [fontColor, setFontColor] = useState<string>(authenticationScreen.verifyFontColor);

  const [bgColor, setBgColor] = useState<string>(authenticationScreen.verifyBackgroundColor);


  const [showLogoutScreen, setShowLogoutScreen] = useState<boolean>(authenticationScreen.logoutScreenShow);
  const [logoutTitle, setLogoutTitle] = useState<string>(authenticationScreen.logoutTitle);
  const [logoutDescription, setLogoutDescription] = useState<string>(authenticationScreen.logoutDescription);


  const fontSizeValue = [
    { value: "10px", label: "10px" },
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
    { value: "22px", label: "22px" },
    { value: "24px", label: "24px" },
    { value: "26px", label: "26px" },
    { value: "28px", label: "28px" },
    { value: "30px", label: "30px" },
    { value: "32px", label: "32px" },
    { value: "34px", label: "34px" },
  ];

  // ------------- FUNCTION -----------------
  const toggleHeaderAccordion = () => {
    setopenVerificationScreenAccordion(!openVerificationScreenAccordion);
  };

  const toggleLogoutScreenAccordion = () => {
    setopenLogoutScreenAccordion(!openLogoutScreenAccordion);
  };


  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };


  const handleConfirm = () => {


    confirm({
      title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        dispatch(
          setAuthenticationScreen({
            authenScreenShow: showVerificationScreen,
            verifyTitle: verifyTitle,
            verifyDescription: verifyDescription,
            verifyLabelButton: verifyLabelButton,
            verifyFontSize: fontSize.value,
            verifyFontColor: fontColor,
            verifyBackgroundColor: bgColor,
            logoutScreenShow: showLogoutScreen,
            logoutTitle: logoutTitle,
            logoutDescription: logoutDescription,
          })
        )
        setOpenScreenAuthenticationScreen(false);
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });


  };

  // ------------- USEEFFECT -----------------
  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return (
    <div className="w-full bg-white  pr-4">
      <div className="flex p-4">
        <button
          type="button"
          className="w-1/12 pt-[2px]"
          onClick={() => setOpenScreenAuthenticationScreen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <div className="w-8/12 pl-3 my-auto">
          <p className="font-semibold text-base text-[#3758F9]">
            {t("builderAndBranding.AuthenticationScreen")}
          </p>
        </div>
        <div className="w-3/12 pt-[8px] text-right"></div>
      </div>
      <div>
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
            <button
              type="button"
              className="bg-[#E2E8F0] flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
              onClick={toggleHeaderAccordion}
              aria-expanded={openVerificationScreenAccordion}
              aria-controls="accordion-collapse-body-1"
            >
              <span> {t("builderAndBranding.authen.verificationScreen")}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openVerificationScreenAccordion ? "rotate-180" : ""
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
            className={`${openVerificationScreenAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <Toggle
                // disabled={isViewMode}
                disabled={mode === "view"}
                checked={showVerificationScreen}
                onChange={() => setVerificationScreen(!showVerificationScreen)}
              />
              <span className="ms-3 text-base font-semibold">
                {t("builderAndBranding.authen.showAuthenticationScreen")}
              </span>
              {showVerificationScreen ? (
                <div>
                  <div className="pb-2">
                    <p className=" py-2 text-base font-semibold">
                      {" "}
                      {t("builderAndBranding.authen.title")}
                    </p>
                    <InputText placeholder="MCSA - Verification" value={verifyTitle} onChange={(e) => setVerifyTitle(e.target.value)} disabled={mode === "view"} />
                  </div>

                  <div className="pb-2">
                    <p className=" py-2 text-base font-semibold">
                      {t("builderAndBranding.authen.titleDescription")}
                    </p>
                    <InputText placeholder="Please enter your Identifier to verify your identity."
                      value={verifyDescription} onChange={(e) => setVerifyDescription(e.target.value)}
                      disabled={mode === "view"}
                    />
                  </div>
                  <div className="pb-2">
                    <p className=" py-2 text-base font-semibold">
                      {t("builderAndBranding.authen.labelButton")}
                    </p>
                    <InputText placeholder="Send Code"
                      value={verifyLabelButton} onChange={(e) => setVerifyLabelButton(e.target.value)}
                      disabled={mode === "view"}
                    />
                  </div>
                  <div className="flex">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">
                        {" "}
                        {t("builderAndBranding.authen.fontSize")}
                      </p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <Dropdown
                        selectedName={fontSize.label}
                        className="w-[120px]"
                        id='ddlFontSizeverify'
                        disabled={mode === "view"}

                      >
                        {fontSizeValue.map((item, index) => (
                          <DropdownOption

                            className="h-[2.625rem] w-full text-base"
                            selected={fontSize.value === item.value}
                            onClick={() => setFontSize(item)}
                            key={index}
                          >
                            <span
                              className={`${fontSize.value === item.value
                                ? "text-white"
                                : ""
                                }`}
                            >
                              {item.label}
                            </span>
                          </DropdownOption>
                        ))}
                      </Dropdown>
                    </div>
                  </div>
                  <div className="flex pt-1">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">
                        {" "}
                        {t("builderAndBranding.authen.fontColor")}
                      </p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <ColorPicker
                        hideInput={true}
                        squre={true}
                        value={fontColor}
                        onChange={(value) => setFontColor(value)}
                        disabled={mode === "view"}
                      />
                    </div>
                  </div>
                  <div className="flex pt-1">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">
                        {" "}
                        {t("builderAndBranding.authen.backgroundColor")}
                      </p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <ColorPicker
                        hideInput={true}
                        squre={true}
                        value={bgColor}
                        onChange={(value) => setBgColor(value)}
                        disabled={mode === "view"}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* Log out Screen */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-2">
            <button
              type="button"
              className="bg-[#E2E8F0] flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
              onClick={toggleLogoutScreenAccordion}
              aria-expanded={openLogoutScreenAccordion}
              aria-controls="accordion-collapse-body-2"
            >
              <span>{t("builderAndBranding.authen.logoutScreen")}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openLogoutScreenAccordion ? "rotate-180" : ""
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
            id="accordion-collapse-body-2"
            className={`${openLogoutScreenAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-2"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div className=" pb-3">
                <Toggle
                  // disabled={isViewMode}
                  disabled={mode === "view"}
                  checked={showLogoutScreen}
                  onChange={() => setShowLogoutScreen(!showLogoutScreen)}
                />
                <span className="ms-3 text-base font-semibold">
                  {t("builderAndBranding.authen.showLogoutScreen")}
                </span>
              </div>

              {showLogoutScreen ? (
                <div>
                  <div className="pb-2">
                    <p className=" py-2 text-base font-semibold">
                      {" "}
                      {t("builderAndBranding.authen.title")}
                    </p>
                    <InputText placeholder="MCSA - Verification"
                      value={logoutTitle} onChange={(e) => setLogoutTitle(e.target.value)}
                      disabled={mode === "view"}
                    />
                  </div>

                  <div className="pb-2">
                    <p className=" py-2 text-base font-semibold">
                      {t("builderAndBranding.authen.titleDescription")}
                    </p>
                    <InputText placeholder="Please enter your Identifier to verify your identity."
                      value={logoutDescription} onChange={(e) => setLogoutDescription(e.target.value)}
                      disabled={mode === "view"}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={`flex pt-5 border-t border-gray-200 ${mode === 'view' && `justify-end`}`}>
          <Button
            className="w-1/2 bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
            onClick={() => setOpenScreenAuthenticationScreen(false)}
          >
            {t("builderAndBranding.cancel")}
          </Button>
          {mode === 'view' ? null :
            <Button
              onClick={handleConfirm}
              className="w-1/2 ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
            >
              {t("builderAndBranding.apply")}
            </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default AuthenticationScreen;
