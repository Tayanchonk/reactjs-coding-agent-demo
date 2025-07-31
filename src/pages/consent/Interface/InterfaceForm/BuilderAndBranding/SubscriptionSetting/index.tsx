import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import {
  Button,
  Dropdown,
  DropdownOption,
  InputText,
  Tag,
  TextArea,
  Toggle,
} from "../../../../../../components/CustomComponent";
import ColorPicker from "../../../../../../components/ColorPicker";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setSubscriptionSettings } from "../../../../../../store/slices/previewSubscriptionSettingsSlice";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";
import notification from "../../../../../../utils/notification";
import { LiaTimesSolid } from "react-icons/lia";
import { getConsentReason } from "../../../../../../services/consentSettingService";

interface FontSize {
  value: string;
  label: string;
}
interface SubscriptionSettingProps {
  setOpenScreenSubscriptionSetting: (open: boolean) => void;
  mode: string;
}

const SubscriptionSetting: React.FC<SubscriptionSettingProps> = ({
  setOpenScreenSubscriptionSetting,
  mode
}) => {
  // ------------- STATE -----------------
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const subScriptionSettings = useSelector(
    (state: RootState) => state.previewSubscriptionSettings
  );


  const getCustomerId = sessionStorage.getItem("user") || "";


  const language = useSelector((state: RootState) => state.language.language);

  const [showSubscriptionSetting, setShowSubscriptionSetting] =
    useState<boolean>(
      subScriptionSettings.subScriptionSettingsShow
    );
  const [showSubScribe, setShowSubScribe] = useState<boolean>(
    subScriptionSettings.subScribeAllShow
  );
  const [showUnSubScribe, setShowUnSubScribe] = useState<boolean>(
    subScriptionSettings.unSubscribeAllShow
  );
  const [showUnSubScribeReason, setShowUnSubScribeReason] =
    useState<boolean>(
      mode === "create" ? false :
      subScriptionSettings.unSubscribeReasonShow
    );
    

  const [required, setRequired] = useState<boolean>(false);

  const [fontColor, setFontColor] = useState<string>(
    subScriptionSettings.unSubscribeReasonFontColor
  );
  const [bgColorFooter, setBgColorFooter] = useState<string>(
    subScriptionSettings.unSubscribeReasonBackgroundColor
  );
  const [fontSize, setFontSize] = useState<FontSize>({
    value: subScriptionSettings.unSubscribeReasonFontSize,
    label: subScriptionSettings.unSubscribeReasonFontSize,
  });

  const [subscriptionTitle, setSubscriptionTitle] = useState<string>(
    subScriptionSettings.subscriptionTitle
  );
  const [subscribeAllLabel, setSubscribeAllLabel] = useState<string>(
    subScriptionSettings.subscribeAllLabel
  );
  const [unSubscribeAllLabel, setUnSubscribeAllLabel] = useState<string>(
    subScriptionSettings.unSubscribeAllLabel
  );
  const [trigerUnSubscribeReason, setTrigerUnSubscribeReason] =
    useState({
      value: subScriptionSettings.trigerUnSubscribeReason,
      label: subScriptionSettings.trigerUnSubscribeReason,
    });
  const [unSubscribeReasonTitle, setUnSubscribeReasonTitle] = useState<string>(subScriptionSettings.unSubscribeReasonTitle);
  const [unSubscribeReasonTitleDescription, setUnSubscribeReasonTitleDescription] = useState<string>(subScriptionSettings.unSubscribeReasonTitleDescription);
  const [unSubscribeReasonLabelButton, setUnSubscribeReasonLabelButton] = useState<string>(subScriptionSettings.unSubscribeReasonLabelButton);
  const [unSubscribeReason, setUnSubscribeReason] = useState<any>(mode === "create" ? [{
    value: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
    label: "ขอลบ"
  }] : Array.isArray(subScriptionSettings.unSubscribeReason) ? subScriptionSettings.unSubscribeReason : []);
 

  const [unSubscribeReasonRequired, setUnSubscribeReasonRequired] = useState<boolean>(subScriptionSettings.unSubscribeReasonRequired);
  const [errors,setErrors] = useState<any>();
    const [ReasonOption, setReasonOption] = useState<any>([]);


  const TriggerOption = [
    { value: 1, label: "Unsubscribe All" },
    { value: 2, label: "Unsubscribe Reasons" },
  ];
  // const ReasonOption = [
  //   { value: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15", label: "ขอลบ" },
  //   { value: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16", label: "ลูกค้าขอแก้ไข" },
  //   { value: "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17", label: "คีย์ข้อมูลผิด"}
  // ];
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

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};

  

    if (showUnSubScribeReason && unSubscribeReason.length === 0) {
      newErrors.unSubscribeReason = true
    }
    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if(validate()){
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          dispatch(
            setSubscriptionSettings(
              {
                subScriptionSettingsShow: showSubscriptionSetting,
                subscriptionTitle: subscriptionTitle,
                subScribeAllShow: showSubScribe,
                subscribeAllLabel: subscribeAllLabel,
                unSubscribeAllShow: showUnSubScribe,
                unSubscribeAllLabel: unSubscribeAllLabel,
                unSubscribeReasonShow: showUnSubScribeReason,
                trigerUnSubscribeReason: trigerUnSubscribeReason.label,
                unSubscribeReasonTitle: unSubscribeReasonTitle,
                unSubscribeReasonTitleDescription:
                  unSubscribeReasonTitleDescription,
                unSubscribeReasonLabelButton: unSubscribeReasonLabelButton,
                unSubscribeReasonFontSize: fontSize.value,
                unSubscribeReasonFontColor: fontColor,
                unSubscribeReasonBackgroundColor: bgColorFooter,
                unSubscribeReason: unSubscribeReason,
                unSubscribeReasonRequired: unSubscribeReasonRequired,
              }
            )
          )
          setOpenScreenSubscriptionSetting(false);
        },
        notify: true,
        onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    }
 


  }

  const selectReason = (item: any) => {
    // check if the language is already selected
    const isExist = unSubscribeReason.find(
      (d:any) => d.value === item.value
    );
    if (isExist) {
      
      notification.error(t("consent.preferencePurpose.languageAlreadySelect"));
    } else {
      setUnSubscribeReason([...unSubscribeReason, item]);
    }
  };

  // ------------- USEEFFECT -----------------
  useEffect(() => {
    const fetchConsentReason = async () => {
      try {
        const response = await getConsentReason(JSON.parse(getCustomerId).customer_id);
        if(response.data.length){
          const reasonOption = response.data.map((item: any) => ({
            value: item.consentReasonId,
            label: item.consentReasonsName,
          }));
          setReasonOption(reasonOption);
        }
      } catch (error) {
        console.error("Error fetching consent reason:", error);
      }
    };
    fetchConsentReason();
  }, []);
  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return (
    <div className="w-full bg-white  pr-4">
      <div className="flex p-4 border-b ">
        <button
          type="button"
          className="w-1/12 pt-[2px]"
          onClick={() => setOpenScreenSubscriptionSetting(false)}
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
            {t("builderAndBranding.subscriptionSettings")}
          </p>
        </div>
        <div className="w-3/12 pt-[8px] text-right"></div>
      </div>
      <div className="p-4">
        <p className="text-base font-semibold">
          {" "}
          {t("builderAndBranding.subscription.subscriptionSettings")}
        </p>
        <div className="flex pt-4">
          <Toggle
            checked={showSubscriptionSetting}
            onChange={() => {

              setShowSubscriptionSetting(!showSubscriptionSetting)
              setShowSubScribe(!showSubscriptionSetting)
              setShowUnSubScribe(!showSubscriptionSetting)
              setShowUnSubScribeReason(!showSubscriptionSetting)
            }

            }
            disabled={mode === "view"}
          ></Toggle>
          <p className="text-base font-semibold ms-3">
            {t("builderAndBranding.subscription.showSubscriptionSettings")}
          </p>
        </div>
        {showSubscriptionSetting && (
          <div className="pb-2 pt-4 ">
            <p className=" py-2 text-base font-semibold">
              {t("builderAndBranding.subscription.subscriptionSettingsLabel")}
            </p>
            <InputText placeholder="Subscription Settings" value={subscriptionTitle} onChange={(e) => setSubscriptionTitle(e.target.value)} disabled={mode === "view"} />
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <p className="text-base font-semibold">
          {" "}
          {t("builderAndBranding.subscription.Subscribe")}
        </p>
        <div className="flex pt-4">
          <Toggle
            checked={showSubScribe}
            onChange={() => setShowSubScribe(!showSubScribe)}
            disabled={mode === "view" || !showSubscriptionSetting}
          ></Toggle>
          <p className="text-base font-semibold ms-3">
            {t("builderAndBranding.subscription.showSubscribeAll")}
          </p>
        </div>
        {showSubScribe && (
          <div className="pb-2 pt-4 ">
            <p className=" py-2 text-base font-semibold">
              {t("builderAndBranding.subscription.subscribeAllLabel")}
            </p>
            <InputText placeholder="Subscribe"
              value={subscribeAllLabel}
              onChange={(e) => setSubscribeAllLabel(e.target.value)}
              disabled={mode === "view"}
            />
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <p className="text-base font-semibold">
          {t("builderAndBranding.subscription.unsubscribe")}
        </p>
        <div className="flex pt-4">
          <Toggle
            checked={showUnSubScribe}
            onChange={() => {
              setShowUnSubScribe(!showUnSubScribe)
              setShowUnSubScribeReason(!showUnSubScribe)
            }}
            disabled={mode === "view"  || !showSubscriptionSetting}
          ></Toggle>
          <p className="text-base font-semibold ms-3">
            {t("builderAndBranding.subscription.showUnsubscribeAll")}
          </p>
        </div>
        {showUnSubScribe && (
          <div className="pb-2 pt-4 ">
            <p className=" py-2 text-base font-semibold">
              {t("builderAndBranding.subscription.unsubscribeAllLabel")}
            </p>
            <InputText placeholder="Unsubscribe All"
              value={unSubscribeAllLabel}
              onChange={(e) => setUnSubscribeAllLabel(e.target.value)}
              disabled={mode === "view" || !showSubscriptionSetting}
            />
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <p className="text-base font-semibold">
          {" "}
          {t("builderAndBranding.subscription.unsubscribeReasons")}
        </p>
        <div className="flex pt-4">
          <Toggle
            checked={showUnSubScribeReason}
            onChange={() => setShowUnSubScribeReason(!showUnSubScribeReason)}
            disabled={mode === "view" || !showSubscriptionSetting || !showUnSubScribe}
          ></Toggle>
          <p className="text-base font-semibold ms-3">
            {t("builderAndBranding.subscription.showUnsubscribeReasons")}
          </p>
        </div>
        {showUnSubScribeReason && (
          <>
            {/* <div className="pb-2 pt-4 ">
              <p className=" py-2 text-base font-semibold">
                {" "}
                {t("builderAndBranding.subscription.trigger")}
              </p>
              <Dropdown className="w-full" id="ddl-triger-subscribe" selectedName={trigerUnSubscribeReason.label} disabled={mode === "view"}>
                {TriggerOption.map((item: any, index: any) => (
                  <DropdownOption key={index} value={item.value} onClick={() => setTrigerUnSubscribeReason(item)}>
                    {item.label}
                  </DropdownOption>
                ))}
              </Dropdown>
            </div> */}
            <div className="pb-2 pt-4 ">
              <p className=" py-2 text-base font-semibold">
                {t("builderAndBranding.subscription.title")}
              </p>
              <InputText placeholder="Unsubscribe Reasons" value={unSubscribeReasonTitle} onChange={(e) => setUnSubscribeReasonTitle(e.target.value)} disabled={mode === "view"} />
            </div>
            <div className="pb-2 pt-2 ">
              <p className=" py-2 text-base font-semibold">
                {t("builderAndBranding.subscription.titleDescription")}
              </p>
              <TextArea placeholder="Please specify the reason for the unsubscribe of all subscription" value={unSubscribeReasonTitleDescription} onChange={(e) => setUnSubscribeReasonTitleDescription(e.target.value)}  disabled={mode === "view"}/>
            </div>
            <div className="pb-2 pt-2 ">
              <p className=" py-2 text-base font-semibold"> {t("builderAndBranding.subscription.labelButton")}</p>
              <InputText placeholder="Confirm" value={unSubscribeReasonLabelButton} onChange={(e) => setUnSubscribeReasonLabelButton(e.target.value)} disabled={mode === "view"}/>
            </div>
            <div className="flex pt-2">
              <div className="w-7/12 m-auto">
                <p className="text-base">{t("builderAndBranding.subscription.fontSize")}</p>
              </div>
              <div className="w-5/12 flex justify-end">
                <Dropdown selectedName={fontSize.label} className="w-[120px]" id="ddlfont" disabled={mode === "view"}>
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
                <p className="text-base">{t("builderAndBranding.subscription.fontColor")}</p>
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
                <p className="text-base">{t("builderAndBranding.subscription.backgroundColor")}</p>
              </div>
              <div className="w-5/12 flex justify-end">
                <ColorPicker
                  hideInput={true}
                  squre={true}
                  value={bgColorFooter}
                  onChange={(value) => setBgColorFooter(value)}
                  disabled={mode === "view"}
                />
              </div>
            </div>
            <div className="pb-2 pt-4 ">
              <p className=" py-2 text-base font-semibold">
                <span className="text-[red]">* </span> {t("builderAndBranding.subscription.reason")}
              </p>
              {/* <Dropdown className="w-full" selectedName={unSubscribeReason.label} id="ddlReason" disabled={mode === "view"}>
                {ReasonOption.map((item, index) => (
                  <DropdownOption key={index} value={item.value} onClick={() => setUnSubscribeReason(item)}>
                    {item.label}
                  </DropdownOption>
                ))}
              </Dropdown> */}
                <Dropdown
                    disabled={mode === "view"}
                    id="dd-unsub-reason"
                    className={`w-full mt-2 ${errors?.unSubscribeReason ? "border-red-500" : ""}`}
                    selectedName={t('userManagement.select')}
                  >
                    {ReasonOption.length && ReasonOption?.map((data:any) => (
                      <DropdownOption
                        onClick={() => selectReason(data)}
                        key={data.value}
                      >
                        <span>{data.label}</span>
                      </DropdownOption>
                    ))}
                  </Dropdown>
                  <div className="flex mt-2 flex-wrap gap-2">
                    {Array.isArray(unSubscribeReason) ? unSubscribeReason?.map((d:any) => (
                    
                      <Tag
                        key={d.value}
                        variant="contained"
                        color="#4361FF1A"
                        minHeight="1.625rem"
                      >
                        <div className="flex items-center gap-2">
                          <p className=" text-primary-blue">
                            {d.label}
                          </p>
                          <div
                            onClick={() =>
                              setUnSubscribeReason(
                                unSubscribeReason.filter(
                                  (item:any) => item.value !== d.value
                                )
                              )
                            }
                          >
                            <LiaTimesSolid className="w-2 h-2" />
                          </div>
                        </div>
                      </Tag>
                    )) : null}
                  </div>
                  {errors?.unSubscribeReason && (
                        <p className="text-[red] text-base">
                          {t('thisfieldisrequired')}
                        </p>
                      )}
            </div>
            <div className=" flex pb-2 pt-3 ">
              <Toggle
                checked={unSubscribeReasonRequired}
                onChange={() => setUnSubscribeReasonRequired(!unSubscribeReasonRequired)}
                disabled={mode === "view"}
              ></Toggle>
              <p className="text-base font-semibold ms-3">{t("builderAndBranding.subscription.required")}</p>
            </div>
          </>
        )}
      </div>
      <div>
        <div className={`flex pt-5 border-t border-gray-200 ${mode === 'view' && `justify-end`}`}>
          <Button
            className="w-1/2 bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
            onClick={() => setOpenScreenSubscriptionSetting(false)}
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

export default SubscriptionSetting;
