import React, { useEffect, useState } from 'react';
import { useConfirm, ModalType } from "../../context/ConfirmContext";
import { Button, CheckBox, Dropdown, DropdownOption, InputText, Tag } from '../CustomComponent';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import notification from "../../utils/notification";
import {
  TranslationField,
  Field,
} from "../../interface/purpose.interface";
import { Dialog, DialogPanel } from '@headlessui/react';
import { LiaTimesSolid } from 'react-icons/lia';
import { getAppLanguages } from '../../services/appLanguage';

interface TranslationsModueProps {
  fields: Field[];
  isView: boolean;
  mode?: string;
  titleDesc?: string;
  addDesc?: string;
  translationJson?: TranslationField[];
  setTranslationJson?: (value: TranslationField[] | ((prev: TranslationField[]) => TranslationField[])) => void;
}

function TranslationsModue({ fields, isView, translationJson, setTranslationJson, titleDesc, addDesc }: TranslationsModueProps) {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [languageModal, setLanguageModal] = useState(false);
  const [appLanguages, setAppLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<any[]>([]);
  const [oldSelectedLanguage, setOldSelectedLanguage] = useState<any[]>([]);
  const [selectAllLanguage, setSelectAllLanguage] = useState(false);
  const [selectedDeleteLanguage, setSelectedDeleteLanguage] = useState<any[]>([]);
  const [expandedLanguageIds, setExpandedLanguageIds] = useState<string[]>([]);

  useEffect(() => {
    getAppLanguages().then((res) => {
      setAppLanguages(res.data);
    });
  }, []);
  
  const selectLanguage = (item: any) => {
    const isExist = selectedLanguage.find(
      (lang) => lang.languageId === item.languageId
    );
    if (isExist) {
      notification.error(t("consent.preferencePurpose.languageAlreadySelect"));
    } else {
      setSelectedLanguage([...selectedLanguage, item]);
    }
  };

  const deleteLanguage = async () => {
    const newTranslationJson = (translationJson || []).filter(
      (tj) => !selectedDeleteLanguage.includes(tj.languageId)
    );
    if (setTranslationJson) {
      setTranslationJson(newTranslationJson);
    }
    setSelectedLanguage(
      selectedLanguage.filter(
        (language) => !selectedDeleteLanguage.includes(language.languageId)
      )
    );

    setOldSelectedLanguage(
      oldSelectedLanguage.filter(
        (language) => !selectedDeleteLanguage.includes(language.languageId)
      )
    );

    // รีเซ็ต selectedDeleteLanguage และ selectAllLanguage
    setSelectedDeleteLanguage([]);
    setSelectAllLanguage(false);
  };

  useEffect(() => {
    if ((translationJson ?? []).length > 0) {
      if (selectedDeleteLanguage.length === (translationJson ?? []).length) {
        setSelectAllLanguage(true);
      }
    }
  }, [selectedDeleteLanguage]);

  const handleOpenModal = () => {
    const backupLangs = translationJson?.map(lang => ({
      languageId: lang.languageId,
      displayName: lang.language,
    })) ?? [];
    setOldSelectedLanguage(backupLangs);
    setSelectedLanguage(backupLangs);
    setLanguageModal(true);
  };

  const handleSave = () => {
    const prev = translationJson ?? [];
    const newJson: TranslationField[] = selectedLanguage.map(lang => {
      const oldLang = prev.find(o => o.languageId === lang.languageId);
      const fieldsList = fields.map(field => ({
        name: field.name,
        value: field.value,
        type: field.type,
        transalte: oldLang?.fields.find(f => f.name === field.name)?.transalte || ""
      }));
      return {
        language: lang.displayName,
        languageId: lang.languageId,
        fields: fieldsList,
      };
    });

    setTranslationJson?.(newJson);
    setOldSelectedLanguage([...selectedLanguage]);
    setLanguageModal(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="text-xl font-semibold">
            {t("consent.preferencePurpose.transaltion")}
          </p>
          <p className="text-base">
            {titleDesc ? titleDesc : t("consent.preferencePurpose.transaltionDescription")}
          </p>
        </div>
        <div>
          {!isView && (
            <div className="flex gap-2">
              <Button
                disabled={selectedDeleteLanguage.length === 0}
                onClick={() =>
                  confirm({
                    modalType: ModalType.Delete,
                    onConfirm: deleteLanguage,
                  })
                }
                variant="outlined"
                color="var(--danger)"
              >
                <p className="text-base text-danger-red">{t("delete")}</p>
              </Button>
              <Button
                minWidth="fit-content"
                variant="contained"
                color="var(--secondary)"
                onClick={() => { handleOpenModal() }}
              >
                <p className="text-base text-white">
                  {t("consent.preferencePurpose.addLanguage")}
                </p>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex mt-7 py-2 px-5 border bg-[#F9FAFB] h-[2.6875rem] rounded-md">
        <div
          className={` flex items-center justify-center
        ${isView ? "w-2/12" : "w-1/12"}`}
        >
          {!isView && (
            <CheckBox
              disabled={isView}
              className="cursor-pointer"
              onChange={() => {
                if (selectAllLanguage) {
                  setSelectedDeleteLanguage([]);
                } else {
                  setSelectedDeleteLanguage(
                    selectedLanguage.map((lang) => lang.languageId)
                  );
                }
                setSelectAllLanguage(!selectAllLanguage);
              }}
              checked={selectAllLanguage}
              shape="square"
            />
          )}
        </div>
        {!isView && <div className="w-1/12"></div>}
        <div className="w-2/12 flex items-center">
          <p className="text-base font-semibold">
            {t("consent.preferencePurpose.language")}
          </p>
        </div>
        <div className="w-2/12 flex items-center">
          <p className="text-base font-semibold">
            {t("consent.preferencePurpose.field")}
          </p>
        </div>
        <div className="w-3/12 flex items-center">
          <p className="text-base font-semibold">
            {t("consent.preferencePurpose.originalData")}
          </p>
        </div>
        <div className="w-3/12 flex items-center">
          <p className="text-base font-semibold">
            {t("consent.preferencePurpose.transaltion")}
          </p>
        </div>
      </div>
      {translationJson && translationJson.length > 0 && (
        <div className="mt-2 py-2 px-5 border border-lilac-gray rounded-md">
          {translationJson.map((translate) => (
            <div key={translate.languageId}>
              {!expandedLanguageIds.includes(translate.languageId) ? (
                <div
                  onClick={() =>
                    setExpandedLanguageIds((prev) => [...prev, translate.languageId])
                  }
                  className="cursor-pointer border-b"
                >
                  <div className="flex mb-2 mt-2">
                    {!isView && (
                      <div className="w-1/12 flex items-center justify-center">
                        <CheckBox
                          disabled={isView}
                          className="cursor-pointer"
                          onChange={() => {
                            if (
                              selectedDeleteLanguage.includes(translate.languageId)
                            ) {
                              setSelectedDeleteLanguage(
                                selectedDeleteLanguage.filter(
                                  (id) => id !== translate.languageId
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
                      className={`w-1/12 flex items-center justify-center ${isView ? "w-2/12" : "w-1/12"
                        }`}
                    >
                      <HiChevronDown className="text-3xl font-light" />
                    </div>
                    <div className="w-2/12 flex items-center">
                      <p className="font-semibold">{translate.language}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setExpandedLanguageIds((prev) =>
                      prev.filter((id) => id !== translate.languageId)
                    )
                  }
                  className="cursor-pointer border-b"
                >
                  <div className="flex mb-2 mt-2">
                    {!isView && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-1/12 flex items-center justify-center"
                      >
                        <CheckBox
                          disabled={isView}
                          onChange={() => {
                            if (
                              selectedDeleteLanguage.includes(translate.languageId)
                            ) {
                              setSelectedDeleteLanguage(
                                selectedDeleteLanguage.filter(
                                  (id) => id !== translate.languageId
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
                      className={`flex items-center justify-center ${isView ? "w-2/12" : "w-1/12"
                        }`}
                    >
                      <HiChevronUp className="text-3xl font-light" />
                    </div>
                    <div className="w-2/12 flex items-center">
                      <p className="font-semibold">{translate.language}</p>
                    </div>
                    {translate.fields[0] && (
                      <div className="w-8/12 flex border-b pb-2">
                        <div className="w-1/4 flex items-center">
                          <p className="text-base">{translate.fields[0].name}</p>
                        </div>
                        <div className="w-3/4 flex">
                          <div className="w-1/2 flex items-center">
                            <p className="text-base">{translate.fields[0].value}</p>
                          </div>
                          <div className="w-1/2 flex items-center">
                            {translate.fields[0].type}
                            <InputText
                              disabled={isView}
                              value={translate.fields[0].transalte}
                              onChange={(e) => {
                                setTranslationJson?.(
                                  (translationJson ?? []).map((translation) =>
                                    translation.languageId === translate.languageId
                                      ? {
                                        ...translation,
                                        fields: translation.fields.map((field, index) =>
                                          index === 0
                                            ? {
                                              ...field,
                                              transalte: e.target.value,
                                            }
                                            : field
                                        ),
                                      }
                                      : translation
                                  )
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {translate.fields.slice(1).map((field) => (
                    <div key={field.name} className="flex mb-2">
                      <div className="w-4/12"></div>
                      <div className="w-8/12 flex border-b pb-2">
                        <div className="w-1/4 flex items-center">
                          <p className="text-base">{field.name}</p>
                        </div>
                        <div className="w-3/4 flex">
                          <div className="w-1/2 flex items-center">
                            <p className="text-base">{field.value}</p>
                          </div>
                          <div className="w-1/2 flex items-center">
                            <InputText
                              disabled={isView}
                              value={field.transalte}
                              onChange={(e) => {
                                setTranslationJson?.(
                                  (translationJson ?? []).map((translation) =>
                                    translation.languageId === translate.languageId
                                      ? {
                                        ...translation,
                                        fields: translation.fields.map((f) =>
                                          f.name === field.name
                                            ? {
                                              ...f,
                                              transalte: e.target.value,
                                            }
                                            : f
                                        ),
                                      }
                                      : translation
                                  )
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
              className="absolute text-base top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setLanguageModal(false);
                setSelectedLanguage(oldSelectedLanguage);
              }}
            >
              <LiaTimesSolid className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <div className="mt-0 ml-2 flex flex-col items-start w-full">
                <p className="text-xl font-semibold">
                  {t("consent.preferencePurpose.addLanguage")}
                </p>
                <p className="text-base">
                  {addDesc ? addDesc : t("consent.preferencePurpose.selectAddTranslation")}
                </p>
                <div className="mt-7 border-t border-b w-full p-2 border-lilac-gray">
                  <p className="text-base font-semibold">
                    {t("consent.preferencePurpose.language")}
                  </p>
                  <Dropdown
                    disabled={isView}
                    id="dd-language"
                    className="w-full mt-2"
                    minWidth='8rem'
                  >
                    {appLanguages.map((lang) => (
                      <DropdownOption
                        onClick={() => selectLanguage(lang)}
                        key={lang.languageId}
                      >
                        <span>{lang.displayName}</span>
                      </DropdownOption>
                    ))}
                  </Dropdown>
                  <div className="flex mt-2 flex-wrap gap-2">
                    {selectedLanguage.map((lang) => (
                      <Tag
                        key={lang.languageId}
                        variant="contained"
                        color="#4361FF1A"
                        minHeight="1.625rem"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-primary-blue">
                            {lang.displayName}
                          </p>
                          <div
                            onClick={() =>
                              setSelectedLanguage(
                                selectedLanguage.filter(
                                  (item) => item.languageId !== lang.languageId
                                )
                              )
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
              <button
                className="rounded-md min-w-[100px] font-light bg-white px-4 py-1 text-base  text-black border-solid border-2"
                onClick={() => {
                  setSelectedLanguage([...oldSelectedLanguage]);
                  setLanguageModal(false);
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSave}
                className={`rounded-md min-w-[100px] font-light bg-primary-blue px-4 py-1 text-base text-white`}
              >
                {t("save")}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default TranslationsModue;
