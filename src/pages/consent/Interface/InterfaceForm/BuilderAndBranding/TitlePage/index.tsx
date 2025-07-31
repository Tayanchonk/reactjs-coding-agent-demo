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
import { setTitlePage } from "../../../../../../store/slices/previewTitlePageSlice";
import { useDispatch } from "react-redux";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";
import { PiUploadSimpleBold } from "react-icons/pi";
import notification from "../../../../../../utils/notification";
import Logo from "../../../../../../assets/no-image.jpeg";
interface FontSize {
  value: string;
  label: string;
}
interface HeaderAndFooterProps {
  setOpenScreenTitlePage: (open: boolean) => void;
  mode: string;
}

const TitlePage: React.FC<HeaderAndFooterProps> = ({
  setOpenScreenTitlePage,
  mode,
}) => {
  // ------------- STATE -----------------
  const { t, i18n } = useTranslation();
 
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const language = useSelector((state: RootState) => state.language.language);
  const titlePage = useSelector(
    (state: RootState) => state.previewTitlePage.titlePage
  );
  const [openHeaderAccordion, setOpenHeaderAccordion] = useState<boolean>(true);
  // const [openFooterAccordion, setOpenFooterAccordion] = useState<boolean>(true);
  const [showTitle, setShowTitle] = useState<boolean>(titlePage.showTitle || false); // ใช้ค่าเริ่มต้นจาก Redux store

  const [fontColor, setFontColor] = useState<string>(titlePage.fontColor || "#000");
  const [bgColor, setBgColor] = useState<string>(titlePage.backgroundColor || "#000");
  const [fontSize, setFontSize] = useState<FontSize>({
    value: titlePage.fontSize || "12px",
    label: titlePage.fontSize || "12px",
  });
  const [pageTitle, setPageTitle] = useState<string>(titlePage.pageTitle || "Metro Systems");
  const [bgType, setBgType] = useState<string>(titlePage.backgroundType || "Color");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [images, setImages] = useState(
    titlePage.backgroundImg || ""
  );

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
    setOpenHeaderAccordion(!openHeaderAccordion);
  };

  // const toggleFooterAccordion = () => {
  //   setOpenFooterAccordion(!openFooterAccordion);
  // };

  // const triggerFileInput = (typeImg: string) => {
  //   document.getElementById(typeImg)?.click();
  // };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (pageTitle === "") {
      newErrors.pageTitle = true;
    }

    if (bgType === "") {
      newErrors.bgType = true;
    }

    if (bgType === "Image" && images === "") {
      newErrors.image = true
    }
    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const triggerFileInput = (typeImg: string) => {
    document.getElementById(typeImg)?.click();
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    typeImg: string
  ) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];

    if (file) {

      const maxFileSize = 3 * 1024 * 1024; // 3 MB
      if (file.size > maxFileSize) {
        notification.error(t('builderAndBranding.title.maxFileSizeError')); // แจ้งเตือนเมื่อไฟล์ใหญ่เกินไป
        fileInput.value = ""; // Reset input
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          if (img.width <= 1200 && img.height <= 460) {
            setImages(reader.result as string);

          } else {
            // alert("ขนาดรูปต้องไม่เกิน 120x80px");
            notification.error(t('builderAndBranding.title.maxImageUpdate'))
          }
          // ✅ Reset input เพื่อให้สามารถอัปโหลดรูปเดิมได้อีกรอบ
          fileInput.value = "";
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (validate()) {
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          dispatch(setTitlePage({
            showTitle: showTitle,
            pageTitle: pageTitle,
            fontSize: fontSize.value,
            fontColor: fontColor,
            backgroundColor: bgType === "Color" ? bgColor : "",
            backgroundType: bgType,
            backgroundImg: images,
          }));
          setOpenScreenTitlePage(false);
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

  const deleteImage = () => {

    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        setImages("");
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
          onClick={() => setOpenScreenTitlePage(false)}
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
          <p className="font-semibold text-base text-[#3758F9]">{t('builderAndBranding.titlePage')}</p>
        </div>

        <div className="w-3/12 pt-[8px] text-right"></div>
      </div>
      <div>
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
            <div className="bg-[#E2E8F0] flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold">
              <span>{t('builderAndBranding.title.title')}</span>
            </div>
          </h2>
          <div>
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div className="pb-2">
                <Toggle
                  disabled={mode === 'view'}
                  checked={showTitle}
                  onChange={() => {
                    setShowTitle(!showTitle);
                    // dispatch(setHeaderShow({ show: !showHeader }));
                  }}
                />
                <span className="ms-3 text-base font-semibold">{t('builderAndBranding.title.showTitle')}</span>
              </div>
              {showTitle && (
                <>
                  <div className="pb-2">
                    <p className=" py-2 text-base font-semibold">
                      <span className="text-[red]">* </span> {t('builderAndBranding.title.pageTitle')}
                    </p>
                    <InputText isError={errors.pageTitle} placeholder="Metro Systems" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} disabled={mode === "view"} />
                    {errors.pageTitle && (
                      <p className="text-[red] text-base pt-1">
                        {t('thisfieldisrequired')}
                      </p>
                    )}
                  </div>
                  <div className="flex">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">{t('builderAndBranding.title.fontSize')}</p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <Dropdown selectedName={fontSize.label} className="w-full" id="ddlFontSize" disabled={mode === "view"}>
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
                  <div className="flex pt-3">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">{t('builderAndBranding.title.fontColor')}</p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <ColorPicker
                        hideInput={true}
                        squre={true}
                        disabled={mode === "view"}
                        value={fontColor}
                        onChange={(value) => setFontColor(value)}
                      />
                    </div>
                  </div>
                  <div className="p-5 border border-1 rounded my-5">
                    <div className="pb-2">
                      <p className=" py-2 text-base font-semibold">
                        <span className="text-[red]">* </span> {t('builderAndBranding.title.background')}
                      </p>
                      <Dropdown
                        className="w-full"
                        id="ddlColor"
                        selectedName={bgType}
                        isError={errors.bgType}
                        disabled={mode === "view"}
                      // onChange={(value:any) => setBgType(value)}
                      >
                        <DropdownOption className="h-[2.625rem] w-full text-base" onClick={() => {
                          setBgType("Color")
                          setImages("")
                        }}>
                          <span>{t('builderAndBranding.title.color')}</span>
                        </DropdownOption>
                        <DropdownOption className="h-[2.625rem] w-full text-base" onClick={() => setBgType("Image")}>
                          <span>{t('builderAndBranding.title.image')}</span>
                        </DropdownOption>
                        {/* <DropdownOption className="h-[2.625rem] w-full text-base" onClick={() => setBgType("Background Image")}>
                      <span>Background Image</span>
                    </DropdownOption> */}
                      </Dropdown>
                    </div>
                    {
                      bgType === "Image" ? (
                        <>
                          <div className={`flex border border-1 p-2 rounded-md mb-2 ${errors.image && `border-[red]`}`}>
                            <div className="w-6/12">
                              <div className=" p-2 rounded-md mr-3">
                                <img
                                  src={images ? images : Logo}
                                  alt="logo"
                                  className=" bg-[#F7F7F7] p-3 rounded-md"
                                />
                              </div>
                            </div>

                            <div className=" my-auto mx-0  w-7/12">
                              <div className="flex">
                                <div className="mr-2">
                                  <input
                                    type="file"
                                    id="logo"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, "logo")}
                                  />
                                  <button
                                    className="flex rounded-[6px] bg-[#000] py-2 px-4 text-white data-[hover]:bg-gray-500 data-[active]:bg-sky-700 font-semibold border"
                                    onClick={() => triggerFileInput("logo")}
                                    disabled={mode === 'view'}
                                  >
                                    <PiUploadSimpleBold className="pr-1 text-base" />{" "}
                                    {t("interfaceAndBranding.upload")}
                                  </button>
                                </div>
                                <div className="mr-2">
                                  <button
                                    className=" rounded-[6px] bg-[#fff] text-black py-2 px-4 font-semibold border border-[gainsboro]"
                                    onClick={() => deleteImage()}
                                    disabled={mode === 'view' || images === ""}
                                  >
                                    {t("interfaceAndBranding.remove")}
                                  </button>
                                </div>
                              </div>
                              <div className="w-12/12">
                                <p className="text-[10px] font-normal pt-3 text-left">
                                  SVG, PNG, JPG or GIF (MAX. 1200 x 460px)
                                </p>
                              </div>
                            </div>

                          </div>
                          {errors.image && (
                            <p className="text-[red] text-base">
                              {t('thisfieldisrequired')}
                            </p>
                          )}
                        </>

                      ) : <div className="flex pt-3">
                        <div className="w-7/12 m-auto">
                          <p className="text-base">{t('builderAndBranding.title.backgroundColor')}</p>
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
                    }

                  </div>
                </>
              )}

              <div className={`flex pt-5 border-t border-gray-200 ${mode === 'view' && `justify-end`}`}>
                <Button
                  className="w-1/2 bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
                  onClick={() => setOpenScreenTitlePage(false)}
                >
                  {t('builderAndBranding.cancel')}
                </Button>
                {mode === "view" ? null : <Button
                  onClick={handleConfirm}
                  className="w-1/2 ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
                >
                  {t('builderAndBranding.apply')}
                </Button>}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitlePage;
