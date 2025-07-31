import React, { useState, useEffect } from "react";
import { Input } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import Logo from "../../../assets/mcf-logo.svg";
import DefaultThemeIC from "../../../assets/default-theme-icon.svg";
import CustomThemeIC from "../../../assets/custom-theme-icon.svg";
import { PiUploadSimpleBold } from "react-icons/pi";
import ColorPicker from "../../../components/ColorPicker";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  DetailedInterfaceBranding,
  InterfaceBranding,
} from "../../../interface/interfaceAndBranding.interface";
import {
  getInterfaceBranding,
  updateInterfaceBranding,
} from "../../../services/interfaceAndBrandingService";
import {
  setOpenLoadingFalse,
  setOpenLoadingTrue,
} from "../../../store/slices/loadingSlice";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import { ModalType } from "../../../enum/ModalType";
import {
  setReloadFalse,
  setReloadTrue,
} from "../../../store/slices/reloadSlice";
import InputText from "../../../components/CustomComponent/InputText";
import { Button } from "../../../components/CustomComponent";

const InterfaceAndBranding = () => {
  const { t, i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);
  const dispatch = useDispatch();
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [isOpen, setIsOpen] = useState(false);
  const [branding, setBranding] = useState<DetailedInterfaceBranding | any>({
    appBrandingId: "",
    customerId: "",
    description: "",
    enableOverrideBranding: false,
    logoPicMainPageUrl: "",
    pageTitle: "",
    backgroundColor: "",
    headerBarBGColor: "",
    headerBarTextColor: "",
    mainMenuBGColor: "",
    mainMenuTextColor: "",
    mainMenuHoverColor: "",
    subMenuBGColor: "",
    subMenuTextColor: "",
    subMenuHoverColor: "",
    textColor: "",
    isActiveStatus: false,
    createdDate: "",
    modifiedDate: "",
    createdBy: "",
    modifiedBy: "",
  });

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const handleGetInterfaceBranding = async () => {
    try {
      dispatch(setOpenLoadingTrue());
      const customerId = JSON.parse(
        sessionStorage.getItem("user") as string
      ).customer_id;
      const resp = await getInterfaceBranding(customerId);

      console.log("response", resp.data);
      setBranding(resp.data);
      dispatch(setReloadTrue());
      dispatch(setOpenLoadingFalse());
    } catch (error) {
      console.error("There was an error!", error);
      dispatch(setOpenLoadingFalse());
    }
  };

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    handleGetInterfaceBranding();
  }, []);

  const triggerFileInput = () => {
    console.log("ok");

    document.getElementById("logoPicMainPageUrl")?.click();
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    await handleUpdate();
    setIsOpen(false);
  };

  const handleUpdate = async () => {
    try {
      // dispatch(setOpenLoadingTrue());
      const resp = await updateInterfaceBranding(branding);
      console.log("response", resp.data);

      await handleGetInterfaceBranding();

      // dispatch(setOpenLoadingFalse());
    } catch (error) {
      console.error("There was an error!", error);
      // dispatch(setOpenLoadingFalse());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding((prevState: DetailedInterfaceBranding) => ({
          ...prevState,
          logoPicMainPageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setBranding((prevState: DetailedInterfaceBranding) => ({
      ...prevState,
      logoPicMainPageUrl: "",
    }));
  };

  const handleTheme = (theme: string) => {
    console.log("Theme:", theme);
  };

  return (
    <div className="w-full px-10 bg-white py-7">
      <div className="flex pb-3 border-b border-[gainsboro]">
        <div className="w-9/12">
          <h1 className="text-xl font-semibold">
            {t("interfaceAndBranding.interfaceAndBranding")}
          </h1>
          <p className="text-base">{t("interfaceAndBranding.description")}</p>
        </div>
        <div className="w-3/12 text-base">
          <Button
            className="rounded bg-[#3758F9] py-2 px-4 text-base text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 font-semibold"
            onClick={() => setIsOpen(true)}
          >
            {t("saveandupdate")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row  py-[40px] mt-5 px-7 border-t border-l border-r border-[gainsboro] rounded-tr-md rounded-tl-md">
        <div className="w-full md:w-5/12">
          <h1 className="text-base font-semibold">
            {t("interfaceAndBranding.applicationLogo")}
          </h1>
          <p className="text-base">
            {t("interfaceAndBranding.applicationDescription")}
          </p>
        </div>
        <div className="flex w-7/12 text-right ">
          <div className="bg-[#F7F7F7] p-2 rounded-md mr-3">
            <img
              src={
                branding.logoPicMainPageUrl ? branding.logoPicMainPageUrl : Logo
              }
              alt="logo"
              className="w-[50px] h-[50px]"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="mx-0 my-auto ">
            <div className="flex">
              <div className="mr-2">
                <input
                  type="file"
                  id="logoPicMainPageUrl"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  className="flex rounded-[6px] bg-[#000] py-2 px-4 text-xs text-white data-[hover]:bg-gray-500 data-[active]:bg-sky-700 font-semibold border"
                  onClick={triggerFileInput}
                >
                  <PiUploadSimpleBold className="pr-1 text-base" />{" "}
                  {t("interfaceAndBranding.upload")}
                </button>
              </div>
              <div className="mr-2">
                <button
                  className=" rounded-[6px] bg-[#fff] text-black py-2 px-4 text-xs font-semibold border border-[gainsboro]"
                  onClick={handleRemove}
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
      </div>
      <div className="flex py-[40px] px-7 border-l border-r border-t border-[gainsboro]">
        <div className="w-5/12">
          <h1 className="text-base font-semibold">
            {t("interfaceAndBranding.pageTitle")}
          </h1>
          <p className="text-base">
            {t("interfaceAndBranding.pageTitleDescription")}
          </p>
        </div>
        <div className="w-4/12 mx-0 my-auto text-left">
          {/* <Input
            id="pageTitle"
            name="pageTitle"
            className="border w-[300px] h-[30px] p-2 rounded-md text-[10px]"
            type="text"
            placeholder={t('interfaceAndBranding.name')}
            value={branding.pageTitle}
            onChange={(e) => setBranding((prevState: DetailedInterfaceBranding) => ({
              ...prevState,
              pageTitle: e.target.value
            }
            ))}

          // onClick={() => handleFileUpload}
          // value={branding.logoPicMainPageUrl}
          /> */}
          <InputText
            className="w-[300px]"
            value={branding.pageTitle}
            onChange={(e) =>
              setBranding((prevState: DetailedInterfaceBranding) => ({
                ...prevState,
                pageTitle: e.target.value,
              }))
            }
            placeholder={t("interfaceAndBranding.name")}
          />
        </div>
      </div>
      <div className="flex py-[40px] px-7 border border-[gainsboro] rounded-bl-md rouded-br-md">
        <div className="w-5/12">
          <h1 className="text-base font-semibold">
            {t("interfaceAndBranding.applicationTheme")}
          </h1>
          <p className="text-base">
            {t("interfaceAndBranding.applicationThemeDescription")}
          </p>
        </div>
        <div className="w-7/12 text-right">
          <label className="flex items-center py-3 space-x-2">
            <input
              type="radio"
              name="theme"
              value="default"
              checked={!branding.enableOverrideBranding}
              onChange={() =>
                setBranding((prevState: DetailedInterfaceBranding) => ({
                  ...prevState,
                  enableOverrideBranding: !branding.enableOverrideBranding,
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-base">
              {t("interfaceAndBranding.defaultTheme")}
            </span>
          </label>
          <div className="border-b border-[gainsboro] pb-4 relative">
            <img
              src={DefaultThemeIC}
              className={`ml-5 p-1 ${
                !branding.enableOverrideBranding
                  ? `border-solid border-2 border-blue-500 rounded-md`
                  : ``
              }`}
            />
            {!branding.enableOverrideBranding && (
              <FaCheckCircle className="text-[20px] bottom-[15px] left-[20px] text-blue-500 absolute  m-1" />
            )}
          </div>

          <label className="flex items-center py-3 space-x-2">
            <input
              type="radio"
              name="theme"
              value="custom"
              checked={branding.enableOverrideBranding}
              onChange={() =>
                setBranding((prevState: DetailedInterfaceBranding) => ({
                  ...prevState,
                  enableOverrideBranding: !branding.enableOverrideBranding,
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-base">
              {t("interfaceAndBranding.customTheme")}
            </span>
          </label>
          <div className="border-b border-[gainsboro] pb-4 relative">
            <img
              src={CustomThemeIC}
              className={`ml-5 p-1 ${
                branding.enableOverrideBranding
                  ? `border-solid border-2 border-blue-500 rounded-md`
                  : ``
              }`}
            />
            {branding.enableOverrideBranding && (
              <FaCheckCircle className="text-[20px] bottom-[15px] left-[20px] text-blue-500 absolute  m-1" />
            )}
          </div>
          {branding.enableOverrideBranding && (
            <div className="flex flex-col pt-5 pl-5 text-left lg:flex-row">
              <div className="w-full p-3 border-t border-b border-l lg:w-3/12 sm:border-r rounded-tl-md rounded-bl-md md:rounded-r-sm">
                <h1 className="text-base">Header Bar</h1>
                <div className="font-light text-[13px]">
                  BG Color
                  <ColorPicker
                    value={branding.headerBarBGColor}
                    onChange={(value) =>
                      setBranding((prevState: DetailedInterfaceBranding) => ({
                        ...prevState,
                        headerBarBGColor: value,
                      }))
                    }
                  />
                </div>
                <div className="font-light text-[13px]">
                  Font Color
                  <ColorPicker
                    value={branding.headerBarTextColor}
                    onChange={(value) =>
                      setBranding((prevState: DetailedInterfaceBranding) => ({
                        ...prevState,
                        headerBarTextColor: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-full border lg:w-9/12 rounded-tr-md rounded-br-md">
                <div className="px-3 py-2 border-b">
                  <h1 className="text-base">Main Menu</h1>
                  <div className="flex">
                    <div className="w-4/12 font-light text-[13px] ">
                      BG Color
                      <ColorPicker
                        value={branding.mainMenuBGColor}
                        onChange={(value) =>
                          setBranding(
                            (prevState: DetailedInterfaceBranding) => ({
                              ...prevState,
                              mainMenuBGColor: value,
                            })
                          )
                        }
                      />
                    </div>
                    <div className="w-4/12 font-light text-[13px]">
                      Font Color
                      <ColorPicker
                        value={branding.mainMenuTextColor}
                        onChange={(value) =>
                          setBranding(
                            (prevState: DetailedInterfaceBranding) => ({
                              ...prevState,
                              mainMenuTextColor: value,
                            })
                          )
                        }
                      />
                    </div>
                    <div className="w-4/12 font-light text-[13px]">
                      Active / Hover Color
                      <ColorPicker
                        value={branding.mainMenuHoverColor}
                        onChange={(value) =>
                          setBranding(
                            (prevState: DetailedInterfaceBranding) => ({
                              ...prevState,
                              mainMenuHoverColor: value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <h1 className="text-base">Sub Menu</h1>
                  <div className="flex">
                    <div className="w-4/12 font-light text-[13px]">
                      BG Color
                      <ColorPicker
                        value={branding.subMenuBGColor}
                        onChange={(value) =>
                          setBranding(
                            (prevState: DetailedInterfaceBranding) => ({
                              ...prevState,
                              subMenuBGColor: value,
                            })
                          )
                        }
                      />
                    </div>
                    <div className="w-4/12 font-light text-[13px]">
                      Font Color
                      <ColorPicker
                        value={branding.subMenuTextColor}
                        onChange={(value) =>
                          setBranding(
                            (prevState: DetailedInterfaceBranding) => ({
                              ...prevState,
                              subMenuTextColor: value,
                            })
                          )
                        }
                      />
                    </div>
                    <div className="w-4/12 font-light text-[13px]">
                      Active / Hover Color
                      <ColorPicker
                        value={branding.subMenuHoverColor}
                        onChange={(value) =>
                          setBranding(
                            (prevState: DetailedInterfaceBranding) => ({
                              ...prevState,
                              subMenuHoverColor: value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        modalType={confirmType}
        isOpen={isOpen}
        onClose={onClose}
        title={"Confrim Update"}
        detail={"Are you sure you want to update?"}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
export default InterfaceAndBranding;
