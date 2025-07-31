import React, { useState, useEffect } from "react";
import { RootState } from "../../../../../../store";
import {
  Button,
  InputText,
  Toggle,
} from "../../../../../../components/CustomComponent";
import ColorPicker from "../../../../../../components/ColorPicker";
import { PiUploadSimpleBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import Logo from "../../../../../../assets/no-image.jpeg";
import ReactQuill from "react-quill-new";
import { useSelector, useDispatch } from "react-redux";
import {
  setHeaderShow,
  setHeaderBgColor,
  setFooterShow,
  setFooterContent,
  setFooterBackgroundColor,
  setHeaderLogo,
  setHeaderFavicon,
  setHeaderAltLogo,
} from "../../../../../../store/slices/previewHeaderAndFooterSlice";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";
import notification from "../../../../../../utils/notification";


interface HeaderAndFooterProps {
  setOpenScreenHeaderAndFooter: (open: boolean) => void;
  mode: string;
}

const HeaderAndFooter: React.FC<HeaderAndFooterProps> = ({
  setOpenScreenHeaderAndFooter,
  mode
}) => {
  // ------------- STATE -----------------
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const previewHeaderAndFooter = useSelector(
    (state: RootState) => state.previewHeaderAndFooter
  );
  const { t, i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);
  const [openHeaderAccordion, setOpenHeaderAccordion] = useState<boolean>(true);
  const [openFooterAccordion, setOpenFooterAccordion] = useState<boolean>(true);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [bg, setBg] = useState<string>("#000");
  const [bgColorFooter, setBgColorFooter] = useState<string>("#000");
  const [altLogo, setAltLogo] = useState<string>("");

  const [content, setContent] = useState(
    "Copyright 2018 Metro Systems Corporation Public Company Limited | All Rights Reserved"
  );

  const [images, setImages] = useState({
    logo: "",
    favicon: "",
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // ขนาดหัวข้อ
      ["bold", "italic", "underline", "strike"], // ตัวหนา, เอียง, ขีดเส้นใต้, ขีดฆ่า
      [{ color: [] }, { background: [] }], // 🎨 ตัวเลือกสีข้อความและสีพื้นหลัง
      [{ list: "ordered" }, { list: "bullet" }], // รายการตัวเลขและจุด
      // ["link", "image"], // ลิงก์ และรูปภาพ
      // ["clean"], // ล้างการฟอร์แมต
    ],
  };

  const formats = ["header"]; // รองรับเฉพาะ header

  // ------------- FUNCTION -----------------
  const toggleHeaderAccordion = () => {
    setOpenHeaderAccordion(!openHeaderAccordion);
  };

  const toggleFooterAccordion = () => {
    setOpenFooterAccordion(!openFooterAccordion);
  };

  const triggerFileInput = (typeImg: string) => {
    document.getElementById(typeImg)?.click();
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    typeImg: string
  ) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
  
        img.onload = () => {
          if (img.width <= 120 && img.height <= 80) {
            setImages((prevState) => ({
              ...prevState,
              [typeImg]: reader.result as string,
            }));
          } else {
            // alert("ขนาดรูปต้องไม่เกิน 120x80px");
            notification.error(t('builderAndBranding.header.maxImageUpdate'))
          }
          // ✅ Reset input เพื่อให้สามารถอัปโหลดรูปเดิมได้อีกรอบ
          fileInput.value = "";
        };
      };
  
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (typeImg: string) => {

    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        setImages((prevState) => ({
          ...prevState,
          [typeImg]: "",
        }));
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });


  };

  const handleConfirm = () => {

    confirm({
      title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        dispatch(setHeaderShow({ show: showHeader }));
        dispatch(setHeaderBgColor(bg));
        dispatch(setFooterShow({ show: showFooter }));
        dispatch(setFooterContent(content));
        dispatch(setFooterBackgroundColor(bgColorFooter));

        dispatch(setHeaderLogo(images.logo));
        dispatch(setHeaderFavicon(images.favicon));
        dispatch(setHeaderAltLogo(altLogo));
        setOpenScreenHeaderAndFooter(false);
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

  useEffect(() => {
    setShowHeader(previewHeaderAndFooter.header.show);
    setImages({
      logo: previewHeaderAndFooter.header.logo,
      favicon: previewHeaderAndFooter.header.favicon,
    })
    setBgColorFooter(previewHeaderAndFooter.footer.backgroundColor);
    setAltLogo(previewHeaderAndFooter.header.altLogo);
    setBg(previewHeaderAndFooter.header.bgColor);
    setShowFooter(previewHeaderAndFooter.footer.show);
    setContent(previewHeaderAndFooter.footer.footerContent);
  }, [
    previewHeaderAndFooter.header.show,
    previewHeaderAndFooter.header.bgColor,
    previewHeaderAndFooter.footer.show,
    previewHeaderAndFooter.footer.footerContent,
  ]);

  // useEffect(() => {
  //   if (quillRef.current) {
  //     const quillInstance = quillRef.current.getEditor();

  //     // ฟัง event text-change
  //     quillInstance.on("text-change", () => {
  //       setContent(quillInstance.root.innerHTML); // อัปเดต content
  //     });
  //   }
  // }, []);

  return (
    <div className="w-full bg-white pr-4">
      <div className="flex p-4">
        <button
          type="button"
          className="w-1/12 pt-[2px]"
          onClick={() => setOpenScreenHeaderAndFooter(false)}
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
            {t('builderAndBranding.headerAndFooter')}
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
              aria-expanded={openHeaderAccordion}
              aria-controls="accordion-collapse-body-1"
            >
              <span>{t('builderAndBranding.header.header')}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openHeaderAccordion ? "rotate-180" : ""
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
            className={`${openHeaderAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <Toggle
                disabled={mode === 'view'}
                checked={showHeader}
                onChange={() => {
                  setShowHeader(!showHeader);
                  // dispatch(setHeaderShow({ show: !showHeader }));
                }}
              />
              <span className="ms-3 text-base font-semibold">{t('builderAndBranding.header.showHeader')}</span>
              {showHeader ? (
                <div>
                  <div className="flex pt-3">
                    <div className="w-6/12 m-auto">
                      <p className="text-base">{t('builderAndBranding.header.backgroundColor')}</p>
                    </div>
                    <div className="w-6/12 flex justify-end">
                      <ColorPicker
                        hideInput={true}
                        disabled={mode === 'view'}
                        squre={true}
                        value={bg}
                        onChange={(value) => {
                          setBg(value);
                          // dispatch(setHeaderBgColor(value));
                        }}
                      />
                    </div>
                  </div>
                  <p className=" py-2 text-base font-semibold">{t('builderAndBranding.header.logo')}</p>
                  <div className="flex border border-1 p-2 rounded-md mb-4">
                    <div className="w-6/12">
                      <div className=" p-2 rounded-md mr-3">
                        <img
                          src={images.logo ? images.logo : Logo}
                          alt="logo"
                          className="w-[120px] h-[120px] bg-[#F7F7F7] p-3 rounded-md object-contain"
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
                            className={`flex rounded-[6px] bg-[#000] py-2 px-4 text-white data-[hover]:bg-gray-500 data-[active]:bg-sky-700 font-semibold border ${mode !== 'view && `cursor-pointer`'}`}
                            onClick={() => triggerFileInput("logo")}
                            disabled={mode === 'view'}
                          >
                            <PiUploadSimpleBold className="pr-1 text-base" />{" "}
                            {t("interfaceAndBranding.upload")}
                          </button>
                        </div>
                        <div className="mr-2">
                          <button
                            className={`rounded-[6px] bg-[#fff] text-black py-2 px-4 font-semibold border border-[gainsboro] ${mode !== 'view && `cursor-pointer`'}`}
                            onClick={() => handleRemove("logo")}
                            disabled={mode === 'view' || images.logo === ""}
                          >
                            {t("interfaceAndBranding.remove")}
                          </button>
                        </div>
                      </div>
                      <div className="w-12/12">
                        <p className="text-[10px] font-normal pt-3 text-left">
                          SVG, PNG, JPG or GIF (MAX. 120x80px)
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className=" py-2 text-base font-semibold">{t('builderAndBranding.header.favicon')}</p>
                  <div className="flex border border-1 p-2 rounded-md  mb-4">
                    <div className="w-6/12">
                      <div className=" p-2 rounded-md mr-3">
                        <img
                          src={images.favicon ? images.favicon : Logo}
                          alt="favicon"
                          className="w-[120px] h-[120px] bg-[#F7F7F7] p-3 rounded-md object-contain"
                        />
                      </div>
                    </div>

                    <div className=" my-auto mx-0  w-7/12">
                      <div className="flex">
                        <div className="mr-2">
                          <input
                            type="file"
                            id="favicon"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "favicon")}
                          />
                          <button
                            className={`flex rounded-[6px] bg-[#000] py-2 px-4 text-white data-[hover]:bg-gray-500 data-[active]:bg-sky-700 font-semibold border ${mode !== 'view && `cursor-pointer`'}`}
                            onClick={() => triggerFileInput("favicon")}
                            disabled={mode === 'view'}
                          >
                            <PiUploadSimpleBold className="pr-1 text-base" />{" "}
                            {t("interfaceAndBranding.upload")}
                          </button>
                        </div>
                        <div className="mr-2">
                          <button
                                     className={`rounded-[6px] bg-[#fff] text-black py-2 px-4 font-semibold border border-[gainsboro] ${mode !== 'view && `cursor-pointer`'}`}
                            onClick={() => handleRemove("favicon")}
                            disabled={mode === 'view' || images.favicon === ""}
                          >
                            {t("interfaceAndBranding.remove")}
                          </button>
                        </div>
                      </div>
                      <div className="w-12/12">
                        <p className="text-[10px] font-normal pt-3 text-left">
                          SVG, PNG, JPG or GIF (MAX. 120x80px)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pb-2">
                    <p className=" py-2 text-base font-semibold">
                      {t('builderAndBranding.header.altLogoText')}
                    </p>
                    <InputText placeholder="Metro Systems" value={altLogo} disabled={mode ==='view'} onChange={
                      (e) => {
                        setAltLogo(e.target.value);
                      }
                    } />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-2">
            <button
              type="button"
              className="bg-[#E2E8F0] flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
              onClick={toggleFooterAccordion}
              aria-expanded={openFooterAccordion}
              aria-controls="accordion-collapse-body-2"
            >
              <span>{t('builderAndBranding.footer.footer')}</span>
              <svg
                data-accordion-icon
                className={`w-3 h-3 shrink-0 transition-transform ${openFooterAccordion ? "rotate-180" : ""
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
            className={`${openFooterAccordion ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-2"
          >
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <div className=" pb-3">
                <Toggle
                  // disabled={isViewMode}
                  disabled={mode ==='view'}
                  checked={showFooter}
                  onChange={() => {
                    setShowFooter(!showFooter);
                    dispatch(setFooterShow({ show: !showFooter }));
                  }}
                />
                <span className="ms-3 text-base font-semibold">
                  {t('builderAndBranding.footer.showFooter')}
                </span>
              </div>

              {showFooter ? (
                <div>
                  <div className="flex pt-1">
                    <div className="w-7/12 m-auto">
                      <p className="text-base">{t('builderAndBranding.footer.backgroundColor')}</p>
                    </div>
                    <div className="w-5/12 flex justify-end">
                      <ColorPicker
                       disabled={mode ==='view'}
                        hideInput={true}
                        squre={true}
                        value={bgColorFooter}
                        onChange={(value) => setBgColorFooter(value)}
                      />
                    </div>
                  </div>
                  <div className="pb-5">
                    <p className=" py-2 text-base font-semibold">
                      {t('builderAndBranding.footer.footerContent')}
                    </p>
                    <ReactQuill
                      readOnly={mode ==='view'}
                      className="bg-quill-editor"
                      value={content}
                      modules={modules}
                      onChange={
                        (e)=>{  setContent(e);}
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={`flex pt-5 border-t border-gray-200 ${mode === 'view' && `justify-end`}`}>
          <Button
            className={`w-1/2 bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md`}
            onClick={() => setOpenScreenHeaderAndFooter(false)}
          >
            {t('builderAndBranding.cancel')}
          </Button>
          {mode === "view" ? null : (
            <Button
              onClick={handleConfirm}
              className="w-1/2 ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
            >
              {t('builderAndBranding.apply')}
            </Button>
          )}

        </div>
      </div>
    </div>
  );
};

export default HeaderAndFooter;
