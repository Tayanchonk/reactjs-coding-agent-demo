import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { CheckBox, InputText, Button, Dropdown, DropdownOption, Tag, TranslationsModue } from "../../../../components/CustomComponent";
import { LiaTimesSolid } from "react-icons/lia";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import notification from "../../../../utils/notification";
import { getAppLanguages } from "../../../../services/appLanguage";
import {
  Field,
} from "../../../../interface/purpose.interface";

const PreferencePurposeTranslation = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const context = useOutletContext<{
    dataElement: any;
    setDataElement: (data: any) => void;
    mode: string;
    errors: any;
    id?: string;
    organizations: any[];
  }>();

  if (!context || !context.dataElement) return <div>Loading...</div>;

  const { dataElement, setDataElement, mode } = context;
  const isView = mode === "view";

  // ✅ State
  // const [translationJson, setTranslationJson] = useState<any[]>(dataElement.translationJson || []);
  const [selectedDeleteLanguage, setSelectedDeleteLanguage] = useState<any[]>([]);
  const [appLanguages, setAppLanguages] = useState<any[]>([]);
  const [languageModal, setLanguageModal] = useState(false);
  const [languageCollapse, setLanguageCollapse] = useState<string | null>(null);
  const [selectAllLanguage, setSelectAllLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<any[]>([]);

  useEffect(() => {
    getAppLanguages().then((res) => {
      setAppLanguages(res.data);
    }).catch((error) => {
      console.error("Error fetching app languages:", error);
    });
  }, []);


  // ✅ Update `dataElement.translationJson`
  const updateTranslations = (updatedTranslations: any[]) => {
    setDataElement({ ...dataElement, translationJson: updatedTranslations });
  };

  // ✅ Select a language
  const selectLanguage = (item: any) => {
    if (dataElement.translationJson.some(lang => lang.languageId === item.languageId)) {
      notification.error(t("consent.preferencePurpose.languageAlreadySelect"));
      return;
    }
    const fields: Field[] = [];

    const newTranslation = {
      language: item.displayName,
      languageId: item.languageId,
      fields: fields,
    };

    if (dataElement.dataElementTypeName === "Selection") {
      newTranslation.fields.push({
        name: `Data Element Name`,
        value: dataElement.dataElementName,
        transalte: "",
      })
      dataElement.selectionJson.options.forEach((option, index) => {
        newTranslation.fields.push({
          name: `Option ${option.order}`,
          value: option.text,
          transalte: "",
        });
      })
    } else newTranslation.fields.push({
      name: `Data Element Name`,
      value: dataElement.dataElementName,
      transalte: "",
    })

    const updatedLanguages = [...selectedLanguage, item];
    setSelectedLanguage(updatedLanguages);
    setDataElement({
      ...dataElement,
      translationJson: [...dataElement.translationJson, newTranslation]
    });
  };

  // ✅ Delete selected languages
  const deleteLanguage = () => {
    const updatedTranslations = dataElement.translationJson.filter(t => !selectedDeleteLanguage.includes(t.languageId));
    updateTranslations(updatedTranslations);
    setSelectedDeleteLanguage([]);
    setSelectAllLanguage(false);
  };

  return (
    <div className="p-4">
      {/* ✅ Header Section */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-semibold text-gray-900">{t("consent.preferencePurpose.transaltion")}</h2>
            <p className="text-sm text-gray-500">
                {t("dataelement.translationdescription")}
            </p>
        </div>
        {!isView && (
          <div className="flex gap-2">
            <Button
              onClick={() => confirm({ modalType: ModalType.Delete, onConfirm: deleteLanguage })}
              variant="outlined"
              color="var(--danger)"
            >
              <p className="text-sm text-danger-red">{t("delete")}</p>
            </Button>
            <Button
              minWidth="fit-content"
              variant="contained"
              color="var(--secondary)"
              onClick={() => setLanguageModal(true)}
            >
              <p className="text-sm text-white">{t("consent.preferencePurpose.addLanguage")}</p>
            </Button>
          </div>
        )}
      </div>

      {/* ✅ Table Header */}
      <div className="flex mt-7 py-2 px-5 border bg-[#F9FAFB] h-[2.6875rem] rounded-md">
        {!isView && (
          <div className="w-1/12 flex items-center justify-center">
            <CheckBox
              onChange={() => {
                if (selectAllLanguage) {
                  setSelectedDeleteLanguage([]);
                } else {
                  setSelectedDeleteLanguage(dataElement.translationJson.map(lang => lang.languageId));
                }
                setSelectAllLanguage(!selectAllLanguage);
              }}
              checked={selectAllLanguage}
              shape="square"
            />
          </div>
        )}
        {isView ? <div className="w-2/12"></div> : <div className="w-1/12"></div>}
        <div className="w-2/12 flex items-center">
          <p className="text-sm font-medium">{t("consent.preferencePurpose.language")}</p>
        </div>
        <div className="w-2/12 flex items-center">
          <p className="text-sm font-medium">{t("consent.preferencePurpose.field")}</p>
        </div>
        <div className="w-3/12 flex items-center">
          <p className="text-sm font-medium">{t("consent.preferencePurpose.originalData")}</p>
        </div>
        <div className="w-3/12 flex items-center">
          <p className="text-sm font-medium">{t("consent.preferencePurpose.transaltion")}</p>
        </div>
      </div>
      {/* ✅ Translation Table */}
      <div className="mt-2 py-2 px-5 border border-lilac-gray rounded-md">
        {dataElement.translationJson.map((translate, index) => (
          <div key={translate.languageId}>
            <div
              onClick={() => {
                setLanguageCollapse(translate.languageId);
              }}
              className={`${index !== selectedLanguage.length - 1 ? "border-b" : ""
                } 
                    ${languageCollapse === translate.languageId && "hidden"
                } cursor-pointer`}
            >
              <div className="flex mb-2 mt-2">
                {!isView && (
                  <div className="w-1/12 flex items-center justify-center">
                    <CheckBox
                      disabled={isView}
                      onChange={() => {
                        if (
                          selectedDeleteLanguage.includes(
                            translate.languageId
                          )
                        ) {
                          setSelectedDeleteLanguage(
                            selectedDeleteLanguage.filter(
                              (lang) => lang !== translate.languageId
                            )
                          );
                          setSelectAllLanguage(false);
                        } else {
                          setSelectedDeleteLanguage([
                            ...selectedDeleteLanguage,
                            translate.languageId,
                          ]);
                        }
                      }}
                      checked={selectedDeleteLanguage.includes(
                        translate.languageId
                      )}
                      shape="square"
                    />
                  </div>
                )}

                <div
                  className={`w-1/12 flex items-center justify-center
                        ${isView ? "w-2/12" : "w-1/12"}`}
                >
                  <HiChevronDown className="text-3xl font-light" />
                </div>
                <div className="w-2/12 flex items-center">
                  <p className="font-medium">{translate.language}</p>
                </div>
              </div>
            </div>
            <div
              onClick={() =>
                languageCollapse === translate.languageId &&
                setLanguageCollapse(null)
              }
              className={`${index !== selectedLanguage.length - 1 && "border-b"
                } ${languageCollapse !== translate.languageId && "hidden"
                } cursor-pointer`}
            >
              <div className="flex mb-2 mt-2">
                {!isView && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`w-1/12 flex items-center justify-center`}
                  >
                    <CheckBox
                      disabled={isView}
                      onChange={() => {
                        if (
                          selectedDeleteLanguage.includes(
                            translate.languageId
                          )
                        ) {
                          setSelectedDeleteLanguage(
                            selectedDeleteLanguage.filter(
                              (lang) => lang !== translate.languageId
                            )
                          );
                          setSelectAllLanguage(false);
                        } else {
                          setSelectedDeleteLanguage([
                            ...selectedDeleteLanguage,
                            translate.languageId,
                          ]);
                        }
                      }}
                      checked={selectedDeleteLanguage.includes(
                        translate.languageId
                      )}
                      shape="square"
                    />
                  </div>
                )}
                <div
                  className={` flex items-center justify-center ${isView ? "w-2/12" : "w-1/12"
                    }`}
                >
                  <HiChevronUp className="text-3xl font-light" />
                </div>
                <div className="w-2/12 flex items-center">
                  <p className="font-medium">{translate.language}</p>
                </div>
                {translate.fields[0] && (
                  <div className="w-8/12 flex border-b pb-2">
                    <div className="w-1/4 flex items-center">
                      <p className="text-sm">
                        {translate.fields[0].name}
                      </p>
                    </div>
                    <div className="w-3/4 flex">
                      <div className="w-1/2 flex items-center">
                        <p className="text-sm">
                          {translate.fields[0].value}
                        </p>
                      </div>
                      <div className="w-1/2 flex items-center">
                        <InputText
                          disabled={isView}
                          value={translate.fields[0].transalte}
                          onChange={(e) => {
                            setDataElement({
                              ...dataElement,
                              translationJson: dataElement.translationJson.map((translation) =>
                                translation.languageId === translate.languageId
                                  ? {
                                    ...translation,
                                    fields: translation.fields.map((field, index) =>
                                      index === 0 ? { ...field, transalte: e.target.value } : field
                                    ),
                                  }
                                  : translation
                              ),
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {translate.fields.slice(1).map((field, index) => (
                <div key={field.name} className="flex mb-2 ">
                  <div className="w-4/12"></div>
                  <div
                    className={`w-8/12 flex 
                        ${index !== translate.fields.slice(1).length - 1 &&
                      "border-b pb-2"
                      }
                          `}
                  >
                    <div className="w-1/4 flex items-center">
                      <p className="text-sm">{field.name}</p>
                    </div>
                    <div className="w-3/4 flex">
                      <div className="w-1/2 flex items-center">
                        <p className="text-sm">{field.value}</p>
                      </div>
                      <div className="w-1/2 flex items-center">
                        <InputText
                          disabled={isView}
                          value={field.transalte}
                          onChange={(e) => {
                            setDataElement({
                              ...dataElement,
                              translationJson: dataElement.translationJson.map((translation) =>
                                translation.languageId === translate.languageId
                                  ? {
                                    ...translation,
                                    fields: translation.fields.map((f) =>
                                      f.name === field.name ? { ...f, transalte: e.target.value } : f
                                    ),
                                  }
                                  : translation
                              ),
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Language Selection Dialog */}
      <Dialog
        open={languageModal}
        onClose={() => setLanguageModal(false)}
        className="relative z-50"
        role="dialog"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl relative">
            <button
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setLanguageModal(false);
              }}
            >
              <LiaTimesSolid className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <div className="mt-0 ml-2 flex flex-col items-start w-full">
                <p className="text-xl font-semibold">
                  {t("consent.preferencePurpose.addLanguage")}
                </p>
                <p className="text-sm font-light">
                  {t("dataelement.addlanguage")}
                </p>
                <div className="mt-7 border-t border-b w-full p-2 border-lilac-gray">
                  <p className="font-medium">{t("consent.preferencePurpose.language")}</p>
                  <Dropdown disabled={isView} id="dd-language" className="w-full mt-2">
                    {appLanguages.map((lang) => (
                      <DropdownOption onClick={() => selectLanguage(lang)} key={lang.languageId}>
                        <span>{lang.displayName}</span>
                      </DropdownOption>
                    ))}
                  </Dropdown>
                  <div className="flex mt-2 flex-wrap gap-2">
                    {selectedLanguage.map((lang) => (
                      <Tag key={lang.languageId} variant="contained" color="#4361FF1A" minHeight="1.625rem">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-primary-blue">{lang.displayName}</p>
                          <div
                            onClick={() =>
                              setSelectedLanguage(selectedLanguage.filter(item => item.languageId !== lang.languageId))
                            }
                          >
                            <LiaTimesSolid className="w-2 h-2" />
                          </div>
                        </div>
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setLanguageModal(false)}
                className="rounded-md min-w-[100px] font-light bg-white px-4 py-1 text-sm  text-black border-solid border-2">
                {t("cancel")}</Button>
              <Button
                onClick={() => setLanguageModal(false)}
                className={`rounded-md min-w-[100px] font-light bg-primary-blue px-4 py-1 text-sm text-white`}>
                {t("save")}</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default PreferencePurposeTranslation;
