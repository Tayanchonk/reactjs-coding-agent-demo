import { useConfirm, ModalType } from "../../../../../context/ConfirmContext";
import {
  createPreferencePurpose,
  getPreferencePurpose,
  updatePreferencePurpose,
} from "../../../../../services/preferencePurposeService";
import {
  TranslationField,
  Field,
  PreferencePurposeRequest,
  selectionJson,
} from "../../../../../interface/purpose.interface";
import { Dialog, DialogPanel } from "@headlessui/react";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import {
  SortableItem,
  Tag,
  InputText,
  TextArea,
  Dropdown,
  DropdownOption,
  Toggle,
  LogInfo,
  CheckBox,
  Tab,
  Button,
  TabItem,
} from "../../../../../components/CustomComponent";
import { MdDragIndicator } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { RootState } from "../../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationChart } from "../../../../../services/organizationService";

import { GenerateUUID, formatDate } from "../../../../../utils/Utils";
import { useLocation, useNavigate } from "react-router-dom";
import { LiaTimesSolid } from "react-icons/lia";
import notification from "../../../../../utils/notification";
import { getAppLanguages } from "../../../../../services/appLanguage";
import { useTranslation } from "react-i18next";
import { getConsentGeneral } from "../../../../../services/consentSettingService";
import { setManagePreferencePurposeSlice } from "../../../../../store/slices/preferencePurposeSlice";
import LoadingSpinner from "./../../../../../components/LoadingSpinner";

export class SmartPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as any,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          isInteractiveElement(event.target as Element)
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

