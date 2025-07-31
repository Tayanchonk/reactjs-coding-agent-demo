import React, { useEffect, useState, useRef, useCallback } from "react";
import Select from "react-select";
import { IoTriangle } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  InputText,
  Button,
  ComboBox,
  ComboBoxOption,
} from "../../../../components/CustomComponent";
import InputTextArea from "../../../../components/CustomComponent/TextArea";
import "./style.css";
import { useTranslation } from "react-i18next";
import {
  extractOrgs,
  extractOrgsAndOrgLevel,
  formatDate,
} from "../../../../utils/Utils";
import ProcessExcelFile from "./processExcelFile";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import Dropdown from "../../../../components/CustomComponent/Dropdown";
import DropdownOption from "../../../../components/CustomComponent/Dropdown/DropdownOption";
import { createUsers, createOrganizations, getInterfaceDetails, bulkCreateConsentData } from '../../../../services/bulkImportDataService';
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import { getOrganizationList } from '../../../../services/organizationService';
import * as XLSX from "xlsx";
import { IBulkCreateConsentData, IBulkImportDataSubjectWithConsentData } from "../../../../interface/bulkImportData.interface";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    height: "42px",
    borderRadius: "0.375rem",
    "& input": {
      boxShadow: state.isFocused ? "none!important" : provided.boxShadow,
    },
    borderWidth: state.isFocused ? "2px" : provided.borderWidth,
    borderColor: "rgb(223 228 234)", // เปลี่ยนสี border เมื่อ focus
    boxShadow: "none", // ลบเงาที่เกิดจาก focus
  }),
  input: (provided: any) => ({
    ...provided,
    outline: "none", // เอากรอบของ input ออก
    boxShadow: "none", // เอาเงาของ input ออก
    caretColor: "black", // ตั้งค่าสี cursor
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "0.375rem",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    borderRadius: "0.375rem",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

const Info: React.FC<any> = ({
  openDrawer,
  setOpenDrawer,
  setLoading,
  mode,
  templateConfigs,
  data,
  setData,
  handleGetBulkImport
}) => {
  // ------------------------------ GLOBAL STATE ----------------------------------- //
  const { t, i18n } = useTranslation();
  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);
  const confirm = useConfirm();
  // ------------------------------ STATE ----------------------------------- //
  const [Info, setInfo] = useState<boolean>(false);
  // value input
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(true);


  const [defaultValueParent, setDefaultValueParent] = useState<any>({});
  // errors
  const [errors, setErrors] = useState<any>({});
  const [query, setQuery] = useState<string>("");
  // const [templateTypes, setTemplateTypes] = useState<any>([
  //   {
  //     importTemplateId: "8b7c6d5e-4f3a-2b1c-0d9e-8f7a6b5c4d3e",
  //     templateName: "Create/Update Consent Interface"
  //   },
  //   {
  //     importTemplateId: "7c6d5e4f-3a2b-1c0d-9e8f-7a6b5c4d3e2f",
  //     templateName: "Create Users"
  //   },
  //   {
  //     importTemplateId: "6d5e4f3a-2b1c-0d9e-8f7a-6b5c4d3e2f1a",
  //     templateName: "Create Organizations"
  //   },
  //   {
  //     importTemplateId: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
  //     templateName: "Create/Update Data Subjects"
  //   }
  // ]);
  // for update data
  const [dataInfo, setDataInfo] = useState<any>({
    createdBy: "",
    createdDate: "",
    updatedBy: "",
    updatedDate: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<any>({
    value: "",
    label: "Select Template Type"
  });

  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoRef]);

  // React.useEffect(() => {
  //   const fetchTemplates = async () => {
  //     try {
  //       const response = await getTemplatesTypes();
  //       // setTemplateTypes(response);
  //     } catch (error) {
  //       console.error("Failed to fetch template configs:", error);
  //     }
  //   };

  //   fetchTemplates();
  // }, []);
  // ----------------------------- FUNCTION ----------------------------- //
  const handleTemplateTypeChange = (selected: { value: string; label: string }) => {
    // Reset any existing file data when template changes
    setData((prev: any) => ({
      ...prev,
      datas: [],
      bulkImportDetail: {
        ...prev.bulkImportDetail,
        importTemplateId: selected.value,
        templateName: selected.label,
        fileName: undefined // Clear filename when template changes
      }
    }));
    setErrors({}); // Clear any existing errors
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const handleSetLoadingWrapper = (loading: boolean) => {
    setLoading(loading);
  };


  const handleBulkImportWrapper = (limit: number) => {
    handleGetBulkImport(limit);
  };

  // function interval input
  const handleInputChange =
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (field === "importName") {
          setData((prev: any) => ({
            ...prev,
            bulkImportDetail: {
              ...prev.bulkImportDetail,

              importName: value,
            }
          }));
        }
        if (field === "importDescription") {
          setData((prev: any) => ({
            ...prev,
            bulkImportDetail: {
              ...prev.bulkImportDetail,

              importDescription: value,
            }
          }));
        }
        // if (field === "organizationName") {
        //   setOrganizationName(value);
        //   if (errors.organizationName) {
        //     setErrors((prevErrors: any) => {
        //       const { organizationName, ...rest } = prevErrors;
        //       return rest;
        //     });
        //   }
        // } else if (field === "description") {
        //   setDescription(value);
        //   if (errors.description) {
        //     setErrors((prevErrors: any) => {
        //       const { description, ...rest } = prevErrors;
        //       return rest;
        //     });
        //   }
        // }
      };  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check if template is selected
    if (!data?.bulkImportDetail?.importTemplateId) {
      // Set template selection error
      setErrors((prev: any) => ({
        ...prev,
        templatesType: t("settings.bulkImport.create.pleaseChooseTemplateType")
      }));
      return;
    }

    // Clear previous data and errors
    setData((prevState: any) => ({
      ...prevState,
      datas: [],
      bulkImportDetail: {
        ...prevState.bulkImportDetail,
      }
    }));
    setErrors({});

    // Validate file name format first
    const { isValid, errorType } = ProcessExcelFile.validateExcelFile(file);
    if (!isValid) {
      const errorKey = errorType === "type" 
        ? "settings.bulkImport.create.invalidFileType"
        : "settings.bulkImport.create.invalidFileNameFormat";
      setErrors({ datas: errorKey });
      return;
    }

    // Handle CSV files
    if (file.type.includes("csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result: any) => {
          if (!result.data || result.data.length === 0) {
            setErrors({ datas: "settings.bulkImport.create.noDataFound" });
            return;
          }
          
          setData((prevState: any) => ({
            ...prevState,
            datas: result.data,
            bulkImportDetail: {
              ...prevState.bulkImportDetail,
              fileName: file.name
            }
          }));
        },
        error: () => {
          setErrors({ datas: "settings.bulkImport.create.invalidFileFormat" });
        },
      });
    } 
    // Handle Excel files
    else if (file.type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || 
            file.name.endsWith(".xlsx") || 
            file.name.endsWith(".xls")) {
    
      if (data.bulkImportDetail.importTemplateId === "447dfc45-cba6-482c-9dc6-89c91506546b") {          
        ProcessExcelFile.dataSubjectWithConsent(file)
        .then((result) => {
          if (!result || !result.data || result.data.length === 0) {
            console.error("No data found in result:", result);
            setErrors({ datas: "settings.bulkImport.create.noDataFound" });
            return;
          }
          
          // Check if we have data in at least one row
          const hasValidData = result.data.some(item => item && Array.isArray(item) && item.length > 0);
          if (!hasValidData) {
            console.error("No valid data fields found:", result.data);
            setErrors({ datas: "settings.bulkImport.create.noDataFound" });
            return;
          }


          setData((prevState: any) => ({
            ...prevState,
            datas: result.data,
            bulkImportDetail: {
              ...prevState.bulkImportDetail,
              fileName: file.name,
              sheetNames: result.sheetInfo ? result.sheetInfo.map(sheet => sheet.name) : []
            }
          }));

          setErrors({});
        })
        .catch((error) => {          
          console.error("Error processing Excel file:", error);
          let errorKey = "settings.bulkImport.create.invalidUploadFile";
          if (error.message) {
            if (error.message.includes("Invalid field format") || error.message.includes("Some value or data had invalid")) {
              errorKey = "settings.bulkImport.create.invalidFieldFormat";
            } else if (error.message.includes("No valid sheets found")) {
              errorKey = "settings.bulkImport.create.noDataFound";
            }else if (error.message.includes("Duplicate identifier")) { 
              errorKey = "settings.bulkImport.create.duplicatedIdentifier";
            }
          }
          
          setErrors({ datas: errorKey });
        });
      } else {
        ProcessExcelFile.otherType(file).then((result) => {
          if (!result || result.data.length === 0) {
            setErrors({ datas: "settings.bulkImport.create.noDataFound" });
            return;
          }

          setData((prevState: any) => ({
            ...prevState,
            datas: result.data,
            bulkImportDetail: {
              ...prevState.bulkImportDetail,
              fileName: file.name,
              sheetNames: result.sheetInfo ? result.sheetInfo.map(sheet => sheet.name) : []
            }
          }));

          setErrors({});
        }).catch((error) => {
          let errorKey = "settings.bulkImport.create.invalidFileType";
          if (error.message) {
            if (error.message.includes("Invalid field format") || error.message.includes("Some value or data had invalid")) {
              errorKey = "settings.bulkImport.create.invalidFieldFormat";
            } else if (error.message.includes("No valid sheets found")) {
              errorKey = "settings.bulkImport.create.noDataFound";
            }
          }
          setErrors({ datas: errorKey });
        });
      }
    } 
    // Handle unsupported file types
    else {
      setErrors({ datas: "settings.bulkImport.create.invalidFileType" });
    }
  }, [t, data, confirm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/octet-stream": [".xls", ".xlsx"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });
  function findOrgParent(orgList: any[], parentId: string) {
    return orgList.find((item) => item.organizationId === parentId);
  }
  function findOrgNameDup(orgList: any[], organizationName: string) {
    return orgList.find((item) => item.organizationName === organizationName);
  }
  function findDuplicateOrganizationNames(mappedData: any[]) {
  const nameSet = new Set();
  const duplicates = new Set();
  mappedData.forEach(item => {
    const name = item.organizationName?.trim();
    if (name) {
      if (nameSet.has(name)) {
        duplicates.add(name);
      } else {
        nameSet.add(name);
      }
    }
  });
  return Array.from(duplicates);
}
  const validateOrg = async (mappedData: any): Promise<string> => {
    const getUserSession: any = sessionStorage.getItem("user");
    const customerId = getUserSession ? JSON.parse(getUserSession).customer_id : "";
    const currentOrg = localStorage.getItem("currentOrg");
    const parsedOrg = JSON.parse(currentOrg || "");
    const currentOrgId = parsedOrg.organizationId;
    const res = await getOrganizationList(customerId,currentOrgId);
    const org = res.data;
    for (const item of mappedData) {
      if (!item.organizationParentId || item.organizationParentId.trim() === "") {
        return t("settings.bulkImport.create.orgParentIdIsRequired");
      }
      if (!item.organizationName || item.organizationName.trim() === "") {
        return t("settings.bulkImport.create.orgNameIsRequired");
      }
      if (!item.description || item.description.trim() === "") {
        return t("settings.bulkImport.create.orgDescriptionIsRequired");
      }
      const parent = findOrgParent(org, item.organizationParentId);
      if (!parent) {
        return t("settings.bulkImport.create.orgParentIdNotFound") + ` :${item.organizationParentId}`;
      }
      const orgNameDup = findOrgNameDup(org, item.organizationName);
      if (orgNameDup) {
        return t("settings.bulkImport.create.orgNameDup") + ` :${item.organizationName}`;
      }
    }
    const duplicateNames = findDuplicateOrganizationNames(mappedData);
    if (duplicateNames.length > 0) {
      // setErrors((prev: any) => ({
      //   ...prev,
      //   datas: `พบชื่อองค์กรซ้ำ: ${duplicateNames.join(", ")}`
      // }));
      return t("settings.bulkImport.create.orgNameDup") + ` :${duplicateNames.join(", ")}`;

    }
    return ""; // No errors
  }
  const handleSubmit = async () => {
    if (data.bulkImportDetail.importTemplateId === "447dfc45-cba6-482c-9dc6-89c91506546b") {
      // Extract interface ID (UUID) from filename pattern for Data Subject imports
      try {
        // Now we have mappedConsentData ready to be submitted to the backend
        // Show confirmation dialog before submitting
        confirm({
          title: t("roleAndPermission.confirmSave"),
          detail: t("roleAndPermission.descriptionConfirmSave"),
          modalType: ModalType.Save,
          onConfirm: async () => {
            try {
              setOpenDrawer(false);
              handleSetLoadingWrapper(true);

              if (!data.bulkImportDetail.fileName) throw new Error("settings.bulkImport.create.fileNameRequired")
        
              const fileName = data.bulkImportDetail.fileName;
              
              // Pattern matching for "${anyName}_${uuid}_${versionNumber}"
              const fileNameParts = fileName.split('_');
              
              if (fileNameParts.length < 3) throw new Error("settings.bulkImport.create.invalidFileNameFormat")
              
              // Get the UUID part (second to last element)
              const interfaceId = fileNameParts[fileNameParts.length - 2];
              
              // Validate if it's a valid UUID format using regex
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              
              if (!uuidRegex.test(interfaceId)) throw new Error("settings.bulkImport.create.invalidUUIDFormat")
              
              // Now you can use the interfaceId in your processing logic
              // Continue with the rest of your data subject with consent processing here

              const interfaceDetail = await getInterfaceDetails(interfaceId);

              if (!interfaceDetail || !interfaceDetail.data) throw new Error("settings.bulkImport.create.interfaceDetailsNotFound");

              const interfaceStatusId = interfaceDetail.data.interfaceStatusId;

              if (interfaceStatusId !== "b2f54e97-b9d7-47a2-9990-7ce7a5b55a64") throw new Error("settings.bulkImport.create.interfaceNotPublished");

              const interfaceDetails = interfaceDetail.data;

              const allFields: IBulkImportDataSubjectWithConsentData[] = [];        
              // Extract all fields in a single pass through the interface pages
              interfaceDetails.builder.forEach(page => {
                page.sections.forEach(section => {
                  section.contents.forEach(content => {
                    if (["data_element", "standard_purpose", "preference_purpose"].includes(content.fieldTypeName)) {
                      // Use destructuring and optional chaining for cleaner field name extraction
                      let fieldName = "";
                      let id = "";
                      
                      if (content.fieldTypeName === "data_element") {
                        fieldName = content.element?.selectedDataElement?.dataElementName || "";
                        id = content.element?.selectedDataElement?.dataElementId || "";
                      } else if (content.fieldTypeName === "standard_purpose") {
                        fieldName = content.element?.selectedStandardPurpose?.name || "";
                        id = content.element?.selectedStandardPurpose?.id || "";
                      } else if (content.fieldTypeName === "preference_purpose") {
                        fieldName = content.element?.selectedPreferencePurpose?.prefPurposeName || "";
                        id = content.element?.selectedPreferencePurpose?.prefPurposeId || "";
                      }
                        // Only add to allFields if we have a valid field name
                      if (fieldName && id) {
                        // Base field object
                        const fieldObject: IBulkImportDataSubjectWithConsentData = {
                          id,
                          fieldName,
                          fieldType: content.fieldTypeName,
                          isIdentifier: content.isIdentifier,
                          isRequired: content.isRequired
                        };
                          // For data_element fields with selection options, store the options in the field object
                        if (content.fieldTypeName === "data_element" && 
                            content.element?.selectedDataElement?.selectionJson?.options && 
                            Array.isArray(content.element.selectedDataElement.selectionJson.options)) {
                          
                          const selectionOptions = content.element.selectedDataElement.selectionJson.options;                    if (selectionOptions.length > 0) {
                            // Store all available options in the field object for later use
                            fieldObject.availableOptions = selectionOptions.map(option => option.text || "");
                            
                            // If this is a multi-select field, mark it for special processing later
                            fieldObject.isMultiSelect = content.element.selectedDataElement.selectionJson.multipleSelections === true;
                            
                            // Mark this field as having selection options to ensure proper processing later
                            fieldObject.hasSelectionOptions = true;
                          }
                        }

                        // For preference_purpose fields, also store their available options for later processing
                        if (content.fieldTypeName === "preference_purpose" && 
                            content.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.options && 
                            Array.isArray(content.element.selectedPreferencePurpose.prefPurposeSelectionJson.options)) {
                          
                          const prefOptions = content.element.selectedPreferencePurpose.prefPurposeSelectionJson.options;
                          if (prefOptions.length > 0) {
                            // Store all available options in the field object
                            fieldObject.availableOptions = prefOptions.map(option => option.text || "");
                            
                            // Check if multi-selection is allowed
                            fieldObject.isMultiSelect = content.element.selectedPreferencePurpose.prefPurposeSelectionJson.multipleSelections === true;

                          }
                        }

                        allFields.push(fieldObject);
                      }
                    }
                  });
                });
              });     
              // Validate uploaded data against the interface definition        
              
              if (!data.datas || data.datas.length === 0 || !data.datas[0]) {
                throw new Error("settings.bulkImport.create.invalidUploadedData");
              }
              
              // Access fields from the first data object (data.datas[0])
              // We use the first row to validate the structure
              const uploadedFields = data.datas[0] as IBulkImportDataSubjectWithConsentData[] || [];

              // Compare field counts - if there's a mismatch, they may be using the wrong template
              const hasConsentDate = uploadedFields.some((field: any) => field.fieldName === "ConsentDate");
              const expectedLength = hasConsentDate ? allFields.length + 1 : allFields.length;
              
              if (expectedLength !== uploadedFields.length) {
                // console.error(`Field count mismatch: expected ${expectedLength}, got ${uploadedFields.length}`);
                throw new Error("settings.bulkImport.create.fieldCountMismatch");
              }
              
              // Check if all required fields are present and have data
              for (const expectedField of allFields) {
                // Look for the matching field in uploaded data
                const matchingField = uploadedFields.find((field: IBulkImportDataSubjectWithConsentData) => field.fieldName === expectedField.fieldName);
                
                if (!matchingField) {
                  throw new Error(`settings.bulkImport.create.missingField`); // ${expectedField.fieldName} 
                }
                
                // Check if required field has data
                if (matchingField.isRequired && (!matchingField.data || matchingField.data === "")) {
                  throw new Error(`settings.bulkImport.create.emptyRequiredField`); // ${expectedField.fieldName}
                }
              }
              
              // Check for any fields with missing data (even non-required fields)
              const emptyFields = uploadedFields.filter(field => (!field.data || field.data === "") && field.isRequired);
              if (emptyFields.length > 0) {
                const emptyFieldNames = emptyFields.map(field => field.fieldName).join(", ");
                throw new Error(`settings.bulkImport.create.emptyFields`); // ${emptyFieldNames}
              }        
              // All validation passed, proceed with processing
              
              // Start mapping data for bulk consent creation
              // We'll map each row of uploaded data to IBulkCreateConsentData format
              const mappedConsentData: IBulkCreateConsentData[] = [];
              
              // Process each row of data from the uploaded file
              for (let i = 0; i < data.datas.length; i++) {
                const currentRow = data.datas[i] as IBulkImportDataSubjectWithConsentData[];
                
                // Skip rows with no data
                if (!currentRow || !Array.isArray(currentRow) || currentRow.length === 0) {
                  // console.warn("Skipping empty row", i);
                  continue;
                }
                
                // Create a new consent data object based on the interface
                const consentData: IBulkCreateConsentData = {
                  identifier: {
                    identifierType: "",
                    id: "",
                    name: "",
                    value: ""
                  },
                  dataElements: [],
                  purpose: [],
                  consentInterface: {
                    id: interfaceId,
                    organizationId: localStorage.getItem('orgParent') || '',
                    customerId: sessionStorage.getItem('user')
                      ? JSON.parse(sessionStorage.getItem('user') as string).customer_id
                      : '',
                    isTestMode: false // Default to false, can be set later if needed
                  }
                };
                  // Extract consent date if present
                const consentDateField = currentRow.find(field => field.fieldName === "ConsentDate");
                // If a consent date is provided, use it; otherwise use current date
                let consentDate = formatDate("dateTime", new Date(), {dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm:ss"});

                if (consentDateField && consentDateField.data) {
                  // Use the date string as is without cleaning quotes
                  const dateString = consentDateField.data.trim();
                  
                  try {
                    // Check if it's a valid date format - if so, use it
                    if (dateString.trim()) {
                      let parsedDate: Date;
                      
                      // Check if it matches DD/MM/YYYY format
                      const ddMmYyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                      const ddMmYyyyMatch = dateString.match(ddMmYyyyRegex);
                      
                      if (ddMmYyyyMatch) {
                        // Extract day, month, year from DD-MM-YYYY format
                        const [_, day, month, year] = ddMmYyyyMatch;
                        // Month is 0-indexed in JavaScript Date 
                        // Check if the date is in the future (ค.ศ.)
                        parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

                        if (parsedDate > new Date()) throw new Error("settings.bulkImport.create.consentDateCannotBeFuture");
                      } else {
                        // Try standard date parsing for other formats
                        parsedDate = new Date(dateString);
                      }
                      
                      if (!isNaN(parsedDate.getTime())) {
                        consentDate = formatDate("dateTime", parsedDate, {dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm:ss"});
                      }
                    }
                  } catch (error) {
                    console.warn(`Invalid date format in ConsentDate field: ${dateString}, using current date instead : ${(error as Error).message}`);
                    // Keep default value (current date) if date parsing fails
                    throw error;
                  }
                }
                
                // Create a map to efficiently look up matching interface fields by name and type
                const interfaceFieldMap = new Map<string, IBulkImportDataSubjectWithConsentData>();
                allFields.forEach(field => {
                  const key = `${field.fieldType}_${field.fieldName}`;
                  interfaceFieldMap.set(key, field);
                });
                
                // Create a map of standard purpose data to track which have preferences
                const standardPurposesWithPreferences = new Set<string>();
                  // First pass - identify standard purposes that have preferences
                for (const field of currentRow) {
                  if (field.fieldType === "preference_purpose") {
                    // Track both by ID and name
                    if (field.standardPurposeId) {
                      standardPurposesWithPreferences.add(field.standardPurposeId);
                    }
                    if (field.standardPurposeName) {
                      standardPurposesWithPreferences.add(field.standardPurposeName);
                    }
                  }
                }
                
                // Store purposes with actual data for later filtering
                const purposeWithData = new Map<string, boolean>();
                
                // Process fields based on their type
                for (const field of currentRow) {
                  if (!field || !field.fieldType) continue;
                    // Find the corresponding interface field to get the proper ID
                  const key = `${field.fieldType}_${field.fieldName}`;
                  const matchingInterfaceField = interfaceFieldMap.get(key);
                  
                  // Always use the ID from allFields when available, but allow for fallback to field.id
                  let fieldId = matchingInterfaceField?.id || "";
                  
                  // For data elements, we can fall back to the uploaded field's ID if needed
                  if (!fieldId && field.fieldType === "data_element" && field.id) fieldId = field.id;
                    
                  if (field.fieldType === "data_element") {
                    // We've already handled fieldId assignment in the prior section
                    
                    // Handle identifier specially
                    if (field.isIdentifier) {
                      const identifierName = field.fieldName || "";
                      const value = field.data ? field.data.trim() : "";

                      // Check for duplicate identifiers in existing mappedConsentData
                      // if (mappedConsentData.length > 0) {
                      //   const isDuplicate = mappedConsentData.some(existingData => 
                      //     existingData.identifier && 
                      //     existingData.identifier.value === value &&
                      //     existingData.identifier.identifierType === identifierName
                      //   );
                        
                      //   if (isDuplicate) {
                      //     console.warn(`Duplicate identifier found: ${identifierName} with value: ${value}`);

                      //     throw new Error("settings.bulkImport.create.duplicateIdentifier");
                      //   }
                      // }

                      consentData.identifier = {
                        identifierType: identifierName,
                        id: fieldId,
                        name: identifierName,
                        value: value
                      };

                      
                    } else {                
                      // Regular data element
                      const isMultiValueData = field.data && field.data.includes(',');
                      const dataElement: {
                        id: string;
                        name: string;
                        value?: string;
                        options?: { name: string; value: boolean }[];
                      } = {
                        id: fieldId,
                        name: field.fieldName || "",
                      };                
                      // First, check if we need to fetch options from interface details for this field
                      // A field should use options if:
                      // 1. It has available options from interface definition
                      // 2. OR it's marked as hasSelectionOptions in the interface field
                      // 3. OR the matching interface field has selection options
                      const shouldUseOptions = 
                        (field.availableOptions && field.availableOptions.length > 0) || 
                        field.hasSelectionOptions === true ||
                        (matchingInterfaceField?.hasSelectionOptions === true) ||
                        (matchingInterfaceField?.availableOptions && matchingInterfaceField.availableOptions.length > 0);
                        // Always handle as options if it's a selection field in the interface
                      if (shouldUseOptions) {
                        // Determine which options to use (prefer matching interface field if available)
                        const availableOptions = (matchingInterfaceField && matchingInterfaceField.availableOptions) ? 
                                                matchingInterfaceField.availableOptions : 
                                                (field.availableOptions || []);
                        // This is a data element with selection options, always handle it as options
                        const selectedValues = new Set<string>();
                        
                        // Extract selected values from the data
                        if (field.data && field.data.trim()) {
                          if (isMultiValueData) {
                            // Multi-value data: val1, val2
                            const parsedValues = field.data.split(',').map(val => val.trim()).filter(val => val !== "");
                            parsedValues.forEach(val => selectedValues.add(val.toLowerCase().trim()));
                          } else {
                            // Single value
                            const cleanedValue = field.data.trim();
                            if (cleanedValue) {
                              selectedValues.add(cleanedValue.toLowerCase().trim());
                            }
                          }
                        }                    
                        // Include ALL options from interface definition with appropriate true/false values
                        try {                  
                          try {
                            // Get all available options, ensuring we have at least an empty array
                            const availableOptions = matchingInterfaceField?.availableOptions || 
                                                  field.availableOptions || [];
                            
                            // Always format as options when availableOptions exist
                            if (availableOptions.length > 0) {
                              dataElement.options = availableOptions.map(option => {
                                const optionName = option.trim();
                                const isSelected = selectedValues.has(optionName.toLowerCase().trim());
                                
                                return {
                                  name: optionName,
                                  value: isSelected
                                };
                              });
                            } else {
                              // If we somehow have no options but we're in this branch, use the selected values
                              // and add them as selected options (value=true)
                              dataElement.options = Array.from(selectedValues).map(val => ({
                                name: val,
                                value: true
                              }));
                              
                              console.warn(`No predefined options found for ${field.fieldName}, using selected values only`);
                            }
                          } catch (error) {
                            console.error(`Error processing data element options for ${field.fieldName}:`, error);
                            dataElement.options = Array.from(selectedValues).map(val => ({
                              name: val,
                              value: true
                            }));
                          }
                        } catch (error) {
                          console.error(`Error processing options for data element ${field.fieldName}:`, error);
                          // Fallback to empty options if there's an error
                          dataElement.options = [];
                        }
                      } else if (isMultiValueData) {
                        // No predefined options but multi-value data
                        const values = field.data ? field.data.split(',').map(val => val.trim()).filter(val => val !== "") : [];
                        dataElement.options = values.map(val => ({
                          name: val,
                          value: true
                        }));
                      } else {
                        // Simple value - use as is without cleaning quotes
                        const data = field.data ? field.data.trim() : "";

                        if (field.dataElementTypeName && field.dataElementTypeName === "Date") {
                          // If a consent date is provided, use it; otherwise use current date
                          let date = formatDate("dateTime", new Date(), {dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm:ss"});
                          const dateString = data;
                          try {
                              // Check if it's a valid date format - if so, use it
                              if (dateString.trim()) {
                                let parsedDate: Date;
                                
                                // Check if it matches DD/MM/YYYY format
                                const ddMmYyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
                                const ddMmYyyyMatch = dateString.match(ddMmYyyyRegex);
                                
                                if (ddMmYyyyMatch) {
                                  // Extract day, month, year from DD-MM-YYYY format
                                  const [_, day, month, year] = ddMmYyyyMatch;
                                  // Month is 0-indexed in JavaScript Date
                                  // Check if the date is in the future (ค.ศ.)
                                  parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

                                  if (parsedDate > new Date()) throw new Error("settings.bulkImport.create.consentDateCannotBeFuture");
                                } else {
                                  // Try standard date parsing for other formats
                                  parsedDate = new Date(dateString);
                                }
                                
                                if (!isNaN(parsedDate.getTime())) {
                                  date = formatDate("dateTime", parsedDate, {dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm:ss"});
                                }
                                dataElement.value = date;
                              } else {
                                throw new Error("Invalid date format in dataElement field: " + dateString);
                              }
                          } catch (error) {
                              console.warn(`Invalid date format in dataElement field: ${dateString}, using current date instead : ${(error as Error).message}`);
                              // Keep default value (current date) if date parsing fails

                              throw error;
                          }      
                        } else {
                          dataElement.value = data;
                        }
                      }
                      
                      consentData.dataElements.push(dataElement);
                    }
                  }                  // Handle standard purpose fields
                  else if (field.fieldType === "standard_purpose") {
                    // Only process if we have a valid ID from the interface
                    if (fieldId) {                
                      // Check if data is "Confirmed" or "Not Given" (case-insensitive)
                      const data = (field.data || "").trim();
                      
                      // Validate that the value is either "Confirmed" or "Not Given"
                      if (data.toLowerCase() !== "confirmed" && data.toLowerCase() !== "not given") {
                        throw new Error(`Invalid standard purpose value: ${data}. Expected "Confirmed" or "Not Given"`);
                      }
                      
                      const purposeValue = data.toLowerCase() === "confirmed";

                      // Mark that we have data for this purpose, even if it's false/not confirmed
                      purposeWithData.set(fieldId, true);
                      const purpose = {
                        id: fieldId,
                        name: field.fieldName || "",
                        value: purposeValue,
                        consentDate: consentDate, // Add the consent date from the ConsentDate field or current date
                        preference: []
                      };
                      
                      // Check if this purpose already exists in our array (should not happen, but just in case)
                      const existingPurpose = consentData.purpose.find(p => p.id === fieldId);
                      if (!existingPurpose) {
                        consentData.purpose.push(purpose);
                      }
                    }
                  }            // Handle preference purpose fields
                  else if (field.fieldType === "preference_purpose") {
                    const standardPurposeName = field.standardPurposeName || "";
                    const standardPurposeId = field.standardPurposeId || "";
                    
                    // Skip if we don't have a related standard purpose name
                    if (!standardPurposeName) {
                      console.warn(`Missing standard purpose name for preference: ${field.fieldName}`);
                      continue;
                    }
                    
                    // First try to find the standard purpose by ID in current purposes
                    let relatedPurpose = standardPurposeId ? 
                      consentData.purpose.find(p => p.id === standardPurposeId) : null;
                    
                    // If not found by ID, look by name
                    if (!relatedPurpose) {
                      relatedPurpose = consentData.purpose.find(p => p.name === standardPurposeName);
                    }
                    
                    // If still not found, look for a standard purpose field in allFields with matching name
                    if (!relatedPurpose) {                // Find the standard purpose info from our allFields by name
                      // Use case-insensitive comparison and trim for more robust matching
                      const standardPurposeField = allFields.find(f => 
                        f.fieldType === "standard_purpose" && 
                        f.fieldName && standardPurposeName &&
                        f.fieldName.toLowerCase().trim() === standardPurposeName.toLowerCase().trim()
                      );
                        if (standardPurposeField) {
                        // Create a new standard purpose entry
                        const standardPurposeId = standardPurposeField.id || "";                        relatedPurpose = {
                          id: standardPurposeId,
                          name: standardPurposeName,
                          // Check if there's an uploaded field for this standard purpose
                          value: currentRow.some(rowField => 
                            rowField.fieldType === "standard_purpose" && 
                            (rowField.id === standardPurposeId || rowField.fieldName === standardPurposeName) && 
                            rowField.data && rowField.data.trim().toLowerCase() === "confirmed"
                          ),
                          consentDate: consentDate, // Add the consent date from the ConsentDate field or current date for standard purposes created from preferences
                          preference: []
                        };
                        
                        consentData.purpose.push(relatedPurpose);
                        purposeWithData.set(standardPurposeId, true);
                      } else {
                        console.warn(`Could not find standard purpose with name: ${standardPurposeName}`);
                        continue;
                      }
                    }
                      // Now handle the preference purpose, regardless of whether data is provided or not
                    // Make sure we have a valid ID for the preference
                    if (!fieldId) {
                      console.warn(`Missing ID for preference purpose: ${field.fieldName}`);
                      continue;
                    }
                    
                    // Create a new preference object              
                    const preference: {
                      id: string;
                      name: string;
                      options?: { name: string; value: boolean }[];
                    } = {
                      id: fieldId,  // Using lowercase 'id' to match the expected output format
                      name: field.fieldName || ""
                    };
                    
                    // Get the matching interface field with available options
                    const matchingField = matchingInterfaceField || field;
                    
                    // Process data to find selected values
                    const selectedValues = new Set<string>();
                    
                    if (field.data && field.data.trim() !== "") {
                      // Check if it's multiple values separated by comma
                      if (field.data.includes(',')) {
                        // Parse as multiple values separated by comma
                        const values = field.data.split(',').map(val => val.trim()).filter(val => val !== "");
                        values.forEach(val => selectedValues.add(val.toLowerCase().trim()));
                      } else {
                        // Handle as single value
                        const cleanedValue = field.data.trim();
                        if (cleanedValue) {
                          selectedValues.add(cleanedValue.toLowerCase().trim());
                        }
                      }
                    }
                      // Check if this field has available options from interface definition
                    if (matchingField?.availableOptions && matchingField.availableOptions.length > 0) {
                      try {
                        // Include ALL options from interface definition with appropriate values
                        preference.options = matchingField.availableOptions.map(option => ({
                          name: option,
                          // Mark as true if this option was selected, false otherwise
                          value: selectedValues.has(option.toLowerCase().trim())
                        }));
                      } catch (error) {
                        console.error(`Error processing options for preference ${field.fieldName}:`, error);
                        // Fallback to empty options if there's an error
                        preference.options = [];
                      }
                    } else if (selectedValues.size > 0) {
                      // No predefined options but we have selected values
                      preference.options = Array.from(selectedValues).map(val => ({
                        name: val,
                        value: true
                      }));
                    } else {
                      // No data and no available options, create empty options array
                      preference.options = [];
                    }
                    
                    // Add the preference to the purpose
                    relatedPurpose.preference.push(preference);
                  }
                }
                
                // Double-check the preference-to-standard purpose relationship with a second pass
                // This ensures we catch any preferences that might be linked to standard purposes that weren't directly processed
                for (const purpose of consentData.purpose) {
                  if (purpose.preference && purpose.preference.length > 0) {
                    // If purpose.value is not true, set all preference options to false

                    if (purpose.value !== true) {
                      for (const pref of purpose.preference) {
                        if (pref.options && Array.isArray(pref.options)) {
                          // Set all options to false for this preference
                          pref.options = pref.options.map(opt => ({
                            ...opt,
                            value: false
                          }));
                        }
                      }
                    }
                  }
                }

                // Filter out any purposes that don't have actual data or are empty
                consentData.purpose = consentData.purpose.filter(purpose => {
                  // Only keep purposes with valid data
                  const hasValidId = purpose.id && purpose.id.trim() !== "";
                  const hasValidName = purpose.name && purpose.name.trim() !== "";
                  
                  // Track purposes by both ID and name for more flexible lookups
                  const hasData = purposeWithData.has(purpose.id) || purposeWithData.has(purpose.name);
                  
                  // For purposes with preferences, make sure the preferences are also valid
                  if (purpose.preference && purpose.preference.length > 0) {
                    // Valid preferences should have ID, name, and options
                    purpose.preference = purpose.preference.filter(pref => 
                      pref.id && pref.id.trim() !== "" && 
                      pref.name && pref.name.trim() !== "" &&
                      ((pref.options && pref.options.length > 0) || false)
                    );
                    
                    // If this purpose has valid preferences, consider it valid even if no direct data
                    if (purpose.preference.length > 0) {
                      return hasValidId && hasValidName;
                    }
                  }
                  
                  // Only keep purposes with valid ID, name, and data
                  return hasValidId && hasValidName && hasData;
                });
                
                // Add the completed consent data object to the array
                mappedConsentData.push(consentData);
              }        // Helper function to check if a string contains multiple values in the format "value1", "value2", ...
              function isMultiValueString(str: string | undefined): boolean {
                if (!str) return false;
                // Check if the string contains at least one quoted value followed by a comma
                return /["'].*["']\s*,/.test(str);
              }
                // Helper function to parse multi-value strings like "value1", "value2", ...
              function parseMultiValueString(str: string | undefined): string[] {
                if (!str) return [];
                
                // Match all quoted strings, handling both single and double quotes
                const regex = /["']([^"']+)["']/g;
                const matches = [];
                let match;
                
                while ((match = regex.exec(str)) !== null) {
                  matches.push(match[1].trim());
                }
                
                // If no matches found but there's a string, it might be a single value without commas
                // Check if str is wrapped in quotes but doesn't have commas inside
                if (matches.length === 0 && str.trim()) {
                  const singleQuotedMatch = str.trim().match(/^["']([^"',]+)["']$/);
                  if (singleQuotedMatch) {
                    matches.push(singleQuotedMatch[1].trim());
                  }
                }
                
                return matches;
              }
                // Helper function to clean quoted strings - removes surrounding quotes if present
              function cleanQuotedString(str: string): string {
                if (!str) return '';
                
                // Handle both single and double quotes with better regex that handles quotes at start and end
                const quotesRegex = /^[\s]*["'](.*)["'][\s]*$/;
                const match = str.match(quotesRegex);
                
                // If the string is wrapped in quotes, return just the content
                if (match) {
                  return match[1].trim();
                }
                
                // Otherwise return the original string, trimmed
                return str.trim();
              }

              // Validate that all required fields are properly set before sending to API
              mappedConsentData.forEach((consentData, index) => {
                // Validate identifier
                if (!consentData.identifier.value || !consentData.identifier.name) {
                  console.warn(`Row ${index}: Missing identifier data`);
                }
                
                // Validate purposes to ensure they have IDs
                consentData.purpose = consentData.purpose.filter(purpose => {
                  if (!purpose.id || !purpose.name) {
                    console.warn(`Row ${index}: Removing purpose with missing ID or name`);
                    return false;
                  }
                  
                  // Filter preferences to ensure they have IDs
                  purpose.preference = purpose.preference.filter(pref => {
                    if (!pref.id || !pref.name) {
                      console.warn(`Row ${index}: Removing preference with missing ID or name from purpose ${purpose.name}`);
                      return false;
                    }
                    return true;
                  });
                  
                  return true;
                });
              }); 

               const customerId = sessionStorage.getItem('user')
                ? JSON.parse(sessionStorage.getItem('user') as string).customer_id
                : '';
              const organizationId = localStorage.getItem('orgParent') || '';
              const userAccountId = sessionStorage.getItem('user')
                ? JSON.parse(sessionStorage.getItem('user') as string).user_account_id
                : '';

              const payload =  {
                consentData: mappedConsentData,
                bulkImportDetail: {
                  ...data.bulkImportDetail,
                  customerId: customerId,
                  organizationId: organizationId,
                  createdBy: userAccountId,
                  modifiedBy: userAccountId
                },
                typeMode: "Import"
              }

              // console.log(`Consent data to be sent:`, payload.consentData);

              // Submit data to API
              await bulkCreateConsentData(payload);
              
              // Close drawer and refresh data
              handleBulkImportWrapper(20);           
              handleSetLoadingWrapper(false);
            } catch (error) {
              console.error("Error creating bulk consent data:", error);
              handleSetLoadingWrapper(false);

              throw error;
            }
          },
          onClose: async () => {},
        });
      } catch (error) {
        console.error("Error processing filename:", error);


        setErrors((prev: any) => ({ 
          ...prev, 
          datas: (error as Error).message.startsWith("settings.bulkImport.create.")
            ? t((error as Error).message) : "settings.bulkImport.create.processingError" 
        }));
      }

    } else {
      
    const customerId = sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user') as string).customer_id
      : '';

    const organizationId = localStorage.getItem('orgParent') || '';

    const userAccountId = sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user') as string).user_account_id
      : '';

    const matchedTemplate = templateConfigs.find(
      (template: any) => template.importTemplateId === data.bulkImportDetail.importTemplateId
    );

    const configJson = matchedTemplate ? JSON.parse(matchedTemplate.configJson) : {};

    // Find the first key that contains a mapping object (e.g., "userFields")
    const dynamicFieldKey = Object.keys(configJson).find(
      (key) => typeof configJson[key] === 'object' && !Array.isArray(configJson[key])
    );

    // New: fieldMappings is now an object where keys are "1", "2", ... and values are objects with field/title etc.
    // We want a reverse mapping: incoming CSV field (key in data item) → internal field key (field property in config)
    const fieldMappingsRaw = dynamicFieldKey ? configJson[dynamicFieldKey] : {};

    // Create a reverse lookup map: input field name → internal field key
    // We assume incoming CSV fields match either the "title" or the "field" property, depending on your source
    const reverseFieldMap: { [inputKey: string]: string } = {};
    for (const idx in fieldMappingsRaw) {
      const mapping = fieldMappingsRaw[idx];
      if (mapping && typeof mapping === 'object') {
        // Use title or field as possible input keys, you might adjust this depending on your data keys
        reverseFieldMap[mapping.title] = mapping.field;
        reverseFieldMap[mapping.field] = mapping.field;
      }
    }

    function convertToBoolean(value: any): boolean {
      if (value === true || value === 1 || value === "1") return true;
      if (value === false || value === 0 || value === "0") return false;

      if (typeof value === "string") {
        const lower = value.toLowerCase();
        if (lower === "true") return true;
        if (lower === "false") return false;
      }

      throw new Error('Invalid boolean string or value');
    }

    const mappedData = data.datas.reduce((acc: any, item: any) => {
      const mappedItem: { [key: string]: any } = {};

      Object.entries(item).forEach(([inputKey, value]) => {
        const internalFieldKey = reverseFieldMap[inputKey];
        if (internalFieldKey) {
          // Optionally convert boolean fields if you know which keys need it, e.g., accountType
          mappedItem[internalFieldKey] = value; // fallback if invalid boolean string
        }
      });

      mappedItem['customerId'] = customerId;
      mappedItem['organizationId'] = organizationId;
      mappedItem['createdBy'] = userAccountId;
      mappedItem['modifiedBy'] = userAccountId;

      acc.push(mappedItem);
      return acc;
    }, []);
    // console.log('mappedData', mappedData);
    if (data.bulkImportDetail.templateName === "Create Organizations") {
      const errorscheck = await validateOrg(mappedData);
      // console.log('errorscheck',errorscheck);
      if (errorscheck !== "") {
        // Close confirm alert and show error message
        setErrors((prev: any) => ({ ...prev, datas: errorscheck }));
        // alert(errorscheck);
        return;
      }
    }
    confirm({
      title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {

        if (data.bulkImportDetail.templateName === "Create Users") {
          function parseExcelOrStringDate(input: any) {
            if (typeof input === 'number' && !isNaN(input)) {
              // Treat as Excel serial date
              const excelEpoch = new Date(Date.UTC(1899, 11, 30));
              const jsDate = new Date(excelEpoch.getTime() + input * 86400000);
              const day = String(jsDate.getUTCDate()).padStart(2, '0');
              const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
              const year = jsDate.getUTCFullYear();
              return `${day}/${month}/${year}`;
            } else if (typeof input === 'string') {
              // Check if string matches dd/mm/yyyy format
              const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
              const match = input.match(datePattern);
              if (match) {
                const day = String(Number(match[1])).padStart(2, '0');
                const month = String(Number(match[2])).padStart(2, '0');
                const year = match[3];
                return `${day}/${month}/${year}`;
              } else {
                throw new Error('Date string is not in dd/mm/yyyy format');
              }
            } else {
              throw new Error('Unsupported date format or type');
            }
          }
          mappedData.forEach((element: any) => {
            const [day, month, year] = parseExcelOrStringDate(element.expirationDate).split('/').map(Number);
            element.accountType = convertToBoolean(element.accountType) ? "EXT" : "INT";
            element.expirationDate = new Date(year, month - 1, day);
            element.isActiveStatus = true;
          })
          const response = await createUsers({
            bulkImportDetail: {
              ...data.bulkImportDetail,
              customerId: customerId,
              organizationId: organizationId,
              createdBy: userAccountId,
              modifiedBy: userAccountId
            },
            datas: mappedData
          });

        } else if (data.bulkImportDetail.templateName === "Create Organizations") {
          const response = await createOrganizations({
            bulkImportDetail: {
              ...data.bulkImportDetail,
              customerId: customerId,
              organizationId: organizationId,
              createdBy: userAccountId,
              modifiedBy: userAccountId
            },
            datas: mappedData
          });
        }
        handleBulkImportWrapper(20);
        setOpenDrawer(false);

      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });

    }
  };


  return (
    <div
      className={`fixed z-[13] overflow-auto top-0 right-0 px-3 h-full w-[490px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${openDrawer ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="p-4">
        <button
          className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
          onClick={() => {
            setOpenDrawer(false);
            setData({});
            setErrors({});
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="size-6 h-[30px] w-[30px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="mt-4">
          <h1 className="text-xl font-semibold">
            {mode === "create"
              ? t("settings.bulkImport.create.createNew")
              : t("settings.bulkImport.create.view")}
          </h1>
          <p className=" text-base">
            {t("settings.bulkImport.create.description")}
          </p>
          <label htmlFor="togglex" className="flex items-center cursor-pointer">
          </label>
          <div className="pt-5">
            <p className="font-semibold text-base">
              {mode === "create" && <span className="text-red-900 font-semibold text-base">*</span>}
              {t("settings.bulkImport.create.importName")}
            </p>
            <InputText
              type="text"
              disabled={mode === "view"}
              placeholder={t("settings.bulkImport.create.importName")}
              minWidth="20rem"
              height="2.625rem"
              className=" mt-2 font-base"
              isError={errors.organizationName && { border: "1px solid red" }}
              value={data.bulkImportDetail?.importName || ""}
              onChange={handleInputChange("importName")}
            ></InputText>
            {errors.organizationName && (
              <p className="text-red-500 text-xs pt-1">
                {errors.organizationName}
              </p>
            )}
          </div>
          <div className="pt-5">
            <p className="font-semibold text-base">
              {mode === "create" && <span className="text-red-900 font-semibold text-base">*</span>}
              {t("settings.bulkImport.create.importDescription")}
            </p>

            <InputTextArea
              disabled={mode === "view"}
              value={data.bulkImportDetail?.importDescription || ""}
              className="text-base mt-2"
              // disabled={!isEdit}
              placeholder={`${t(
                "settings.bulkImport.create.importDescription"
              )}`}
              isError={errors.description ? true : false}
              onChange={handleInputChange("importDescription")}
              minHeight="10rem"
            />
            {errors.description && (
              <p className="text-red-500 text-xs pt-1">{errors.description}</p>
            )}
          </div>
          <div className="pt-5">
            <p className="font-semibold text-base">
              {mode === "create" && <span className="text-red-900 font-semibold text-base">*</span>}
              {t("settings.bulkImport.create.templatesType")}
            </p>
            <ComboBox
              id="ddlTemplateTypes"
              className="text-base"
              minWidth="27rem"
              disabled={mode === "view"}
              placeholder="Select Template Type"
              isError={false} // You can replace this with actual error logic
              displayName={data.bulkImportDetail?.templateName || ""}
              onChange={(e) => handleTemplateTypeChange(e)}
              onClose={() => console.log("Dropdown closed")}
              defaultValue={data.bulkImportDetail?.templateName || ""}
            >
              <div className="z-[11111111] relative bg-white">
                {templateConfigs.map((template: any) => (
                  <ComboBoxOption
                    key={template.importTemplateId || "07548427-0611-45e1-b812-c33c19f331c2"}
                    className={`hover:bg-gray-100 text-base`}
                    selected={template.importTemplateId === data.bulkImportDetail?.importTemplateId}
                    value={{
                      value: template.importTemplateId,
                      label: template.templateName
                    }}
                    onClick={() =>
                      handleTemplateTypeChange({
                        value: template.importTemplateId,
                        label: template.templateName
                      })
                    }
                  >
                    <span>{template.templateName || ""}</span>
                  </ComboBoxOption>
                ))}
              </div>
            </ComboBox>
            {errors.templatesType && (
              <p className="text-red-500 text-xs pt-1">{errors.templatesType}</p>
            )}
          </div>
          {mode === "create" &&
            <div className="pt-5 max-w-3xl mx-auto">
              <p className="font-semibold text-base">
                <span className="text-red-900">*</span> Upload file
              </p>

              <div
                {...getRootProps()}
                className={`border-dashed border-2 rounded-md mt-2 p-6 text-center cursor-pointer ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FaCloudUploadAlt className="text-4xl text-gray-300" />
                  {/* <p className="text-blue-600 font-medium">Upload a file</p> */}
                  <p className="text-sm text-gray-500">{t("settings.bulkImport.create.uploadFileDescription")}</p>
                  <p className="text-xs text-gray-400">{t("settings.bulkImport.create.fileFormat")}</p>
                </div>
              </div>              {errors.datas && (
                <p className="text-red-500 text-xs pt-2">
                  {t(errors.datas)}
                </p>
              )}

              {data.datas?.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-600">{data.bulkImportDetail.fileName}</p>
                </div>
              )}
            </div>
          }
          <div className="pt-5 pb-6">
            {mode === "view" && (
              <button
                onClick={() => setInfo(true)}
                type="button"
                className="relative flex mb-2 md:mb-0 text-black bg-[#ECEEF0] font-medium rounded-lg text-base px-5 py-1.5 text-center  "
              >
                <p className="pr-1 text-base">
                  {t("settings.organizations.create.loginfo")}
                </p>
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
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </button>
            )}

            {Info && (
              <div
                ref={infoRef}
                className="arrow-box bg-black w-[325px] fixed left-[155px] text-white py-3 px-6 mt-[-57px] rounded-lg"
              >
                <IoTriangle
                  className="absolute top-[30px] left-[-10px] text-black"
                  style={{ transform: "rotate(29deg)" }}
                />
                <div className="flex">
                  <div className="w-6/12">
                    <p className="font-semibold text-base text-[gainsboro]">
                      {t("settings.organizations.create.createDate")}
                    </p>
                    <p className=" text-base pt-2">
                      {formatDate("datetime", data.bulkImportDetail.createdDate)}
                      {/* {dataInfo.createdDate} */}
                    </p>
                  </div>
                  <div className="w-6/12">
                    <p className="font-semibold text-base text-[gainsboro]">
                      {t("settings.organizations.create.createdBy")}
                    </p>
                    <p className=" text-base pt-2">{data.bulkImportDetail.createdBy}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end border-t border-gray-300">
            <Button
              className="bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md mt-5"
              onClick={() => {
                confirm({
                  title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
                  detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
                  notify: false, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
                  modalType: ModalType.Cancel, //จำเป็น Save Cancel Delete Active Inactive
                  onConfirm: async () => {
                    setOpenDrawer(false);
                    setData({});
                    setErrors({});
                  }, //จำเป็น
                  onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
                  successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
                  errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
                });
              }}
            >
              {t("settings.organizations.create.cancel")}
            </Button>

            {mode === "create" && <Button              
              className="ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md mt-5"
              onClick={handleSubmit}
              disabled={!(
                data.datas?.length > 0 && 
                data.bulkImportDetail?.importName && 
                data.bulkImportDetail?.importDescription && 
                data.bulkImportDetail?.importTemplateId
              )}
              >
              {t("settings.bulkImport.create.save")}
            </Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
