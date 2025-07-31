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
} from "../../../../../../components/CustomComponent";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store/index";
import { getDataElements } from "../../../../../../services/dataElement.Service";
import { getOrganizationChart } from "../../../../../../services/organizationService";
import { extractOrgs, generateUUID } from "../../../../../../utils/Utils";
import {
  addContentPersonalData,
  removeContentPersonalData,
  updateContentPersonalData,
} from "../../../../../../store/slices/contentPersonalDataBuilderAndBrandingSlice";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill-new";
import { set } from "lodash";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";

interface ModalUpdateContentProps {
  open: boolean;
  setOpenUpdateModal: (open: boolean) => void;
  data: any;
}

const ModalUpdateContent: React.FC<ModalUpdateContentProps> = ({
  open,
  setOpenUpdateModal,
  data,
  // onConfirm,
}) => {
  // ------------- GLOBAL STATE -----------------
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { language } = useSelector((state: RootState) => state.language);
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);

  // ------------- LOCAL STATE -----------------
  const { t, i18n } = useTranslation();
  const [sectionName, setSectionName] = useState("");
  const [hideSection, setHideSection] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState<any>({
    id: data?.fieldTypeId,
    name: data?.fieldTypeName,
  });

  const [isRequired, setIsRequired] = useState(false);
  const [isIdentifier, setIsIdentifier] = useState(false);
  const [hideContent, setHideContent] = useState(false);

  // for content text
  const [contentTitle, setContentTitle] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [checkIdentifier, setCheckIdentifier] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const fieldType = [
    { id: "a8c66b09-3f8f-41b9-82ce-b0ea96295006", name: "data_element" },
    { id: "19fe4d36-9021-489f-b659-e611580b9f6f", name: "content_text" },
  ];
  const [arrOrgToFilterByGlobal, setArrOrgToFilterByGlobal] = useState([]); // state for global filter org

  const [optionDataElement, setOptionDataElement] = useState<any>([]);
  const [selectedDataElement, setSelectedDataElement] = useState<any>([]);


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
      selectedDataElement === ""
    ) {
      newErrors.selectedDataElement = true;
    }
    if (selectedFieldType.name === "content_text" && contentTitle === "") {
      newErrors.contentTitle = true;
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const newContentId = generateUUID();
  const handleConfirm = () => {
    if (validate()) {
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          dispatch(
            updateContentPersonalData({
              pageId: data.pageId,
              sectionId: data.sectionId,
              id: data.ContentId,
              element:
                selectedFieldType.name === "data_element"
                  ? { selectedDataElement }
                  : selectedFieldType.name === "content_text"
                  ? {
                      selectedContentText: {
                        contentFieldContentTextId: generateUUID(),
                        contentTitle: contentTitle,
                        contentBody: contentBody,
                      },
                    }
                  : selectedFieldType.name === "standard_purpose"
                  ? {
                      selectedStandardPurpose:
                        data?.element?.selectedStandardPurpose,
                    }
                  : {
                      selectedPreferencePurpose:
                        data?.element?.selectedPreferencePurpose,
                    },
              hide: hideContent,
              isRequired: isRequired,
              isIdentifier: isIdentifier,
              fieldTypeId: selectedFieldType.id,
              fieldTypeName: selectedFieldType.name,
            })
          );
          setOpenUpdateModal(false);
        },
        notify: true,
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    } else {
      console.log("errors--->", errors);
    }
    // dispatch(
    //   addContent({
    //     sectionId: sectionIdProps,
    //     content: {
    //       sectionId: sectionIdProps,
    //       ContentId: newContentId,
    //       fieldTypeId: selectedFieldType.id, // ย้ายมาที่นี่
    //       fieldTypeName: selectedFieldType.name, // ย้ายมาที่นี่
    //       element:
    //         selectedFieldType.name === "Data Element"
    //           ? { selectedDataElement }
    //           : {
    //               contentTitle: contentTitle,
    //               contentBody: contentBody,
    //             },
    //       hide: hideContent,
    //       isRequired: isRequired,
    //       isIdentifier: isIdentifier,
    //     },
    //   })
    // );

    // onConfirm(
    //   selectedFieldType.id,
    //   selectedFieldType.name,
    //   selectedDataElement.dataElementId,
    //   selectedDataElement,
    //   isRequired,
    //   isIdentifier,
    //   hideContent
    // );
    // Clear sectionName after confirming
    // setSelectedFieldType("");
    // setSelectedDataElement("");
    // setIsRequired(false);
    // setIsIdentifier(false);
    // setHideContent(false);
    // setContentTitle("");
    // setContentBody("");
    // setOpenUpdateModal(false);
  };
  const handleClose = () => {
    // รีเซ็ต state เมื่อปิด modal เพื่อป้องกันข้อมูลค้าง
    setCheckIdentifier(false);
    setOpenUpdateModal(false);
  };

  const handleDelete = () => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        dispatch(
          removeContentPersonalData({
            pageId: data.pageId,
            sectionId: data.sectionId,
            id: data.ContentId,
          })
        );
        setOpenUpdateModal(false);
      },
      notify: true,
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const functionSelectedFieldType = (item: any) => {
    setSelectedDataElement("");
    setContentTitle("");
    setContentBody("");
    setIsIdentifier(false);
    setIsRequired(false);
    setHideContent(false);
    setSelectedFieldType(item);
  };

  // ------------- USEEFFECT -----------------

  useEffect(() => {
    if (data) {
      setSelectedFieldType({
        id: data.fieldTypeId,
        name: data.fieldTypeName,
      });
      setIsIdentifier(data.isIdentifier);
      setIsRequired(data.isRequired);
      setHideContent(data.hide);
      if (data.fieldTypeName === "data_element") {
        setSelectedDataElement(data.element.selectedDataElement);
      }
      if (data.fieldTypeName === "content_text") {
        setContentTitle(data.element.selectedContentText?.contentTitle);
        setContentBody(data.element.selectedContentText?.contentBody);
      }
    }
  }, [data]);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);
  // แยก useEffect ออกเป็นสองส่วน - หนึ่งสำหรับ fetchOrgParent และอีกส่วนสำหรับ getDataElements
  useEffect(() => {
    const fetchOrgParent = async () => {
      if (orgparent !== "") {
        try {
          const res = await getOrganizationChart(user.customer_id, orgparent);
          if (res.data.isError === false) {
            const dataGlobalOrg = extractOrgs(res.data.data);
            if (dataGlobalOrg.length > 0) {
              const orgId = dataGlobalOrg.map((item: any) => item.value);
              setArrOrgToFilterByGlobal(orgId);
              searchConditionRef.current.arrOrgToFilterByGlobal = orgId;
            }
          }
        } catch (error) {
          console.error("Error fetching org chart:", error);
        }
      }
    };

    fetchOrgParent();
  }, [orgparent, user.customer_id]);

  // แยก useEffect สำหรับ getDataElements เพื่อให้ทำงานเมื่อ arrOrgToFilterByGlobal เปลี่ยน
  useEffect(() => {
    if (selectedFieldType.name === "data_element") {
      getDataElements(
        10,
        { OrganizationIds: arrOrgToFilterByGlobal },
        {
          searchTerm: "",
          page: 1,
          pageSize: 10,
          sort: "",
          status: "active",
          column: "",
        }
      )
        .then((res) => {
          // เก็บผลลัพธ์ไว้ใน state ก่อน แล้วค่อยตรวจสอบ isIdentifier
          setOptionDataElement(res.data);
            // ตรวจสอบ isIdentifier ถ้ามี selectedDataElement
          if (selectedDataElement && selectedDataElement.dataElementId) {
            const matchedDataElement: any = res.data.find(
              (item: any) => item.dataElementId === selectedDataElement.dataElementId
            );
            
            // ตั้งค่า checkIdentifier เฉพาะเมื่อพบข้อมูลที่ตรงกัน
            setCheckIdentifier(!!matchedDataElement?.isIdentifier);
          }
        })
        .catch((err) => {
          console.log("🚀 ~ err:", err);
        });
    }
  }, [selectedFieldType.name, arrOrgToFilterByGlobal, selectedDataElement?.dataElementId]);

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
                  {t("builderAndBranding.editContentField")}
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
                      selectedName={selectedFieldType.name}
                      disabled={true}
                    >
                      {fieldType.map((item) => (
                        <DropdownOption
                          className={`h-[2.625rem] ${
                            selectedFieldType.id === item.id
                              ? "bg-[#3758F9] text-white hover:bg-[#3758F9] hover:text-black"
                              : "text-black"
                          }`}
                          onClick={() => {
                            functionSelectedFieldType(item);
                            // setSelectedFieldType(item);
                          }}
                          key={item.id}
                        >
                          <span>{item.name}</span>
                        </DropdownOption>
                      ))}
                    </Dropdown>
                  </div>

                  {selectedFieldType.name === "data_element" && (
                    <div className="pt-4">
                      <p className="text-base font-semibold">
                        <span className="font-semibold text-[red]">* </span>{" "}
                        {t("builderAndBranding.contentTitle")}
                      </p>
                      <Dropdown
                        id="selectedField-Type"
                        className="w-full mt-2"
                        selectedName={
                          selectedDataElement?.dataElementName || ""
                        }
                        isError={errors.selectedDataElement}
                        disabled={true}
                      >
                        {" "}
                        {optionDataElement
                          .slice()
                          .sort((a: any, b: any) =>
                            a.dataElementName.localeCompare(b.dataElementName)
                          )
                          .map((item: any) => (
                            <DropdownOption
                              className={`h-[2.625rem] ${
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

                      {checkIdentifier === true && (
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

                      <div className="flex mt-5">
                        <Toggle
                          checked={hideContent}
                          onChange={() => {
                            setHideContent(!hideContent);
                            // dispatch(setHeaderShow({ show: !showHeader }));
                          }}
                        />
                        <div>
                          <p className="pl-2 text-base font-semibold">
                            {t("builderAndBranding.hideSection")}
                          </p>
                          <p className="pl-2 text-sm">
                            {t("builderAndBranding.hideSectionDesc")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedFieldType.name === "content_text" && (
                    <div className="pt-4">
                      <p className="text-base font-semibold">
                        <span className="font-semibold text-[red]">* </span>{" "}
                        Content Title
                      </p>
                      <InputText
                        className="w-full mt-2 mb-4"
                        placeholder="Content Title"
                        value={contentTitle}
                        isError={errors.contentTitle}
                        onChange={(e) => {
                          setContentTitle(e.target.value);
                        }}
                      />
                      {errors.contentTitle && (
                        <p className="text-[red] text-base pt-1">
                          {t("thisfieldisrequired")}
                        </p>
                      )}
                      <div>
                        <ReactQuill
                            value={contentBody}
                            modules={modules}
                            // style={{ height: "150px", marginBottom: 70 }}
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
                   
                      <div className="flex mt-5 pt-5">
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
                      </div>
                    </div>
                  )}

                  {selectedFieldType.name === "standard_purpose" && (
                    <div className="pt-4">
                      <p className="text-base font-semibold">
                        <span className="font-semibold text-[red]">* </span>{" "}
                        Content Title
                      </p>
                      <Dropdown
                        id="selectedField-Type"
                        className="w-full mt-2"
                        selectedName={
                          data?.element?.selectedStandardPurpose?.name
                        }
                        isError={errors.selectedDataElement}
                        disabled={true}
                      ></Dropdown>
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
                            Required
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
                              Used as Identifier
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex mt-5">
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
                      </div>
                    </div>
                  )}
                  {selectedFieldType.name === "preference_purpose" && (
                    <div className="pt-4">
                      <p className="text-base font-semibold">
                        <span className="font-semibold text-[red]">* </span>{" "}
                        Content Title
                      </p>
                      <Dropdown
                        id="selectedField-Type"
                        className="w-full mt-2"
                        selectedName={
                          data?.element?.selectedPreferencePurpose
                            ?.prefPurposeName
                        }
                        isError={errors.selectedDataElement}
                        disabled={true}
                      ></Dropdown>

                      <p className="text-base font-semibold pt-4">Options</p>
                      <div className="py-3">
                        {data?.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.options?.map(
                          (item: any) => (
                            <div className="flex items-center mt-2">
                              <InputText value={item.text} disabled={true} />
                            </div>
                          )
                        )}
                      </div>
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
                      <div className="flex mt-5">
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
              <Button
                onClick={handleDelete}
                className="ml-1 border-2 border-[red] text-[red] text-base font-semibold px-4 py-2 rounded-md mr-1"
              >
                {t("builderAndBranding.delete")}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalUpdateContent;