function isInteractiveElement(element: Element | null) {
  const interactiveElements = [
    "button",
    "input",
    "textarea",
    "select",
    "option",
  ];
  if (
    element?.tagName &&
    interactiveElements.includes(element.tagName.toLowerCase())
  ) {
    return true;
  }

  return false;
}
function PreferencePurposeForm() {
  const { t, i18n } = useTranslation();

  const [tabs, setTabs] = useState([
    {
      name: t("consent.preferencePurpose.preferencePurposeInfo"),
      selected: true,
    },
    {
      name: t("consent.preferencePurpose.preferencePurposeTranslation"),
      selected: false,
    },
  ]);
  useEffect(() => {
    const preferencePurposeInfo = t(
      "consent.preferencePurpose.preferencePurposeInfo"
    );
    const preferencePurposeTranslation = t(
      "consent.preferencePurpose.preferencePurposeTranslation"
    );
    setTabs([
      { name: preferencePurposeInfo, selected: true },
      { name: preferencePurposeTranslation, selected: false },
    ]);
  }, [t]);
  const location = useLocation();

  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);
  const getUserSession: any = sessionStorage.getItem("user");
  // Safely parse and validate user data to prevent object injection
  let user = { customer_id: "", user_account_id: "" };
  try {
    if (getUserSession) {
      const parsedUser = JSON.parse(getUserSession);
      user = {
        customer_id:
          typeof parsedUser.customer_id === "string"
            ? parsedUser.customer_id
            : "",
        user_account_id:
          typeof parsedUser.user_account_id === "string"
            ? parsedUser.user_account_id
            : "",
      };
    }
  } catch (error) {
    console.error("Failed to parse user session:", error);
  }

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<any>();
  const [languageModal, setLanguageModal] = useState(false);
  const [mutipleSelect, setMutipleSelect] = useState(false);
  const [optionErrorMessages, setOptionErrorMessages] = useState<string>("");
  const [isRequireOrganizationPurposes, setIsRequireOrganizationPurposes] =
    useState<boolean>(false);
  const [preferencePurpose, setPreferencePurpose] =
    useState<PreferencePurposeRequest>({
      customerId: user.customer_id,
      createdBy: user.user_account_id,
    } as PreferencePurposeRequest);
  const [makeItRequired, setMakeItRequired] = useState(false);
  const [selectionJson, setSelectionJson] = useState<selectionJson>({
    options: [],
    multipleSelections: false,
  });
  const [translationJson, setTranslationJson] = useState<TranslationField[]>(
    []
  );
  const [appLanguages, setAppLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<any[]>([]);
  const [oldSelectedLanguage, setOldSelectedLanguage] = useState<any[]>([]);
  const [optionErrorId, setOptionErrorId] = useState<string | null>(null);
  const [languageCollapse, setLanguageCollapse] = useState<string | null>(null);
  const [selectAllLanguage, setSelectAllLanguage] = useState(false);
  const [selectedDeleteLanguage, setSelectedDeleteLanguage] = useState<any[]>(
    []
  );
  const [preferencePurposeNameError, setPreferencePurposeNameError] =
    useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [organizationError, setOrganizationError] = useState(false);
  const preferencePurposeId = useSelector(
    (state: RootState) => state.preferencePurpose.managePreferencePurpose.id
  );
  const [translateOld, setTranslateOld] = useState<any[]>([]);

  const [logInformation, setLogInformation] = useState<any>({});
  const [isView, setIsView] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    selectionJson.options = orderOptions(selectionJson.options);
    setPreferencePurpose({
      ...preferencePurpose,
      selectionJson: JSON.stringify(selectionJson),
    });
  }, [selectionJson]);

  useEffect(() => {
    getOrganizationChart(user.customer_id, orgparent).then((res) => {
      getOrganization(res.data.data);
    });
  }, [orgparent]);

  useEffect(() => {
    getAppLanguages().then((res) => {
      setAppLanguages(res.data);
    });
    getConsentGeneral(user.customer_id).then((res) => {
      setIsRequireOrganizationPurposes(
        res.data.enableRequireOrganizationPurposes
      );
    });
  }, []);
  useEffect(() => {
    convertTranslation();
  }, [selectedLanguage, preferencePurpose]);

  useEffect(() => {
    const fetchData = async () => {
      if (location.pathname.endsWith("create-preference-purpose")) {
        if (!permissionPage.isCreate) {
          navigate("/consent/purpose/preference-purpose");
        }
      }
      if (
        location.pathname.endsWith("edit-preference-purpose") ||
        location.pathname.endsWith("view-preference-purpose")
      ) {
        if (
          !permissionPage.isUpdate &&
          location.pathname.endsWith("edit-preference-purpose")
        ) {
          navigate("/consent/purpose/preference-purpose");
        }
        if (!preferencePurposeId) {
          navigate("/consent/purpose/preference-purpose");
        }
        if (location.pathname.endsWith("view-preference-purpose")) {
          setIsView(true);
        }
        if (appLanguages.length > 0 && organizations.length > 0) {
          const request = await getPreferencePurpose(preferencePurposeId);
          const purposeData = request.data;
          setPreferencePurpose({
            ...preferencePurpose,
            preferencePurposeName:
              purposeData.csPreferencePurpose.preferencePurposeName,
            description: purposeData.csPreferencePurpose.description,
            selectionJson: purposeData.csPreferencePurpose.selectionJson,
            organizationId: purposeData.csPreferencePurpose.organizationId,
            isRequired: purposeData.csPreferencePurpose.isRequired,
            customerId: purposeData.csPreferencePurpose.customerId,
            createdBy: purposeData.csPreferencePurpose.createdBy,
            preferencePurposeId:
              purposeData.csPreferencePurpose.preferencePurposeId,
            modifiedBy: user.user_account_id,
          });
          setLogInformation({
            createdBy:
              purposeData.createdByFirstName +
              " " +
              purposeData.createdByLastName,
            createdDate: formatDate(
              "datetime",
              purposeData.csPreferencePurpose.createdDate
            ),
            modifiedBy:
              purposeData.modifiedByFirstName +
              " " +
              purposeData.modifiedByLastName,
            modifiedDate: formatDate(
              "datetime",
              purposeData.csPreferencePurpose.modifiedDate
            ),
          });
          setMakeItRequired(purposeData.csPreferencePurpose.isRequired);
          const selectionJSONPrase = JSON.parse(
            purposeData.csPreferencePurpose.selectionJson
          );
          setMutipleSelect(selectionJSONPrase.multipleSelections);
          selectionJSONPrase.options.map((option: any) => {
            option.id = GenerateUUID();
          });
          setSelectionJson(selectionJSONPrase);
          setSelectedOrganization(
            organizations.find(
              (org) => org.id === purposeData.csPreferencePurpose.organizationId
            ).orgName
          );
          const translationJSONPrase = JSON.parse(
            purposeData.csPreferencePurpose.translationJson
          );
          setSelectedLanguage(
            translationJSONPrase.map((translation: any) => {
              return {
                languageId: translation.languageId,
                displayName: translation.language,
              };
            })
          );
          setOldSelectedLanguage(
            translationJSONPrase.map((translation: any) => {
              return {
                languageId: translation.languageId,
                displayName: translation.language,
              };
            })
          );

          setTranslationJson(translationJSONPrase);
          setTranslateOld(translationJSONPrase);
        }
      }
    };
    try {
      setLoading(true);
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [appLanguages, organizations]);

  const convertTranslation = () => {
    const fields: Field[] = [];
    if (preferencePurpose.description) {
      fields.push({
        name: "Description",
        value: preferencePurpose.description,
      });
    }
    if (preferencePurpose.preferencePurposeName) {
      fields.push({
        name: "Preference Purpose Name",
        value: preferencePurpose.preferencePurposeName,
      });
    }
    if (selectionJson.options.length > 0) {
      {
        selectionJson.options.forEach((option, index) => {
          fields.push({
            name: `Option ${index + 1}`,
            value: option.text,
            transalte: "",
          });
        });
      }
    }
    const translationJson: TranslationField[] = [];
    selectedLanguage.forEach((lang) => {
      const translationField: Field[] = [];
      const oldTranslationLanguage = translateOld.find(
        (old) => old.languageId === lang.languageId
      );
      fields.forEach((field) => {
        const oldField = oldTranslationLanguage?.fields.find(
          (old: any) => old.name === field.name
        );
        translationField.push({
          name: field.name,
          value: field.value,
          transalte: oldField ? oldField.transalte : "",
        });
      });
      const translation: TranslationField = {
        language: lang.displayName,
        languageId: lang.languageId,
        fields: translationField,
      };
      translationJson.push(translation);
    });
    translationJson.forEach((translation) => {
      translation.fields.sort((a, b) => {
        if (a.name === "Preference Purpose Name") return -1;
        if (b.name === "Preference Purpose Name") return 1;
        if (a.name === "Description") return -1;
        if (b.name === "Description") return 1;
        return 0;
      });
    });

    setTranslationJson(translationJson);
  };

  const orderOptions = (options: any[]) => {
    return options.map((option, index) => {
      return { ...option, order: index };
    });
  };
  const getOrganization = (org: any) => {
    const orgList: string[] = [];
    orgList.push(org[0]);
    if (org[0].organizationChildRelationship.length > 0) {
      org[0].organizationChildRelationship.forEach((element: any) => {
        orgList.push(element);
        if (element.organizationChildRelationship.length > 0) {
          element.organizationChildRelationship.forEach((child: any) => {
            orgList.push(child);
            if (child.organizationChildRelationship.length > 0) {
              child.organizationChildRelationship.forEach((child2: any) => {
                orgList.push(child2);
              });
            }
          });
        }
      });
    }
    setOrganizations(orgList);
  };

  const onMakeItRequiredChange = () => {
    setMakeItRequired(!makeItRequired);
    setPreferencePurpose({
      ...preferencePurpose,
      isRequired: !makeItRequired,
    });
  };

  const confirm = useConfirm();

  const createPreferencePurposeHandler = async () => {
    const preferencePurposeRequest = preferencePurpose;
    preferencePurposeRequest.translationJson = JSON.stringify(translationJson);
    if (location.pathname.endsWith("edit-preference-purpose")) {
      await updatePreferencePurpose(preferencePurposeRequest);
    } else {
      await createPreferencePurpose(preferencePurposeRequest);
    }
    navigate("/consent/purpose/preference-purpose");
  };
  const handleSave = async () => {
    const emptyOption = selectionJson.options.find(
      (option) => option.text === ""
    );
    setPreferencePurposeNameError(false);
    setDescriptionError(false);
    setOrganizationError(false);
    let hasError = false;

    if (!preferencePurpose.preferencePurposeName) {
      setPreferencePurposeNameError(true);
      hasError = true;
    }
    if (!preferencePurpose.description) {
      setDescriptionError(true);
      hasError = true;
    }
    if (isRequireOrganizationPurposes && !preferencePurpose.organizationId) {
      setOrganizationError(true);
      hasError = true;
    }
    if (emptyOption) {
      setOptionErrorId(emptyOption.id);
      hasError = true;
      setOptionErrorMessages(t("required"));
    }
    if (!mutipleSelect) {
      const selectedOptions = selectionJson.options.filter(
        (option) => option.selected
      );
      if (selectedOptions.length > 1) {
        hasError = true;
      }
      const optionNames = selectionJson.options.map(
        (option: { text: any }) => option.text
      );
      const isDuplicate = optionNames.some(
        (name, index) => optionNames.indexOf(name) !== index
      );

      if (isDuplicate) {
        hasError = true;
        const duplicateOption = selectionJson.options.find(
          (option, index, self) =>
            self.findIndex((t) => t.text === option.text) !== index
        );
        const duplicateId = duplicateOption ? duplicateOption.id : null;
        setOptionErrorId(duplicateId);
        setOptionErrorMessages(t("consent.preferencePurpose.duplicatedOption"));
      }
    }

    if (!hasError) {
      confirm({
        modalType: ModalType.Save,
        onConfirm: createPreferencePurposeHandler,
      });
    } else {
      setTabs([
        {
          name: t("consent.preferencePurpose.preferencePurposeInfo"),
          selected: true,
        },
        {
          name: t("consent.preferencePurpose.preferencePurposeTranslation"),
          selected: false,
        },
      ]);
    }
  };
  const addOption = () => {
    const emptyOption = selectionJson.options.find(
      (option) => option.text === ""
    );
    if (emptyOption) {
      notification.error(t("consent.preferencePurpose.errorEmpty"));
      setOptionErrorId(emptyOption.id);
    } else {
      setOptionErrorId(null);
      setSelectionJson({
        ...selectionJson,
        options: [
          ...selectionJson.options,
          {
            text: "",
            value: "",
            selected: false,
            id: GenerateUUID(),
            order: selectionJson.options.length,
          },
        ],
      });
    }
  };

  const checkOption = (item: any) => {
    setSelectionJson({
      ...selectionJson,
      options: selectionJson.options.map((option) =>
        option.id === item.id
          ? {
              ...option,
              selected: !option.selected,
            }
          : option
      ),
    });
  };

  const selectLanguage = (item: any) => {
    // check if the language is already selected
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
    selectedDeleteLanguage.forEach((lang) => {
      setSelectedLanguage(
        selectedLanguage.filter((language) => language.languageId !== lang)
      );
      setOldSelectedLanguage(
        oldSelectedLanguage.filter((language) => language.languageId !== lang)
      );
    });
    setSelectedDeleteLanguage([]);
    setSelectAllLanguage(false);
  };

  const buttonGroup = (
    <div className="gap-2">
      <Button
        onClick={() => {
          confirm({
            modalType: ModalType.Cancel,
            onConfirm: async () => {
              navigate("/consent/purpose/preference-purpose");
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
          onClick={() => {
            setIsView(false);
            dispatch(
              setManagePreferencePurposeSlice({
                id: preferencePurposeId,
              })
            );
            navigate(
              `/consent/purpose/preference-purpose/edit-preference-purpose`
            );
          }}
          color="#111928"
          variant="contained"
        >
          <p className="text-white font-semibold"> {t("edit")}</p>
        </Button>
      )}
      {!isView && (
        <Button onClick={handleSave} variant="contained">
          <p className="text-white font-semibold"> {t("save")}</p>
        </Button>
      )}
    </div>
  );
  return (
    <div>
      {!loading ? (
        <Tab
          tabs={tabs.map((tab, index) => (
            <TabItem
              key={index}
              onClick={() => {
                setTabs((prev) =>
                  prev.map((tab, i) =>
                    i === index
                      ? { ...tab, selected: true }
                      : { ...tab, selected: false }
                  )
                );
              }}
              active={tab.selected}
            >
              {tab.name}
            </TabItem>
          ))}
          buttonGroup={buttonGroup}
        >
          <div>
            <div
              className={`grid grid-cols-1 md:grid-cols-2  ${
                tabs[0].selected ? "" : "hidden"
              }`}
            >
              <div className="py-2">
                <p className="text-lg font-semibold">
                  {t("consent.preferencePurpose.preferencePurposeInfo")}
                </p>
                <p className="">
                  {t("consent.preferencePurpose.preferenceDescription")}
                </p>
                <Tag
                  className="w-fit mt-1"
                  minHeight="1.625rem"
                  variant="outlined"
                  size="sm"
                  color="#0B76B7"
                >
                  <p className="text-[#0B76B7] ">
                    {t("consent.preferencePurpose.preferencePurpose")}
                  </p>
                </Tag>
                <div className="w-[80%]">
                  <div className="mt-7">
                    <span className="text-danger-red mr-1 font-semibold">
                      *
                    </span>
                    <span className="font-semibold">
                      {t("consent.preferencePurpose.preferencePurposeName")}
                    </span>
                  </div>
                  <InputText
                    disabled={isView}
                    isError={preferencePurposeNameError}
                    value={preferencePurpose.preferencePurposeName}
                    onChange={(e) =>
                      setPreferencePurpose({
                        ...preferencePurpose,
                        preferencePurposeName: e.target.value,
                      })
                    }
                  />
                  {preferencePurposeNameError && (
                    <p className="text-danger-red text-sm">{t("required")}</p>
                  )}
                  <div className="mt-7">
                    <span className="text-danger-red mr-1 font-semibold">
                      *
                    </span>
                    <span className="font-semibold">
                      {t("consent.preferencePurpose.descriptionName")}
                    </span>
                  </div>
                  <TextArea
                    disabled={isView}
                    isError={descriptionError}
                    minHeight="5rem"
                    value={preferencePurpose.description}
                    onChange={(e) =>
                      setPreferencePurpose({
                        ...preferencePurpose,
                        description: e.target.value,
                      })
                    }
                  />
                  {descriptionError && (
                    <p className="text-danger-red text-sm">{t("required")}</p>
                  )}
                  <div className="mt-7">
                    {isRequireOrganizationPurposes && (
                      <span className="text-danger-red mr-1 font-semibold">
                        *
                      </span>
                    )}
                    <span className="font-semibold">
                      {t("consent.preferencePurpose.organizationName")}
                    </span>
                  </div>

                  <Dropdown
                    disabled={isView}
                    isError={organizationError}
                    className="w-full"
                    selectedName={selectedOrganization}
                    id="dd-organization"
                  >
                    {!isRequireOrganizationPurposes && (
                      <DropdownOption
                        className="h-[2.625rem]"
                        onClick={() => {
                          setPreferencePurpose({
                            ...preferencePurpose,
                            organizationId: null,
                          });
                          setSelectedOrganization("");
                        }}
                      >
                        <span></span>
                      </DropdownOption>
                    )}
                    {organizations.map((org) => (
                      <DropdownOption
                        key={org.id}
                        selected={org.id === preferencePurpose.organizationId}
                        onClick={() => {
                          {
                            setPreferencePurpose({
                              ...preferencePurpose,
                              organizationId: org.id,
                            });
                            setSelectedOrganization(org.orgName);
                          }
                        }}
                      >
                        <span
                          className={`${
                            org.id === preferencePurpose.organizationId &&
                            "text-white"
                          }`}
                        >
                          {org.orgName}
                        </span>
                      </DropdownOption>
                    ))}
                  </Dropdown>
                  {organizationError && (
                    <p className="text-danger-red text-sm">{t("required")}</p>
                  )}
                  <div className="mt-7 ">
                    <Toggle
                      disabled={isView}
                      checked={makeItRequired}
                      onChange={onMakeItRequiredChange}
                    />
                    <span className="font-semibold ml-4">
                      {t("consent.preferencePurpose.makeThisRequired")}
                    </span>
                  </div>
                  {!location.pathname.endsWith("create-preference-purpose") && (
                    <div className="mt-7">
                      <LogInfo
                        createdBy={logInformation.createdBy}
                        createdDate={logInformation.createdDate}
                        modifiedBy={logInformation.modifiedBy}
                        modifiedDate={logInformation.modifiedDate}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="border border-lilac-gray px-5 py-2">
                <p className="text-lg font-semibold">
                  {t("consent.preferencePurpose.manageOptions")}{" "}
                </p>
                <p className="">{t("consent.preferencePurpose.addOptions")}</p>
                <div className="mt-7 flex">
                  <Toggle
                    disabled={isView}
                    checked={selectionJson.multipleSelections}
                    onChange={() => {
                      setSelectionJson({
                        ...selectionJson,
                        multipleSelections: !selectionJson.multipleSelections,
                      });
                      setMutipleSelect(!mutipleSelect);
                    }}
                  />
                  <p className="ml-4 font-semibold">
                    {t("consent.preferencePurpose.mutipleSelect")}
                  </p>
                </div>
                <div className="mt-7 flex">
                  <div className="w-1/12"></div>
                  <div className="w-2/12">
                    <span className="w-3/12 ">
                      {t("consent.preferencePurpose.default")}
                    </span>
                  </div>
                  <div className="w-7/12">
                    <span className="w-9/12">
                      {t("consent.preferencePurpose.options")}
                    </span>
                  </div>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={({ active, over }) => {
                    if (active.id !== over?.id && !isView) {
                      setSelectionJson({
                        ...selectionJson,
                        options: arrayMove(
                          selectionJson.options,
                          selectionJson.options.findIndex(
                            (item) => item.id === active.id
                          ),
                          selectionJson.options.findIndex(
                            (item) => item.id === over?.id
                          )
                        ),
                      });
                    }
                  }}
                >
                  <SortableContext
                    items={selectionJson.options.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="mt-7">
                      {selectionJson.options.map((item, index) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          className="mb-1"
                        >
                          <div className="flex items-center ">
                            {!isView && (
                              <div className="w-1/12">
                                <MdDragIndicator className="text-xl" />
                              </div>
                            )}
                            <div
                              className={`w-2/12 flex items-center justify-center 
                            ${isView ? "w-3/12" : "w-2/12"}`}
                            >
                              <CheckBox
                                disabled={isView}
                                data-no-dnd="true"
                                checked={item.selected}
                                onChange={() => checkOption(item)}
                              />
                            </div>
                            <div
                              data-no-dnd="true"
                              className={`${isView ? "w-9/12" : "w-7/12"}`}
                            >
                              <InputText
                                disabled={isView}
                                data-no-dnd="true"
                                value={item.text}
                                isError={
                                  optionErrorId === item.id ? true : false
                                }
                                onChange={(e) => {
                                  setSelectionJson({
                                    ...selectionJson,
                                    options: selectionJson.options.map(
                                      (option) =>
                                        option.id === item.id
                                          ? { ...option, text: e.target.value }
                                          : option
                                    ),
                                  });
                                }}
                              />
                              {optionErrorId === item.id && (
                                <p className="text-danger-red text-sm">
                                  {optionErrorMessages}
                                </p>
                              )}
                            </div>
                            {!isView && (
                              <div
                                onClick={() => {
                                  setSelectionJson({
                                    ...selectionJson,
                                    options: selectionJson.options.filter(
                                      (option) => option.id !== item.id
                                    ),
                                  });
                                }}
                                className="w-1/12 flex items-center justify-center text-[#C5C5C5]"
                              >
                                <RiDeleteBinLine className="text-xl" />
                              </div>
                            )}
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <div className="flex mt-2">
                  <div className="w-3/12"></div>
                  {!isView && (
                    <div className="w-9/12 ">
                      <Button onClick={addOption} disabled={isView}>
                        <p className="text-primary-blue">
                          + {t("consent.preferencePurpose.addOption")}
                        </p>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`py-2 ${tabs[1].selected ? "" : "hidden"}`}>
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    {t("consent.preferencePurpose.transaltion")}
                  </p>
                  <p className="">
                    {t("consent.preferencePurpose.transaltionDescription")}
                  </p>
                </div>
                <div>
                  {!isView && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          confirm({
                            modalType: ModalType.Delete,
                            onConfirm: deleteLanguage,
                          })
                        }
                        variant="outlined"
                        color="var(--danger)"
                      >
                        <p className="text-danger-red font-semibold">
                          {t("delete")}
                        </p>
                      </Button>
                      <Button
                        minWidth="fit-content"
                        variant="contained"
                        color="var(--secondary)"
                        onClick={() => setLanguageModal(true)}
                      >
                        <p className="text-white font-semibold">
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
                  <p className="">{t("consent.preferencePurpose.language")}</p>
                </div>
                <div className="w-2/12 flex items-center">
                  <p className="">{t("consent.preferencePurpose.field")}</p>
                </div>
                <div className="w-3/12 flex items-center">
                  <p className="">
                    {t("consent.preferencePurpose.originalData")}
                  </p>
                </div>
                <div className="w-3/12 flex items-center">
                  <p className="">
                    {t("consent.preferencePurpose.transaltion")}
                  </p>
                </div>
              </div>

              <div className="mt-2 py-2 px-5 border border-lilac-gray rounded-md">
                {translationJson.map((translate, index) => (
                  <div key={translate.languageId}>
                    <div
                      onClick={() => {
                        setLanguageCollapse(translate.languageId);
                      }}
                      className={`${
                        index !== selectedLanguage.length - 1 ? "border-b" : ""
                      } 
                    ${
                      languageCollapse === translate.languageId && "hidden"
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
                          <p className="">{translate.language}</p>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        languageCollapse === translate.languageId &&
                        setLanguageCollapse(null)
                      }
                      className={`${
                        index !== selectedLanguage.length - 1 && "border-b"
                      } ${
                        languageCollapse !== translate.languageId && "hidden"
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
                          className={` flex items-center justify-center ${
                            isView ? "w-2/12" : "w-1/12"
                          }`}
                        >
                          <HiChevronUp className="text-3xl font-light" />
                        </div>
                        <div className="w-2/12 flex items-center">
                          <p className="">{translate.language}</p>
                        </div>
                        {translate.fields[0] && (
                          <div className="w-8/12 flex border-b pb-2">
                            <div className="w-1/4 flex items-center">
                              <p className="">{translate.fields[0].name}</p>
                            </div>
                            <div className="w-3/4 flex">
                              <div className="w-1/2 flex items-center">
                                <p className="">{translate.fields[0].value}</p>
                              </div>
                              <div className="w-1/2 flex items-center">
                                {translate.fields[0].name === "Description" ? (
                                  <TextArea
                                    disabled={isView}
                                    value={translate.fields[0].transalte}
                                    onChange={(e) => {
                                      setTranslationJson(
                                        translationJson.map((translation) =>
                                          translation.languageId ===
                                          translate.languageId
                                            ? {
                                                ...translation,
                                                fields: translation.fields.map(
                                                  (field, index) =>
                                                    index === 0
                                                      ? {
                                                          ...field,
                                                          transalte:
                                                            e.target.value,
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
                                ) : (
                                  <InputText
                                    disabled={isView}
                                    value={translate.fields[0].transalte}
                                    onChange={(e) => {
                                      setTranslationJson(
                                        translationJson.map((translation) =>
                                          translation.languageId ===
                                          translate.languageId
                                            ? {
                                                ...translation,
                                                fields: translation.fields.map(
                                                  (field, index) =>
                                                    index === 0
                                                      ? {
                                                          ...field,
                                                          transalte:
                                                            e.target.value,
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
                                )}
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
                        ${
                          index !== translate.fields.slice(1).length - 1 &&
                          "border-b pb-2"
                        }
                          `}
                          >
                            <div className="w-1/4 flex items-center">
                              <p className="">{field.name}</p>
                            </div>
                            <div className="w-3/4 flex">
                              <div className="w-1/2 flex items-center">
                                <p className="">{field.value}</p>
                              </div>
                              <div className="w-1/2 flex items-center">
                                {field.name === "Description" ? (
                                  <TextArea
                                    disabled={isView}
                                    value={field.transalte}
                                    onChange={(e) => {
                                      setTranslationJson(
                                        translationJson.map((translation) =>
                                          translation.languageId ===
                                          translate.languageId
                                            ? {
                                                ...translation,
                                                fields: translation.fields.map(
                                                  (f) =>
                                                    f.name === field.name
                                                      ? {
                                                          ...f,
                                                          transalte:
                                                            e.target.value,
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
                                ) : (
                                  <InputText
                                    disabled={isView}
                                    value={field.transalte}
                                    onChange={(e) => {
                                      setTranslationJson(
                                        translationJson.map((translation) =>
                                          translation.languageId ===
                                          translate.languageId
                                            ? {
                                                ...translation,
                                                fields: translation.fields.map(
                                                  (f) =>
                                                    f.name === field.name
                                                      ? {
                                                          ...f,
                                                          transalte:
                                                            e.target.value,
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
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tab>
      ) : (
        <LoadingSpinner />
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
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
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
                <p className="">
                  {t("consent.preferencePurpose.selectAddTranslation")}
                </p>
                <div className="mt-7 border-t border-b w-full p-2 border-lilac-gray">
                  <p className="">{t("consent.preferencePurpose.language")}</p>
                  <Dropdown
                    disabled={isView}
                    id="dd-language"
                    className="w-full mt-2"
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
                          <p className=" text-primary-blue">
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
                className="rounded-md min-w-[100px] font-light bg-white px-4 py-1 text-sm  text-black border-solid border-2"
                onClick={() => {
                  setLanguageModal(false);
                  setSelectedLanguage(oldSelectedLanguage);
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => {
                  setOldSelectedLanguage(selectedLanguage);
                  setLanguageModal(false);
                }}
                className={`rounded-md min-w-[100px] font-light bg-primary-blue px-4 py-1 text-sm text-white`}
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

export default PreferencePurposeForm;
