import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import {
  Button,
  Dropdown,
  DropdownOption,
} from "../../../../../../components/CustomComponent";
import ColorPicker from "../../../../../../components/ColorPicker";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setThemeSettings } from "../../../../../../store/slices/previewThemeSettingsSlice";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";
interface FontSize {
  value: string;
  label: string;
}
interface ThemeSettingProps {
  setOpenScreenThemeSettings: (open: boolean) => void;
  mode: string;
}

const ThemeSetting: React.FC<ThemeSettingProps> = ({
  setOpenScreenThemeSettings,
  mode
}) => {
  // ------------- STATE -----------------
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const language = useSelector((state: RootState) => state.language.language);
  const themeSettings = useSelector((state: RootState) => state.previewThemeSetting.themeSettings);
  const [openFontAccordion, setOpenFontAccordion] = useState<boolean>(true);
  const [openInputFieldsAccordion, setOpenInputFieldsAccordion] =
    useState<boolean>(true);
  const [openCheckBoxRadioAccordion, setOpenCheckBoxRadioAccordion] =
    useState<boolean>(true);
  const [fontSize, setFontSize] = useState<FontSize>({
    value: themeSettings.fontSize,
    label: themeSettings.fontSize,
  });
  const [fontColor, setFontColor] = useState<string>(themeSettings.fontColor);
  const [placeHolderColor, setPlaceHolderColor] = useState<string>(themeSettings.placeHolderColor);
  const [borderColor, setBorderColor] = useState<string>(themeSettings.borderColor);
  const [backgroundColor, setBackgroundColor] = useState<string>(themeSettings.backgroundColor);
  const [inActiveColor, setInActiveColor] = useState<string>(themeSettings.inActiveColor);
  const [activeColor, setActiveColor] = useState<string>(themeSettings.activeColor);



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
  const toggleFontAccordion = () => {
    setOpenFontAccordion(!openFontAccordion);
  };

  const toggleInputFieldsAccordion = () => {
    setOpenInputFieldsAccordion(!openInputFieldsAccordion);
  };

  const toggleCheckBoxRadioAccordion = () => {
    setOpenCheckBoxRadioAccordion(!openCheckBoxRadioAccordion);
  };

  // const triggerFileInput = (typeImg: string) => {
  //   document.getElementById(typeImg)?.click();
  // };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  // const handleFileUpload = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   typeImg: string
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImages((prevState) => ({
  //         ...prevState,
  //         [typeImg]: reader.result as string,
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleRemove = (typeImg: string) => {
  //   setImages((prevState) => ({
  //     ...prevState,
  //     [typeImg]: "",
  //   }));
  // };

  const handleConfirm = () => {

    confirm({
      title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        dispatch(setThemeSettings(
          {
            fontSize: fontSize.value,
            fontColor: fontColor,
            placeHolderColor: placeHolderColor,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            inActiveColor: inActiveColor,
            activeColor: activeColor,
          }
        ))
        setOpenScreenThemeSettings(false);
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });

  }
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
          onClick={() => setOpenScreenThemeSettings(false)}
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
            {t('builderAndBranding.themeSettings')}
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
              onClick={toggleFontAccordion}
              aria-expanded={openFontAccordion}
              aria-controls="accordion-collapse-body-1"
            >
              <span>{t('builderAndBranding.theme.font')}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openFontAccordion ? "rotate-180" : ""
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
            className={`${openFontAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.theme.fontSize')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <Dropdown selectedName={fontSize.label} className="w-[120px]" id="ddlfontsize" disabled={mode === 'view'}>
                    {fontSizeValue.map((item, index) => (
                      <DropdownOption
                        className="h-[2.625rem] w-full text-base"
                        selected={fontSize.value === item.value}
                        onClick={() => setFontSize(item)}
                        key={item.value}
                      >
                        <span
                          className={`${fontSize.value === item.value ? "text-white" : ""
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
                  <p className="text-base">{t('builderAndBranding.theme.fontColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={fontColor}
                    onChange={(value) => setFontColor(value)}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Input Fields */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-2">
            <button
              type="button"
              className="bg-[#E2E8F0] flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
              onClick={toggleInputFieldsAccordion}
              aria-expanded={openInputFieldsAccordion}
              aria-controls="accordion-collapse-body-2"
            >
              <span>{t('builderAndBranding.theme.inputFields')}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openInputFieldsAccordion ? "rotate-180" : ""
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
            className={`${openInputFieldsAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-2"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              {/* <div className="flex pt-1">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.theme.placeholderColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={placeHolderColor}
                    onChange={(value) => setPlaceHolderColor(value)}
                    disabled={mode === 'view'}
                  />
                </div>
              </div> */}
              <div className="flex pt-1">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.theme.borderColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={borderColor}
                    onChange={(value) => setBorderColor(value)}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>
              <div className="flex pt-1">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.theme.backgroundColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={backgroundColor}
                    onChange={(value) => setBackgroundColor(value)}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* checkbox radio */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-3">
            <button
              type="button"
              className="bg-[#E2E8F0] flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
              onClick={toggleCheckBoxRadioAccordion}
              aria-expanded={openCheckBoxRadioAccordion}
              aria-controls="accordion-collapse-body-3"
            >
              <span>{t('builderAndBranding.theme.checkboxRadio')}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openCheckBoxRadioAccordion ? "rotate-180" : ""
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
            id="accordion-collapse-body-3"
            className={`${openCheckBoxRadioAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-3"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex pt-1">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.theme.inActiveColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={inActiveColor}
                    onChange={(value) => setInActiveColor(value)}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>
              <div className="flex pt-1">
                <div className="w-7/12 m-auto">
                  <p className="text-base">{t('builderAndBranding.theme.activeColor')}</p>
                </div>
                <div className="w-5/12 flex justify-end">
                  <ColorPicker
                    hideInput={true}
                    squre={true}
                    value={activeColor}
                    onChange={(value) => setActiveColor(value)}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex pt-5 border-t border-gray-200 ${mode === 'view' && `justify-end`}`}>
          <Button
            className="w-1/2 bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
            onClick={() => setOpenScreenThemeSettings(false)}
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

export default ThemeSetting;
