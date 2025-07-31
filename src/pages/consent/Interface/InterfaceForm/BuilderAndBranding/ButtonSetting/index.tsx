import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import {
  Button,
  InputText,
  Toggle,
} from "../../../../../../components/CustomComponent";
import ColorPicker from "../../../../../../components/ColorPicker";
import { useTranslation } from "react-i18next";
import { setButtonSettings } from "../../../../../../store/slices/previewButtonSettingsSlice";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";

interface ButtonSettingProps {
  setOpenScreenButtonSettings: (open: boolean) => void;
  mode: string;
}
const ButtonSetting: React.FC<ButtonSettingProps> = ({
  setOpenScreenButtonSettings,
  mode
}) => {
  // ------------- STATE -----------------
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const language = useSelector((state: RootState) => state.language.language);
  const buttonSetting = useSelector(
    (state: RootState) => state.previewButtonSettings
  );

  const [openSubmitButtonAccordion, setOpenSubmitButtonAccordion] =
    useState<boolean>(true);
  const [openCancelButtonAccordion, setOpenCancelButtonAccordion] =
    useState<boolean>(true);
  const [showCancelButton, setShowCancelButton] = useState<boolean>(true);

  const [headerLabelButton, setHeaderLabelButton] = useState<string>(
    buttonSetting.submitLabelButton
  );
  const [headerFontColor, setHeaderFontColor] = useState<string>(
    buttonSetting.submitFontColor
  );
  const [headerBgColor, setHeaderBgColor] = useState<string>(
    buttonSetting.submitBackgroundColor
  );
  const [headerConfirmAlert, setHeaderConfirmAlert] = useState<string>(
    buttonSetting.submitConfirmAlert
  );
  const [cancelLabelButton, setCancelLabelButton] = useState<string>(
    buttonSetting.cancelLabelButton
  );
  const [cancelFontColor, setCancelFontColor] = useState<string>(
    buttonSetting.cancelFontColor
  );
  const [cancelBgColor, setCancelBgColor] = useState<string>(
    buttonSetting.cancelBackgroundColor
  );

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // ------------- FUNCTION -----------------
  const toggleSubmitButtonAccordion = () => {
    setOpenSubmitButtonAccordion(!openSubmitButtonAccordion);
  };

  const toggleCancelButtonAccordion = () => {
    setOpenCancelButtonAccordion(!openCancelButtonAccordion);
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (headerLabelButton === "") {
      newErrors.headerLabelButton = true;
    }

    if (cancelLabelButton === "") {
      newErrors.cancelLabelButton = true;
    }
    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          dispatch(setButtonSettings({
            submitLabelButton: headerLabelButton,
            submitFontColor: headerFontColor,
            submitBackgroundColor: headerBgColor,
            submitConfirmAlert: headerConfirmAlert,
            cancelLabelButtonShow: showCancelButton,
            cancelLabelButton: cancelLabelButton,
            cancelFontColor: cancelFontColor,
            cancelBackgroundColor: cancelBgColor,
          }))
          setOpenScreenButtonSettings(false);
        },
        notify: true,
        onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    } else {
      console.log("Validation failed!");

    }

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
          onClick={() => setOpenScreenButtonSettings(false)}
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
            {t('builderAndBranding.buttonSettings')}
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
              onClick={toggleSubmitButtonAccordion}
              aria-expanded={openSubmitButtonAccordion}
              aria-controls="accordion-collapse-body-1"
            >
              <span>{t('builderAndBranding.button.submitButton')}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openSubmitButtonAccordion ? "rotate-180" : ""
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
            className={`${openSubmitButtonAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div>
                <div className="pb-5">
                  <p className=" py-2 text-base font-semibold">
                    <span className="text-[red]">* </span> {t('builderAndBranding.button.labelButton')}
                  </p>
                  <InputText placeholder="Label Button" value={headerLabelButton}
                    isError={errors.headerLabelButton}
                    onChange={(e) => setHeaderLabelButton(e.target.value)}
                    disabled={mode === "view"}
                  />
                  {errors.headerLabelButton && (
                    <p className="text-[red] text-base pt-1">
                       {t('thisfieldisrequired')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex pt-1">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.button.fontColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={headerFontColor}
                    onChange={(value) => setHeaderFontColor(value)}
                    disabled={mode === "view"}
                  />
                </div>
              </div>
              <div className="flex pt-1">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.button.backgroundColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={headerBgColor}
                    onChange={(value) => setHeaderBgColor(value)}
                    disabled={mode === "view"}
                  />
                </div>
              </div>
              <div className="pb-5">
                <p className=" py-2 text-base font-semibold">
                  {t('builderAndBranding.button.confirmAlert')}
                </p>
                <InputText placeholder="Thank You for your Submission" value={headerConfirmAlert} onChange={
                  (e) => setHeaderConfirmAlert(e.target.value)
                }
                  disabled={mode === "view"}
                />
              </div>
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-2">
            <button
              type="button"
              className="bg-[#E2E8F0] flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
              onClick={toggleCancelButtonAccordion}
              aria-expanded={openCancelButtonAccordion}
              aria-controls="accordion-collapse-body-2"
            >
              <span>{t('builderAndBranding.button.cancelButton')}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openCancelButtonAccordion ? "rotate-180" : ""
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
            className={`${openCancelButtonAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-2"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div className=" pb-3">
                <Toggle
                  disabled={mode === "view"}
                  checked={showCancelButton}
                  onChange={() => setShowCancelButton(!showCancelButton)}
                />
                <span className="ms-3 text-base font-semibold">
                  {t('builderAndBranding.button.showCancelButton')}
                </span>
              </div>

              {showCancelButton ? (
                <div>
                  <div>
                    <div className="pb-5">
                      <p className=" py-2 text-base font-semibold">
                        <span className="text-[red]">* </span>   {t('builderAndBranding.button.labelButton')}
                      </p>
                      <InputText placeholder="Label Button"
                        disabled={mode === "view"}
                        isError={errors.cancelLabelButton}
                        value={cancelLabelButton}
                        onChange={(e) => setCancelLabelButton(e.target.value)}
                      />
                      {errors.cancelLabelButton && (
                        <p className="text-[red] text-base pt-1">
                           {t('thisfieldisrequired')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex pt-1">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">{t('builderAndBranding.button.fontColor')}</p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <ColorPicker
                        hideInput={true}
                        squre={true}
                        value={cancelFontColor}
                        onChange={(value) => setCancelFontColor(value)}
                        disabled={mode === "view"}
                      />
                    </div>
                  </div>
                  <div className="flex pt-1">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">{t('builderAndBranding.button.backgroundColor')}</p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <ColorPicker
                        hideInput={true}
                        squre={true}
                        value={cancelBgColor}
                        onChange={(value) => setCancelBgColor(value)}
                        disabled={mode === "view"}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={`flex pt-5 border-t border-gray-200 ${mode === 'view' && `justify-end`}`}>
          <Button
            className="w-1/2 bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
            onClick={() => setOpenScreenButtonSettings(false)}
          >
            {t('builderAndBranding.cancel')}
          </Button>
          {mode === 'view' ? null :
            <Button
              onClick={handleConfirm}
              className="w-1/2 ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
            >
              {t('builderAndBranding.apply')}
            </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default ButtonSetting;
