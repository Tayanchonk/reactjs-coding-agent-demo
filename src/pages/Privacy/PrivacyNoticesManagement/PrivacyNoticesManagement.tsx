import { useEffect, useState } from "react";
import {
  Tab,
  TabItem,
  Button,
  Tag,
  InputText,
  TextArea,
  Dropdown,
  DropdownOption,
  LogInfo,
} from "../../../components/CustomComponent";
import PreviewModal from "./PreviewModal";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import notification from "../../../utils/notification";
import {
  PrivacyNotice,
  PrivacyNoticeRequest,
  PrivacyNoticeItem,
  ConfigJson,
} from "../../../interface/privacy.interface";
import { formatDate } from "../../../utils/Utils";
import { useConfirm, ModalType } from "../../../context/ConfirmContext";
import {
  getPrivacyNotice,
  updatePrivacyNotice,
} from "../../../services/privacyNoticesService";
import TranslationsPrivacyModue from "../../../components/TranslationsPrivacyModue/TranslationsPrivacyModue";
import { getAppLanguages } from "../../../services/appLanguage";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

export interface TranslationItem {
  language: string;
  languageId: string;
  value: string;
}

const PrivacyNotices = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );

  const [opnePreviewModal, setOpenPreviewModal] = useState(false);
  const [privacyNoticeRequest, setPrivacyNoticeRequest] =
    useState<PrivacyNoticeRequest>({
      privacyNoticeId: "",
      privacyNoticeName: "",
      description: "",
      defaultLanguage: "",
      translationJson: "",
      modifiedBy: "",
    });
  const [appLanguages, setAppLanguages] = useState<any[]>([]);
  const [error, setError] = useState<any | null>({
    privacyNoticeName: false,
    description: false,
    defaultLanguage: false,
  });
  const [sdkText, setSdkText] = useState<string>("");

  const [translationJson, setTranslationJson] = useState<TranslationItem[]>([]);
  const [textEditorValue, setTextEditorValue] = useState<string>("");
  const confirm = useConfirm();
  const [privacyNoticeItem, setPrivacyNoticeItem] =
    useState<PrivacyNoticeItem>();
  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);
  const [isView, setIsView] = useState(false);
  const [isSkip, setIsSkip] = useState(false);

  // Function to copy text to clipboard with fallback
  const copyToClipboard = async (text: string) => {
    try {
      // Try to use the clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        notification.success(t(`privacy.privacyNotices.copySuccess`));
      } else {
        // Fallback method using textarea
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            notification.success(t(`privacy.privacyNotices.copySuccess`));
          } else {
            notification.error(t(`privacy.privacyNotices.copyFailed`));
          }
        } catch (err) {
          notification.error(t(`privacy.privacyNotices.copyFailed`));
          console.error("Failed to copy: ", err);
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      notification.error(t(`privacy.privacyNotices.copyFailed`));
      console.error("Copy failed: ", err);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("view")) {
      setIsView(true);
    }
    if (location.pathname.includes("edit")) {
      setIsView(false);
      if (!permissionPage?.isUpdate) {
        navigate("/privacy/privacy-notices");
      }
    }
  }, [permissionPage]);
  useEffect(() => {
    const fetchPrivacyNotice = async () => {
      const privacyNoticeId = location.pathname.split("/").pop();
      if (privacyNoticeId) {
        const appLanguagesResponse = await getAppLanguages();
        setAppLanguages(appLanguagesResponse.data);
        const privacy: PrivacyNoticeItem = await getPrivacyNotice(
          privacyNoticeId
        );
        setPrivacyNoticeItem(privacy);
        setPrivacyNoticeRequest({
          privacyNoticeId: privacy.privacyNotice.privacyNoticeId,
          privacyNoticeName: privacy.privacyNotice.privacyNoticeName,
          description: privacy.privacyNotice.description,
          defaultLanguage: privacy.privacyNotice.defaultLanguage,
          translationJson: privacy.privacyNotice.translationJson,
          modifiedBy: user.user_account_id,
        });
        // privacyNoticeItem?.privacyNotice.configJson
        const configJson: ConfigJson = JSON.parse(
          privacy.privacyNotice.configJson
        );
        const htmlString = createHtmlString(
          configJson.src,
          configJson.id,
          configJson.setting,
          privacy.privacyNotice.privacyNoticeId
        );

        setSdkText(htmlString);

        try {
          if (privacy.privacyNotice.translationJson) {
            const parsedTranslations = JSON.parse(
              privacy.privacyNotice.translationJson
            );
            setTranslationJson(parsedTranslations);

            const defaultLanguageTranslation = parsedTranslations.find(
              (item: TranslationItem) =>
                item.languageId === privacy.privacyNotice.defaultLanguage
            );

            if (defaultLanguageTranslation) {
              setTextEditorValue(defaultLanguageTranslation.value);
            }
          }
        } catch (error) {
          console.error("Error parsing translation JSON:", error);
          setTranslationJson([]);
        }
      }
    };
    fetchPrivacyNotice();
  }, [location]);
  const modules = {
    toolbar: [
      [{ font: [] }, { header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
    ],
  };

  const [tabs, setTabs] = useState([
    {
      name: t("privacy.privacyNotices.tab.interfaceBuilder"),
      selected: true,
    },
    {
      name: t("privacy.privacyNotices.tab.intergration"),
      selected: false,
    },
    {
      name: t("privacy.privacyNotices.tab.translation"),
      selected: false,
    },
  ]);
  useEffect(() => {
    const interfaceBuilder = t("privacy.privacyNotices.tab.interfaceBuilder");
    const intergration = t("privacy.privacyNotices.tab.intergration");
    const translation = t("privacy.privacyNotices.tab.translation");
    setTabs((prev) =>
      prev.map((tab, index) => {
        if (index === 0) {
          return { ...tab, name: interfaceBuilder };
        } else if (index === 1) {
          return { ...tab, name: intergration };
        } else if (index === 2) {
          return { ...tab, name: translation };
        }
        return tab;
      })
    );
  }, [t]);

  const buttonGroup = (
    <div className="gap-2 flex flex-wrap items-center justify-center">
      <Button
        variant="outlined"
        className="mr-2"
        onClick={() => {
          setOpenPreviewModal(true);
        }}
      >
        <p className="font-semibold text-primary-blue">{t("preview")}</p>
      </Button>

      <Button
        onClick={() => {
          confirm({
            modalType: ModalType.Cancel,
            onConfirm: async () => {
              navigate("/privacy/privacy-notices");
            },
            notify: false,
          });
        }}
        color="#DFE4EA"
        className="mr-2"
        variant="outlined"
      >
        <p className="font-semibold">{t("cancel")}</p>
      </Button>
      {isView && permissionPage?.isUpdate && (
        <Button
          variant="contained"
          color="#111928"
          className="mr-2"
          onClick={() => {
            navigate(
              `/privacy/privacy-notices/privacy-notices-management/edit/${privacyNoticeRequest.privacyNoticeId}`
            );
          }}
        >
          <p className="text-white font-semibold">{t("edit")}</p>
        </Button>
      )}
      {!isView && (
        <Button
          variant="contained"
          className="mr-2"
          onClick={() => {
            updatePrivacyNoticeConfirm();
          }}
        >
          <p className="text-white font-semibold">{t("save")}</p>
        </Button>
      )}
    </div>
  );
  const updatePrivacyNoticeConfirm = async () => {
    if (
      !privacyNoticeRequest.description ||
      !privacyNoticeRequest.privacyNoticeName ||
      !privacyNoticeRequest.defaultLanguage
    ) {
      {
        setError({
          privacyNoticeName: !privacyNoticeRequest.privacyNoticeName,
          description: !privacyNoticeRequest.description,
          defaultLanguage: !privacyNoticeRequest.defaultLanguage,
        });
        setTabs((prev) =>
          prev.map((tab, index) => ({
            ...tab,
            selected: index === 0,
          }))
        );
      }
    } else {
      confirm({
        modalType: ModalType.Save,
        onConfirm: handleConfirm,
      });
    }
  };
  const handleConfirm = async () => {
    const privacyNoticeRequestSend: PrivacyNoticeRequest = {
      privacyNoticeId: privacyNoticeRequest.privacyNoticeId,
      privacyNoticeName: privacyNoticeRequest.privacyNoticeName,
      description: privacyNoticeRequest.description,
      defaultLanguage: privacyNoticeRequest.defaultLanguage,
      translationJson: JSON.stringify(translationJson),
      modifiedBy: privacyNoticeRequest.modifiedBy,
    };
    await updatePrivacyNotice(privacyNoticeRequestSend);
    setError({
      privacyNoticeName: false,
      description: false,
      defaultLanguage: false,
    });
    navigate(`/privacy/privacy-notices`);
  };

  const createHtmlString = (
    src: string,
    id: string,
    setting: string,
    privacyNoticeId: string
  ) => {
    const html = `
    <!-- 
        This container will hold the privacy notice content fetched from the MSC API.
        Once MSC.NoticeApi.LoadNotices is called, the data will be displayed here.
    -->
    <div id="msc-notice-container" class="msc-notice"></div>
    <!-- 
        Add the script to load the SDK or related file required for displaying the privacy notice.
    -->
    <script
      src="${src}"  
      id="${id}"    
      setting="${setting}" 
    ></script>

    <script>
      // Initialize the MSC (Message Security Center) API
      MSC.NoticeApi.Initialized.then(function () {
        // Once MSC API is initialized, call the LoadNotices function to fetch the notice data
        MSC.NoticeApi.LoadNotices("${privacyNoticeId}", {}); 
      }).catch(function (error) {
        // If an error occurs while initializing the API, log the error message to the console
        console.error("Error initializing MSC SDK:", error);
      });
    </script>
    `;
    return html;
  };

  const setTextEditorValueHandler = (value: string) => {
    setTextEditorValue(value);
    setIsSkip(true);
    setTranslationJson((prev) =>
      prev.map((item) => {
        if (item.languageId === privacyNoticeRequest.defaultLanguage) {
          return { ...item, value };
        }
        return item;
      })
    );
  };

  const updatedTranslationsJson = (value: any) => {
    setTranslationJson(value);
  };

  return (
    <div>
      <Tab
        buttonGroup={buttonGroup}
        tabs={tabs.map((tab, index) => (
          <TabItem
            key={index}
            onClick={() => {
              setTabs((prev) =>
                prev.map((t, i) => ({
                  ...t,
                  selected: i === index,
                }))
              );
            }}
            active={tab.selected}
          >
            {tab.name}
          </TabItem>
        ))}
      >
        <div
          className={`${
            tabs[0].selected ? "block" : "hidden"
          } gap-3 h-full grid grid-cols-12`}
        >
          <div className="mb-4 col-span-12 md:col-span-4   ">
            <p className="text-xl font-semibold">
              {t("privacy.privacyNotices.interfaceBuilder")}
            </p>
            <p>{t("privacy.privacyNotices.interfaceBuilderDesc")}</p>
            <div className="flex mt-1 gap-1">
              <Tag
                size="sm"
                variant="contained"
                minHeight="1.625rem"
                color="#DAF8E6"
              >
                <p className="text-[#1A8245]">Published</p>
              </Tag>
              <Tag
                size="sm"
                variant="contained"
                minHeight="1.625rem"
                color="#4361FF1A"
              >
                <p className="text-primary-blue">Version 1</p>
              </Tag>
            </div>
            <div className="w-full border-b-2 border-dashed border-lilac-gray mt-7"></div>
            <div className="mt-6">
              <div className="mb-6">
                <span className="text-danger-red mr-1">*</span>
                <span className="font-semibold">
                  {t("privacy.privacyNotices.form.privacyNoticesName")}
                </span>
                <InputText
                  className="mt-2"
                  isError={error.privacyNoticeName}
                  disabled={isView}
                  onChange={(e) => {
                    setPrivacyNoticeRequest((prev) => ({
                      ...prev,
                      privacyNoticeName: e.target.value,
                    }));
                  }}
                  value={privacyNoticeRequest.privacyNoticeName}
                ></InputText>
                {error.privacyNoticeName && (
                  <p className="text-danger-red text-sm">{t("required")}</p>
                )}
              </div>
              <div className="mb-6">
                <span className="text-danger-red mr-1 font-semibold">*</span>
                <span className="font-semibold">
                  {t("privacy.privacyNotices.form.description")}
                </span>
                <TextArea
                  className="mt-2"
                  disabled={isView}
                  minHeight="5rem"
                  isError={error.description}
                  onChange={(e) => {
                    setPrivacyNoticeRequest((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                  value={privacyNoticeRequest.description}
                ></TextArea>
                {error.description && (
                  <p className="text-danger-red text-sm mt-1">
                    {t("required")}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <span className="text-danger-red mr-1 font-semibold">*</span>
                <span className="font-semibold">
                  {t("privacy.privacyNotices.form.defaultLanguage")}
                </span>
                <Dropdown
                  minWidth="100%"
                  className="mt-2"
                  disabled={isView}
                  isError={error.defaultLanguage}
                  id="dd-privacy-notice-type"
                  selectedName={
                    appLanguages.find(
                      (language) =>
                        language.languageId ===
                        privacyNoticeRequest.defaultLanguage
                    )?.displayName ?? "Select Language"
                  }
                >
                  {appLanguages.map((language) => (
                    <DropdownOption
                      onClick={() => {
                        setIsSkip(true);
                        const newDefaultLanguage = language.languageId;
                        setPrivacyNoticeRequest((prev) => ({
                          ...prev,
                          defaultLanguage: newDefaultLanguage,
                        }));

                        // Find existing translation for the selected language
                        const existingTranslation = translationJson.find(
                          (item) => item.languageId === newDefaultLanguage
                        );

                        if (existingTranslation) {
                          setTimeout(() => {
                            setTextEditorValue(existingTranslation.value); // หลังจาก 0ms, setTextEditorValue จะถูกเรียก
                          }, 0);
                          // setTextEditorValue(existingTranslation.value);
                        } else {
                          // If no translation exists, create new one but keep existing translations
                          const newTranslation = {
                            value: "",
                            language: language.displayName,
                            languageId: newDefaultLanguage,
                          };
                          setTranslationJson((prev) => [
                            ...prev,
                            newTranslation,
                          ]);
                          setTextEditorValue("");
                        }
                      }}
                      key={language.languageId}
                    >
                      <span className="">{language.displayName}</span>
                    </DropdownOption>
                  ))}
                </Dropdown>
                {error.defaultLanguage && (
                  <p className="text-danger-red text-sm mt-1">
                    {t("required")}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <LogInfo
                  createdBy={privacyNoticeItem?.createdBytName}
                  createdDate={formatDate(
                    "datetime",
                    privacyNoticeItem?.privacyNotice.createdDate as Date
                  )}
                  modifiedBy={privacyNoticeItem?.modifiedByName}
                  modifiedDate={formatDate(
                    "datetime",
                    privacyNoticeItem?.privacyNotice.modifiedDate as Date
                  )}
                  publishedBy={privacyNoticeItem?.publishedByName}
                  publishedDate={formatDate(
                    "datetime",
                    privacyNoticeItem?.privacyNotice.publishedDate as Date
                  )}
                ></LogInfo>
              </div>
            </div>
          </div>
          <div className="mb-4 col-span-12 md:col-span-8 h-fit md:h-auto ">
            {privacyNoticeRequest.defaultLanguage && (
              <ReactQuill
                className={`w-full h-[90vh] ${
                  isView ? "cursor-not-allowed opacity-50" : ""
                }`}
                readOnly={isView}
                theme="snow"
                modules={modules}
                value={textEditorValue}
                onChange={(value) => {
                  if (!isSkip) {
                    setTextEditorValue(value);
                    setTranslationJson((prev) =>
                      prev.map((item) => {
                        if (
                          item.languageId ===
                          privacyNoticeRequest.defaultLanguage
                        ) {
                          return { ...item, value };
                        }
                        return item;
                      })
                    );
                  } else {
                    setIsSkip(false);
                  }
                }}
              />
            )}
          </div>
        </div>
        <div
          className={`
          ${tabs[1].selected ? "block" : "hidden"}  gap-3 h-full
          }`}
        >
          <p className="text-xl font-semibold">
            {t("privacy.privacyNotices.integrations")}
          </p>
          <p>{t("privacy.privacyNotices.interactionsDescription")}</p>
          <div className="w-full border-b-2 border-dashed border-lilac-gray mt-7"></div>
          <div className="mt-5 rounded-md border border-lilac-gray py-5 px-11">
            <p className="text-lg font-semibold">
              {t("privacy.privacyNotices.publishSdk")}
            </p>
            <p>{t("privacy.privacyNotices.publishSdkDesc")}</p>
            <div className="my-3"></div>
            <div className="w-full mt-7 p-2 bg-[#F7F8F9] rounded-md">
              <div className="w-full flex justify-end">
                <Button
                  className="mb-2"
                  onClick={() => copyToClipboard(sdkText)}
                >
                  {t("privacy.privacyNotices.copy")}
                </Button>
              </div>
              <div className="p-6 w-full">
                <div className="w-full bg-[#f4f0ee] p-4">
                  <pre className="text-sm overflow-scroll">{sdkText}</pre>
                </div>
              </div>
            </div>
            <p className="mt-4">{t("privacy.privacyNotices.copyDesc")}</p>
          </div>
        </div>
        <div
          className={`
          ${tabs[2].selected ? "block" : "hidden"}  gap-3 h-full
          }`}
        >
          <TranslationsPrivacyModue
            isView={isView}
            titleDesc={t("privacy.privacyNotices.translateDesc")}
            translationJson={translationJson}
            updatedTranslationsJson={updatedTranslationsJson}
            setTextEditorValueHandler={setTextEditorValueHandler}
            defultLanguage={
              privacyNoticeRequest.defaultLanguage
                ? privacyNoticeRequest.defaultLanguage
                : ""
            }
          />
        </div>
      </Tab>
      <PreviewModal
        isOpen={opnePreviewModal}
        onClose={() => {
          setOpenPreviewModal(false);
        }}
        title="Preview Privacy Notice"
        htmlContent={textEditorValue}
      ></PreviewModal>
    </div>
  );
};

export default PrivacyNotices;
