import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  Button,
  Dropdown,
  DropdownOption,
  InputText,
  Toggle,
  ComboBox,
  ComboBoxOption,
} from "../../../../../../components/CustomComponent";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store/index";
import { getDataElements } from "../../../../../../services/dataElement.Service";
import { getOrganizationChart } from "../../../../../../services/organizationService";
import { extractOrgs, generateUUID } from "../../../../../../utils/Utils";
import { addContentPersonalData } from "../../../../../../store/slices/contentPersonalDataBuilderAndBrandingSlice";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill-new";
import {
  GetStandardPreference,
  getStandardPurposeListByCustomerId,
} from "../../../../../../services/standardPurposeService";

import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";

import { GetContentFieldType } from "../../../../../../services/consentInterfaceService";

interface ModalAddContentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sectionIdProps: string;
  sectionNameProps: string;
  pageId: string;
  pageType: string;
}

const ModalAddContent: React.FC<ModalAddContentProps> = ({
  open,
  setOpen,
  sectionIdProps,
  sectionNameProps,
  pageId,
  pageType,
  // onConfirm,
}) => {
  // ------------- GLOBAL STATE -----------------
  const dispatch = useDispatch();

  const confirm = useConfirm();

  const { language } = useSelector((state: RootState) => state.language);
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const contents = useSelector(
    (state: RootState) => state.contentPersonalDataBuilderAndBranding
  );
  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);

  // ------------- LOCAL STATE -----------------
  const { t, i18n } = useTranslation();
  const [sectionName, setSectionName] = useState("");
  const [hideSection, setHideSection] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<any>("");

  const [isRequired, setIsRequired] = useState(false);
  const [isIdentifier, setIsIdentifier] = useState(false);
  const [hideContent, setHideContent] = useState(false);

  // for content text
  const [contentTitle, setContentTitle] = useState("");
  const [contentBody, setContentBody] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const [fieldType, setFieldType] = useState<any>([]); // state for field type
  const [query, setQuery] = useState<string>("");
  // const fieldType = [
  //   { id: "a8c66b09-3f8f-41b9-82ce-b0ea96295006", name: "Data Element" },
  //   { id: "19fe4d36-9021-489f-b659-e611580b9f6f", name: "Content Text" },
  // ];
  const [fieldTypeConsentData, setFieldTypeConsentData] = useState<any>([]); // state for field type
  // const fieldTypeConsentData = [
  //   { id: "9ddfa1eb-03fa-4182-8674-926c7e317d1d", name: "Standard Purposes" },
  //   { id: "19fe4d36-9021-489f-b659-e611580b9f6f", name: "Content Text" },
  // ];
  const [arrOrgToFilterByGlobal, setArrOrgToFilterByGlobal] = useState([]); // state for global filter org
  // console.log("🚀 ~ arrOrgToFilterByGlobal:", arrOrgToFilterByGlobal)

  const [optionDataElement, setOptionDataElement] = useState<any>([]);
  const [selectedDataElement, setSelectedDataElement] = useState<any>([]);

  const [arrToFilterDataElement, setArrToFilterDataElement] = useState<any>([]); // for data element filter by org protect duplicate data element

  // for ddl standard purpose
  const [optionStandardPurpose, setOptionStandardPurpose] = useState<any>([]);
  const [selectedStandardPurpose, setSelectedStandardPurpose] = useState<any>();

  const [getPreferencePurpose, setGetPreferencePurpose] = useState<any>([]); // for preference purpose get array to save in content ** type is preference purpose
  const [getFieldTypePreferencePurpose, setGetFieldTypePreferencePurpose] =
    useState<any[]>([]);
  // for preference purpose (child of standard purpose)
  const [dataPreferencePurposeElement, setDataPreferencePurposeElement] =
    useState<any>([]);

  const searchConditionRef = useRef({
    searchTerm: "",
    status: "all",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "",
    arrOrgToFilterByGlobal: [],
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // ขนาดหัวข้อ
      ["bold", "italic", "underline", "strike"], // ตัวหนา, เอียง, ขีดเส้นใต้, ขีดฆ่า
      [{ color: [] }, { background: [] }], // 🎨 ตัวเลือกสีข้อความและสีพื้นหลัง
      [{ align: "" }, { align: "center" }, { align: "right" }, { align: "justify" }], // การจัดตำแหน่งข้อความแยกปุ่ม
      [{ list: "ordered" }, { list: "bullet" }], // รายการตัวเลขและจุด
      // ["link", "image"], // ลิงก์ และรูปภาพ
      // ["clean"], // ล้างการฟอร์แมต
    ],
  };
  // ------------- FUNCTION -----------------

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (selectedFieldType === "") {
      newErrors.selectedFieldType = true;
    }

    if (
      selectedFieldType.name === "data_element" &&
      selectedDataElement.length === 0
    ) {
      newErrors.selectedDataElement = true;
    }
    if (selectedFieldType.name === "content_text" && contentTitle === "") {
      newErrors.contentTitle = true;
    }
    if (
      selectedFieldType.name === "standard_purpose" &&
      (selectedStandardPurpose === "" || selectedStandardPurpose === undefined)
    ) {
      newErrors.standardPurpose = true;
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const newContentId = generateUUID();
  const handleConfirm = () => {
    if (validate()) {
      // console.log('data to save', selectedFieldType.name === "data_element"
      //   ? { selectedDataElement }
      //   : selectedFieldType.name === "standard_purpose" && getPreferencePurpose.length > 0 ?
      //     { selectedStandardPurpose, getPreferencePurpose } :
      //     selectedFieldType.name === "standard_purpose"
      //       ? { selectedStandardPurpose }
      //       : {
      //         selectedContentText: {
      //           contentFieldContentTextId: generateUUID(),
      //           contentTitle: contentTitle,
      //           contentBody: contentBody,
      //         },
      //       },)
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          dispatch(
            addContentPersonalData({
              pageId: pageId,
              sectionId: sectionIdProps,
              content: {
                pageId: pageId,
                sectionId: sectionIdProps,
                ContentId: newContentId,
                fieldTypeId: selectedFieldType.id, // ย้ายมาที่นี่
                fieldTypeName: selectedFieldType.name, // ย้ายมาที่นี่
                element:
                  selectedFieldType.name === "data_element"
                    ? { selectedDataElement }
                    : selectedFieldType.name === "standard_purpose"
                    ? { selectedStandardPurpose }
                    : {
                        selectedContentText: {
                          contentFieldContentTextId: generateUUID(),
                          contentTitle: contentTitle,
                          contentBody: contentBody,
                        },
                      },
                hide: hideContent,
                isRequired: isRequired,
                isIdentifier: isIdentifier,
              },
            })
          );

          if (getPreferencePurpose.length > 0) {
            getPreferencePurpose.map((item: any) => {
              dispatch(
                addContentPersonalData({
                  pageId: pageId,
                  sectionId: sectionIdProps,
                  content: {
                    pageId: pageId,
                    sectionId: sectionIdProps,
                    ContentId: generateUUID(),
                    fieldTypeId: getFieldTypePreferencePurpose[0].fieldTypeId, // ย้ายมาที่นี่
                    fieldTypeName:
                      getFieldTypePreferencePurpose[0].fieldTypeName, // ย้ายมาที่นี่
                    element: { selectedPreferencePurpose: item },
                    hide: hideContent,
                    isRequired: item.prefPurposeIsRequired,
                    isIdentifier: isIdentifier,
                  },
                })
              );
            });
          }
          setGetPreferencePurpose([]);
          setSelectedStandardPurpose("");
          previousStandardPurpose.current = null;
          // Clear sectionName after confirming
          setSelectedFieldType("");
          setSelectedDataElement("");
          setIsRequired(false);
          setIsIdentifier(false);
          setHideContent(false);
          setContentTitle("");
          setContentBody("");
          setOpen(false);
        },
        notify: true,
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });

      // Perform submit logic here
    } else {
      console.log("Validation failed!");
    }
  };

  const handleClose = () => {
    setSelectedFieldType("");
    setSelectedDataElement("");
    setIsRequired(false);
    setIsIdentifier(false);
    setHideContent(false);
    setContentTitle("");
    setContentBody("");
    setOpen(false);
    setSectionName(""); // Clear sectionName when closing the modal
    setOpen(false);
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  // ------------- USEEFFECT -----------------
  useEffect(() => {
    const GetContentFieldTypeData = async () => {
      const res = await GetContentFieldType();
      // console.log("🚀 ~ GetContentFieldTypeData ~ res:", res)
      if (res.status === 200 && res.data.length) {
        const getPreferencePurposeDataType = res.data.filter((item: any) => {
          return item.fieldTypeName === "preference_purpose";
        });
        setGetFieldTypePreferencePurpose(getPreferencePurposeDataType);
        const dataFieldType = res.data.map((item: any) => {
          return {
            id: item.fieldTypeId,
            name: item.fieldTypeName,
            description: item.description,
          };
        });
        // console.log("🚀 ~ dataFieldType ~ dataFieldType:", dataFieldType)
        const fieldType = dataFieldType.filter((e: any) => {
          return e.name === "data_element" || e.name === "content_text";
        });
        setFieldType(fieldType);
        const fieldTypeConsent = dataFieldType.filter((e: any) => {
          return e.name === "standard_purpose" || e.name === "content_text";
        });
        setFieldTypeConsentData(fieldTypeConsent);

        // setFieldType(dataFieldType);
      }
    };
    GetContentFieldTypeData();
  }, []);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    const fetchOrgParent = async () => {
      let limit = 20;
      if (orgparent !== "") {
        getOrganizationChart(user.customer_id, orgparent).then((res: any) => {
          if (res.data.isError === false) {
            const dataGlobalOrg = extractOrgs(res.data.data);
            if (dataGlobalOrg.length > 0) {
              const orgId = dataGlobalOrg.map((item: any) => item.value);
              setArrOrgToFilterByGlobal(orgId);
              searchConditionRef.current.arrOrgToFilterByGlobal = orgId;
            }
          }
        });
      }
    };

    fetchOrgParent();

    if (selectedFieldType.name === "data_element") {
      getDataElements(
        10,
        { OrganizationIds: arrOrgToFilterByGlobal },
        {
          searchTerm: "",
          page: 1,
          pageSize: 1000,
          sort: "",
          status: "active",
          column: "",
        }
      )
        .then((res) => {
          const filteredOptionDataElement = res.data.filter(
            (item: any) => !arrToFilterDataElement.includes(item.dataElementId)
          );
          setOptionDataElement(filteredOptionDataElement);
        })
        .catch((err) => {
          console.log("🚀 ~ err:", err);
        });
    }
    if (selectedFieldType.name === "standard_purpose") {
      //628bdf7e-a3df-4d79-bd77-5be30ededa10 = published
      const user = JSON.parse(getUserSession);
      const base = "organizationId==%22ab780f1f-bf67-4cee-8695-ed3efdd8a268%22";
      const result = `(${[
        base,
        ...arrOrgToFilterByGlobal.map((id) => `organizationId==%22${id}%22`),
      ].join("%20or%20")})`;

      getStandardPurposeListByCustomerId(
        user.customer_id,
        `?Filter=stdPurposeStatusId=="628bdf7e-a3df-4d79-bd77-5be30ededa10" and ${result}`
      ).then((res) => {
        const dataOptionStandardPurpose = res.results
          .map((item: any) => {
            return {
              ...item,
              id: item.standardPurposeId,
              name: item.purposeName,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setOptionStandardPurpose(dataOptionStandardPurpose);
      });
    }
  }, [selectedFieldType.id, orgparent, arrToFilterDataElement]);

  // handle Select Standard Purpose
  const previousStandardPurpose = useRef<any>(null);

  const handleTemplateTypeChange = (selected: {
    value: string;
    label: string;
  }) => {
    setSelectedDataElement((prev: any) => ({
      ...prev,
    }));
  };

  useEffect(() => {
    if (selectedStandardPurpose && selectedStandardPurpose.id) {
      previousStandardPurpose.current = selectedStandardPurpose; // อัปเดตค่าเดิม
      GetStandardPreference(selectedStandardPurpose.id).then((res) => {
        // console.log("🚀 ~ GetStandardPreference ~ res:", res)
        setSelectedStandardPurpose((prev: any) => ({
          ...prev,
          // dataPreferencePurposeElement: res,
        }));
        setGetPreferencePurpose(res);
      });
    }
  }, [selectedStandardPurpose?.id]);

  const filteredOptions = optionStandardPurpose.filter((option) =>
    option.name.toLowerCase().includes(query.toLowerCase())
  );

  function extractDataElementIds(data: any) {
    return data
      .filter((item: any) => item.element?.selectedDataElement) // เอาเฉพาะที่มี selectedDataElement
      .map((item: any) => item.element.selectedDataElement.dataElementId);
  }

  useEffect(() => {
    // ตรวจสอบว่า contents.contents มีข้อมูลหรือไม่
    if (contents.contents.length > 0) {
      const currentDataElementIds = extractDataElementIds(contents.contents);
      setArrToFilterDataElement(currentDataElementIds);
    }
  }, [contents.contents]);

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-[49]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-800/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            style={selectedFieldType.name === "content_text" ? { maxWidth: "80vw",height:"auto" } : undefined}
          >
            <div className="bg-white">
              <div>
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200 px-6"
                >
                  {t("builderAndBranding.addContentField")}
                  {/* <div>{JSON.stringify(pageId)}</div> */}
                  <p className="text-base font-normal">
                    {t("builderAndBranding.addContentFieldDesc")}
                  </p>
                </DialogTitle>
                <div className="mt-2 p-4 border-b border-gray-200 px-8 w-full">
                  <div>
                    <p className="text-base font-semibold">
                      <span className="font-semibold text-[red]">* </span>{" "}
                      {t("builderAndBranding.fieldType")}
                    </p>

                    <Dropdown
                      id="selectedField-Type"
                      className="w-full mt-2"
                      selectedName={
                        selectedFieldType?.description ||
                        t("userManagement.select")
                      }
                      isError={errors.selectedFieldType}
                      // placeholder={`select field type``}
                    >
                      {pageType === "consent_data"
                        ? fieldTypeConsentData.map((item: any) => (
                            <DropdownOption
                              className={`h-[2.625rem] ${
                                selectedFieldType.id === item.id
                                  ? "bg-[#3758F9] text-white hover:bg-[#3758F9] hover:text-black"
                                  : "text-black"
                              }`}
                              onClick={() => {
                                setSelectedFieldType(item);
                                setSelectedStandardPurpose("");
                              }}
                              key={item.id}
                            >
                              <span>{item.description}</span>
                            </DropdownOption>
                          ))
                        : fieldType.map((item: any) => (
                            <DropdownOption
                              className={`h-[2.625rem] ${
                                selectedFieldType.id === item.id
                                  ? "bg-[#3758F9] text-white hover:bg-[#3758F9] hover:text-black"
                                  : "text-black"
                              }`}
                              onClick={() => {
                                setSelectedFieldType(item);
                                setSelectedStandardPurpose("");
                              }}
                              key={item.id}
                            >
                              <span>{item.description}</span>
                            </DropdownOption>
                          ))}
                    </Dropdown>
                    {errors.selectedFieldType && (
                      <p className="text-[red] text-base pt-1">
                        {t("thisfieldisrequired")}
                      </p>
                    )}
                  </div>

                  {selectedFieldType.name === "data_element" && (
                    <div className="pt-4">
                      <p className="text-base font-semibold">
                        <span className="font-semibold text-[red]">* </span>{" "}
                        {t("builderAndBranding.contentTitle")}
                      </p>
                      <Dropdown
                        id="selectedField-Type"
                        longText={true}
                        className="w-full mt-2 whitespace-nowrap overflow-hidden text-ellipsis"
                        isError={errors.selectedDataElement}
                        selectedName={
                          selectedDataElement?.dataElementName ||
                          t("userManagement.select")
                        }
                        customeHeight={true}
                      >
                        <div className=" min-h-[400px]">
                          {optionDataElement
                            .slice()
                            .sort((a: any, b: any) =>
                              a.dataElementName.localeCompare(b.dataElementName)
                            )
                            .map((item: any) => (
                              <DropdownOption
                                className={`${
                                  selectedDataElement.dataElementId ===
                                  item.dataElementId
                                    ? "bg-[#3758F9] text-white hover:bg-[#3758F9] hover:text-black"
                                    : "text-black"
                                }`}
                                onClick={() => {
                                  setSelectedDataElement(item);
                                }}
                                key={item.dataElementId}
                              >
                                <span>{item.dataElementName}</span>
                              </DropdownOption>
                            ))}
                        </div>
                      </Dropdown>
                      {errors.selectedDataElement && (
                        <p className="text-[red] text-base pt-1">
                          {t("thisfieldisrequired")}
                        </p>
                      )}
                      <div className="flex mt-5">
                        <Toggle
                          checked={isRequired}
                          onChange={() => {
                            setIsRequired(!isRequired);
                            // dispatch(setHeaderShow({ show: !showHeader }));
                          }}
                        />
                        <div>
                          <p className="pl-2 text-base font-semibold">
                            {t("builderAndBranding.required")}
                          </p>
                        </div>
                      </div>
                      {selectedDataElement?.isIdentifier && (
                        <div className="flex mt-5">
                          <Toggle
                            checked={isIdentifier}
                            onChange={() => {
                              setIsIdentifier(!isIdentifier);
                              // dispatch(setHeaderShow({ show: !showHeader }));
                            }}
                          />
                          <div>
                            <p className="pl-2 text-base font-semibold">
                              {t("builderAndBranding.identifier")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* <div className="flex mt-5">
                        <Toggle
                          checked={hideContent}
                          onChange={() => {
                            setHideContent(!hideContent);
                            // dispatch(setHeaderShow({ show: !showHeader }));
                          }}
                        />
                        <div>
                          <p className="pl-2 text-base font-semibold">
                            Hide This Section
                          </p>
                          <p className="pl-2 text-sm">
                            If you hide this Section, Will not be displayed in
                            the Preview.
                          </p>
                        </div>
                      </div> */}
                    </div>
                  )}
                  {selectedFieldType.name === "content_text" && (
                    <div className="pt-4">
                      <p className="text-base font-semibold">
                        <span className="font-semibold text-[red]">* </span>{" "}
                        {t("builderAndBranding.contentTitle")}
                      </p>
                      <InputText
                        className="w-full mt-2 mb-2"
                        placeholder={t("builderAndBranding.contentTitle")}
                        value={contentTitle}
                        isError={errors.contentTitle}
                        onChange={(e) => {
                          setContentTitle(e.target.value);
                        }}
                      />
                      {errors.contentTitle && (
                        <p className="text-[red] text-base">
                          {t("thisfieldisrequired")}
                        </p>
                      )}
                      <div >
                        <ReactQuill
                          value={contentBody}
                          modules={modules}
                          onChange={(e) => {
                            // const styledContent = `
                            //                       <div style="font-size: ${fontSize.value}; color: ${fontColor};">
                            //                         ${e}
                            //                       </div>
                            //                     `;
                            setContentBody(e);
                          }}
                        />
                        <style dangerouslySetInnerHTML={{
                          __html: `
                            .ql-editor {
                              min-height: 150px !important;
                              height: auto !important;
                              max-height: none !important;
                              overflow-y: auto !important;
                            }
                            .ql-container {
                              height: auto !important;
                            }
                          `
                        }} />
                      </div>
                    </div>
                  )}
                  {selectedFieldType.name === "standard_purpose" && (
                    <div className="pt-4">
                      <p className="text-base font-semibold">
                        <span className="font-semibold text-[red]">* </span>{" "}
                        Content Title
                      </p>
                      {/* <Dropdown
                        id="selectedFieldStdPurpose-Type"
                        className="w-full mt-2"
                        isError={errors.standardPurpose}
                        selectedName={selectedStandardPurpose?.name || ""}
                      >
                        {optionStandardPurpose.map((item: any) => (
                          <DropdownOption
                            className={`h-[2.625rem] ${selectedDataElement.dataElementId === item.standardPurposeId
                              ? "bg-[#3758F9] text-white hover:bg-[#3758F9] hover:text-black"
                              : "text-black"
                              }`}
                            onClick={() => {
                              setSelectedStandardPurpose(item);
                            }}
                            key={item.standardPurposeId}
                          >
                            <span>{item.purposeName}</span>
                          </DropdownOption>
                        ))}
                      </Dropdown> */}
                      <ComboBox
                        minWidth="100%"
                        customeHeight={true}
                        id="ddlTemplateTypes"
                        className="text-base w-full mt-2"
                        placeholder={t("userManagement.select")}
                        isError={false} // You can replace this with actual error logic
                        displayName={selectedStandardPurpose?.name || ""}
                        onChange={(e) => setQuery(e)}
                        onClose={() => setQuery("")}
                        defaultValue={selectedStandardPurpose?.name || ""}
                      >
                        <div className="z-[11111111] relative bg-white">
                          {filteredOptions.map((item: any) => (
                            <ComboBoxOption
                              key={item.standardPurposeId}
                              className={`hover:bg-gray-100 text-base ${
                                selectedDataElement.dataElementId ===
                                item.standardPurposeId
                                  ? "text-white"
                                  : ""
                              }`}
                              selected={
                                selectedDataElement.dataElementId ===
                                item.standardPurposeId
                              }
                              value={{
                                id: item.standardPurposeId,
                                name: item.purposeName,
                              }}
                              onClick={() => setSelectedStandardPurpose(item)}
                            >
                              <span>{item.purposeName}</span>
                            </ComboBoxOption>
                          ))}
                        </div>
                      </ComboBox>

                      {errors.standardPurpose && (
                        <p className="text-[red] text-base pt-1">
                          {t("thisfieldisrequired")}
                        </p>
                      )}
                      {/* {getPreferencePurpose.length === 0 && ( */}
                      <div className="flex mt-5">
                        <Toggle
                          checked={isRequired}
                          onChange={() => {
                            setIsRequired(!isRequired);
                            // dispatch(setHeaderShow({ show: !showHeader }));
                          }}
                        />
                        <div>
                          <p className="pl-2 text-base font-semibold">
                            Required
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 sm:flex sm:flex-row-reverse ">
              <Button
                onClick={handleConfirm}
                className="ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
              >
                {t("builderAndBranding.save")}
              </Button>
              <Button
                className="bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
                onClick={handleClose}
              >
                {t("builderAndBranding.cancel")}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAddContent;
