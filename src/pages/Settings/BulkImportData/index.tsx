import React, { useState, useMemo, useCallback, useRef } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import debounce from "lodash.debounce";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getImportRecords,
  getInterfaceDetails,
  getPublishedInterfaceList,
  getTemplates,
} from "../../../services/bulkImportDataService";
import {
  getOrganizationChart,
  getOrganizationList,
} from "../../../services/organizationService";
import {
  IInterfaceDetails,
  ImportRecordResponse,
} from "../../../interface/bulkImportData.interface";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import { ModalType } from "../../../enum/ModalType";
import { formatDate } from "../../../utils/Utils";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Dialog } from "@headlessui/react";
import Info from "./Drawer/Info";
import { useConfirm } from "../../../context/ConfirmContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type TemplateConfig = {
  importTemplateId: string;
  templateName: string;
  configJson: string;
};

import {
  Button,
  InputText,
  Table,
  SortingHeader,
  Dropdown,
  DropdownOption,
  ComboBox,
  ComboBoxOption,
} from "../../../components/CustomComponent";
import { getInterfaceList } from "../../../services/dataRetentionService";
const BulkImportDataPage = () => {
  let { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  const [selectedInterface, setSelectedInterface] = useState({
    label: "",
    value: "",
  });
  const [searchTerm4Interface, setSearchTerm4Interface] = useState("");
  const [isSelectedInterface, setIsSelectedInterface] = useState(true);
  const [bulkImport, setBulkImport] = useState<ImportRecordResponse>({
    data: [],
    pagination: { page: 1, per_page: 5, total_pages: 1, total_items: 1 },
  });
  const [loading, setLoading] = useState(false);
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [OpenDrawerMode, setOpenDrawerMode] = useState<any>("view");
  const [templateConfigs, setTemplateConfigs] = useState<TemplateConfig[]>([]);
  const [data, setData] = useState<any>({ bulkImportDetail: {} });

  // mock data for bulk import
  const bulkImportAllInterfaces = [
    {
      value: "9a9e6a2e-3d9b-4d69-8b1d-12c541b187a2",
      label: "test_interfaces_version_1",
    },
    {
      value: "1c394a4d-ef5d-4a32-a07f-3f9d9d7a6e43",
      label: "test_interfaces_version_2",
    },
    {
      value: "b7e65c66-f80c-4624-9a44-74db30e3e294",
      label: "test_interfaces_version_3",
    },
    {
      value: "c5e8c57a-bf27-476f-a8ef-c1fd09b0c892",
      label: "test_interfaces_version_4",
    },
  ];
  const [interfaces, setInterfaces] = useState<
    { value: string; label: string }[]
  >(bulkImportAllInterfaces);

  const filteredInterfaceOptions = interfaces.filter((option) =>
    option.label.toLowerCase().includes(searchTerm4Interface.toLowerCase())
  );

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const searchConditionRef = useRef({
    searchTerm: "",
    status: "all",
    page: 1,
    pageSize: 20,
    sort: "",
    column: "",
  });
  const [selectedStatus, setSelectedStatus] = useState({
    label: t("settings.bulkImport.status.all"),
    value: "all",
  });
  const [stdStatus, setStdStatus] = useState([
    {
      label: t("settings.bulkImport.status.all"),
      value: "all",
    },
    {
      label: t("settings.bulkImport.status.completed"),
      value: "Completed",
    },
    {
      label: t("settings.bulkImport.status.error"),
      value: "Error",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("importId")}
            title="settings.bulkImport.importID"
          />
        ),
        accessor: "importId",
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("importName")}
            title="settings.bulkImport.importName"
          />
        ),
        accessor: "importName",
        Cell: ({ row }: { row: any }) => (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setOpenDrawerMode("view");
              setData({ bulkImportDetail: row.original });
              setOpenDrawer(true);
            }}
          >
            <div className="relative group ml-2 justify-start">
              <p
                className="text-primary-blue font-medium"
                style={{
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.original.importName}
              </p>
              <div className="absolute text-left bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                {row.original.importName}
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("templatesType")}
            title="settings.bulkImport.templatesType"
          />
        ),
        accessor: "templatesType",
        // header center
        align: "center",
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("status")}
            title="settings.bulkImport.importStatus"
            center={true}
          />
        ),
        accessor: "status",
        Cell: ({ value }: { value: string }) => (
          <span
            className={`flex justify-center px-2 py-1 rounded-md 
            ${
              value === "Completed"
                ? "bg-green-100 text-green-700"
                : value === "Error"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("createdBy")}
            title="settings.bulkImport.createdBy"
          />
        ),
        accessor: "createdBy",
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("createdDate")}
            title="settings.bulkImport.createdDate"
            center={true}
          />
        ),
        align: "center",
        accessor: "createdDate",
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">{formatDate("datetime", value)}</div>
        ),
      },
    ],
    [t, orgparent]
  );

  const handleGetBulkImport = async (limit: number) => {
    try {
      if (orgparent !== "") {
        setLoading(true);
        const customerId = sessionStorage.getItem("user")
          ? JSON.parse(sessionStorage.getItem("user") as string).customer_id
          : "";
        var res = await getOrganizationChart(customerId, orgparent);
        var org = res.data.data;
        const orgList: string[] = [];
        orgList.push(org[0].id);
        if (org[0].organizationChildRelationship.length > 0) {
          org[0].organizationChildRelationship.forEach((element: any) => {
            orgList.push(element.id);
            if (element.organizationChildRelationship.length > 0) {
              element.organizationChildRelationship.forEach((child: any) => {
                orgList.push(child.id);
                if (child.organizationChildRelationship.length > 0) {
                  child.organizationChildRelationship.forEach((child2: any) => {
                    orgList.push(child2.id);
                  });
                }
              });
            }
          });
        }

        const response: any = await getImportRecords(
          limit,
          searchConditionRef.current
        );
        response.data.forEach((element: any) => {
          element.templateName = element.templatesType;
        });
        setBulkImport(response);

        const getInterfaces = (await getPublishedInterfaceList(orgList)) as {
          data: { data: { interfaceId: string; interfaceName: string }[] };
        };

        let interfacesData = getInterfaces.data.data.map((item: any) => ({
          value: item.interfaceId,
          label: `${item.interfaceName}_version ${item.versionNumber}`,
        }));

        // sort result by label in English and then Thai.
        await interfacesData.sort(
          (a, b) =>
            a.label.localeCompare(b.label, "en", { sensitivity: "base" }) ||
            a.label.localeCompare(b.label, "th", { sensitivity: "base" })
        );

        setInterfaces(interfacesData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("error", error);
    }
  };
  const handleDownloadExcelInterface = async () => {
    try {
      setLoading(true);
      setIsOpenImport(false);

      // Get the selected interface details
      const interfaceDetailsResponse = await getInterfaceDetails(
        selectedInterface.value
      );

      // Store the interface details
      const interfaceDetails = interfaceDetailsResponse.data;

      // console.log("interfaceDetails", interfaceDetails);

      if (!interfaceDetails || !interfaceDetails.builder) {
        console.error("No interface details found");
        return;
      }

      // Prepare headers and data arrays
      // Initialize headers and data arrays
      const headers: string[] = [];
      const dataPage1: string[] = [];
      const dataPage2: string[] = []; // Initialize variables for identifier and standard purpose
      // These will be used to store the identifier and standard purpose names
      let identifier: string = "";
      let stdPurPose: string = "";

      // Define a constant for the empty field text
      const text4Page2EmptyField = "กรุณากรอกข้อมูล";
      const text4Page2DateField = `'DD/MM/YYYY (ค.ศ.) เช่น '01/01/2025`;

      // Add common headers
      headers.push("ConsentDate");
      dataPage1.push("");
      dataPage2.push(text4Page2DateField);

      // Iterate through the interface details to extract data elements and purposes
      // Check if interfaceDetails and builder exist
      if (interfaceDetails && interfaceDetails.builder) {
        // Loop through each page in the builder
        // This assumes that builder is an array of pages
        for (const page of interfaceDetails.builder) {
          // Check if the page has sections
          // This assumes that each page can have multiple sections
          if (page.sections) {
            // Loop through each section in the page
            for (const section of page.sections) {
              // Check if the section has contents
              // This assumes that each section can have multiple contents
              if (section.contents) {
                // Loop through each content in the section
                // This assumes that each content can be a data element, standard purpose, or preference purpose
                for (const content of section.contents) {
                  // Check the fieldTypeName to determine the type of content
                  // This assumes that fieldTypeName can be "data_element", "standard_purpose", "preference_purpose", or "content_text"
                  const isRequired = content.isRequired || false;
                  if (content.fieldTypeName === "data_element") {
                    const elementName =
                      content.element.selectedDataElement?.dataElementName ||
                      "";
                    const dataElementTypeName =
                      content.element.selectedDataElement
                        ?.dataElementTypeName || "";
                    const isIdentifier = content.isIdentifier;

                    // Check if the element is an identifier
                    if (isIdentifier) {
                      identifier = elementName || "";
                      headers.unshift(
                        `${
                          isRequired ? "*" : ""
                        }DataSubjectIdentifier_${identifier}`
                      );
                      dataPage1.unshift("");
                      dataPage2.unshift(text4Page2EmptyField);
                    } else {
                      headers.push(`${isRequired ? "*" : ""}DE_${elementName}`);
                      dataPage1.push("");

                      // Handle selection JSON properly
                      const elementSelectionJson =
                        content.element.selectedDataElement?.selectionJson;

                      // Check if selectionJson exists and has options
                      if (
                        elementSelectionJson &&
                        elementSelectionJson.options &&
                        elementSelectionJson.options.length > 0
                      ) {
                        const selection = elementSelectionJson.options
                          .map((value: any) => `${value.text}`)
                          .join(", ");
                        dataPage2.push(selection);
                      } else {
                        const textToPush =
                          dataElementTypeName === "Date"
                            ? text4Page2DateField
                            : text4Page2EmptyField;
                        dataPage2.push(textToPush);
                      }
                    } // If the content is a standard purpose
                  } else if (content.fieldTypeName === "standard_purpose") {
                    const stdPurPoseName =
                      content.element.selectedStandardPurpose?.name || "";
                    headers.push(
                      `${isRequired ? "*" : ""}SP_${stdPurPoseName}`
                    );
                    dataPage1.push("");
                    dataPage2.push(`Confirmed, Not Given`);

                    // If the content is a preference purpose
                  } else if (content.fieldTypeName === "preference_purpose") {
                    const prefPurpose =
                      content.element.selectedPreferencePurpose
                        ?.prefPurposeName || "";

                    // Search through all pages, sections and contents for the standard purpose name
                    let found = false;
                    interfaceDetails.builder.forEach((searchPage) => {
                      if (found) return;
                      searchPage.sections.forEach((searchSection) => {
                        if (found) return;
                        searchSection.contents.forEach((searchContent) => {
                          if (found) return;

                          if (
                            searchContent.fieldTypeName === "standard_purpose"
                          ) {
                            // Get the standard purpose ID for comparison
                            const stdPurposeId =
                              searchContent.element?.selectedStandardPurpose
                                ?.id || "";
                            const stdPurposeName =
                              searchContent.element?.selectedStandardPurpose
                                ?.name || "";
                            const prefStdPurposeId =
                              content.element?.selectedPreferencePurpose
                                ?.stdPurposeId || "";

                            // Check for exact match or case-insensitive match
                            if (
                              stdPurposeId &&
                              prefStdPurposeId &&
                              (stdPurposeId === prefStdPurposeId ||
                                stdPurposeId.toLowerCase() ===
                                  prefStdPurposeId.toLowerCase())
                            ) {
                              stdPurPose = stdPurposeName;
                              found = true;
                            }
                          }
                        });
                      });
                    });

                    headers.push(
                      `${isRequired ? "*" : ""}PP_${stdPurPose}_${prefPurpose}`
                    );
                    dataPage1.push("");

                    const selectionJson =
                      content.element.selectedPreferencePurpose
                        ?.prefPurposeSelectionJson;

                    // Check if selectionJson exists and has options
                    if (
                      selectionJson &&
                      selectionJson.options &&
                      selectionJson.options.length > 0
                    ) {
                      const selection = selectionJson.options
                        .map((value: any) => `${value.text}`)
                        .join(", ");
                      dataPage2.push(selection);
                    } else {
                      dataPage2.push(text4Page2EmptyField);
                    }
                  } else if (content.fieldTypeName === "content_text") {
                    // Skip content_text fields or handle them differently if needed
                    continue;
                  }
                }
              }
            }
          }
        }
      }

      // Create worksheet from arrays
      const page1 = [headers, dataPage1];
      const page2 = [headers, dataPage2];

      // Create workbook and worksheets
      const wb = XLSX.utils.book_new();
      const worksheet1 = XLSX.utils.aoa_to_sheet(page1);
      const worksheet2 = XLSX.utils.aoa_to_sheet(page2);

      // ฟังก์ชันกำหนด format เป็น text สำหรับ worksheet
      const setWorksheetTextFormat = (worksheet: any) => {
        if (!worksheet["!ref"]) return;
        
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            
            // สร้าง cell ใหม่ถ้าไม่มี หรือใช้ของเดิมถ้ามี
            if (!worksheet[cellAddress]) {
              worksheet[cellAddress] = { v: "", t: "s" };
            }
            
            // กำหนด format เป็น text
            worksheet[cellAddress].s = worksheet[cellAddress].s || {};
            worksheet[cellAddress].s.numFmt = "@"; // '@' = text format
            worksheet[cellAddress].t = "s"; // string type
          }
        }
      };

      // กำหนด format เป็น text สำหรับทั้งสอง sheet
      setWorksheetTextFormat(worksheet1);
      setWorksheetTextFormat(worksheet2);

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(wb, worksheet1, "Consent Data");
      XLSX.utils.book_append_sheet(wb, worksheet2, "Example Data");

      // Export the file
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });

      // Use saveAs from file-saver to download the file
      saveAs(
        blob,
        `Create_Update Data Subject With Consents_${interfaceDetails.interfaceId}_${interfaceDetails.versionNumber}.xlsx`
      );

      // Reset selected interface and close import dialog
      setIsSelectedInterface(true);
      setSelectedInterface({ label: "", value: "" });
      setLoading(false);
    } catch (error) {
      console.error("Error generating Excel template:", error);
    }
  };

  const handleDownloadExcelOrg = async (selectedTemplate: any, column: any) => {
    // Mock data สำหรับ 2 sheet

    const sheet1Data = column;
    // console.log("sheet1Data",sheet1Data)
    const getUserSession: any = sessionStorage.getItem("user");
    const customerId = getUserSession
      ? JSON.parse(getUserSession).customer_id
      : "";
    const currentOrg = localStorage.getItem("currentOrg");
    const parsedOrg = JSON.parse(currentOrg || "");
    const currentOrgId = parsedOrg.organizationId;
    const res = await getOrganizationList(customerId, currentOrgId);
    const org = res.data.filter((item: any) => item.organizationLevel <= 3);
    const item = org.map((data: any) => {
      return {
        organizationId: data.organizationId,
        organizationName: data.organizationName,
      };
    });

    const sheet2Data = item;
    // console.log("sheet2Data",sheet2Data)
    // สร้าง worksheet จาก JSON
    const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
    const ws2 = XLSX.utils.json_to_sheet(sheet2Data);
    // สร้าง workbook และเพิ่ม sheet เข้าไป
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Data");
    XLSX.utils.book_append_sheet(wb, ws2, "Organizations");
    // เขียนไฟล์เป็น Blob แล้ว save
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, selectedTemplate.templateName + ".xlsx");
  };
  const getAllValuesFromConfigJson = (configJsonString: string): any[] => {
    try {
      const configJson = JSON.parse(configJsonString);
      const values: any[] = [];
      // organizationFields is an object with keys "1", "2", ...
      if (
        configJson.organizationFields &&
        typeof configJson.organizationFields === "object"
      ) {
        Object.values(configJson.organizationFields).forEach((group: any) => {
          if (group.title) {
            values.push({ [group.title]: "" });
          }
        });
      }
      return values;
    } catch (e) {
      console.error("Invalid configJson:", e);
      return [];
    }
  };
  React.useEffect(() => {
    handleGetBulkImport(20);
  }, [orgparent]);

  const handlePageChange = (page: number) => {
    let limit = 20;
    let searchTerm = "";
    let pageSize = 5;
    searchConditionRef.current.page = page;
    handleGetBulkImport(limit);
  };

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 20;
      searchConditionRef.current.searchTerm = searchTerm;

      handleGetBulkImport(limit);
    }, 300), // 300ms delay
    []
  );

  const handleSort = (column: string) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "ASC" ? "DESC" : "ASC";
    searchConditionRef.current.column = column;
    let limit = 20;
    handleGetBulkImport(limit);
  };

  React.useEffect(() => {
    let limit = 20;
    handleGetBulkImport(limit);
    const fetchTemplates = async () => {
      try {
        const response = await getTemplates();
        setTemplateConfigs(response);
      } catch (error) {
        console.error("Failed to fetch template configs:", error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="px-12">
        <p className="text-xl font-semibold">
          {t("settings.bulkImport.bulkImport")}
        </p>
        <p className="">{t("settings.bulkImport.description")}</p>
        <div className="flex justify-between w-100 mt-4">
          <div className="flex gap-2 items-center">
            <InputText
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
              placeholder={t("interface.listview.input.search")}
              minWidth="20rem"
              disabled={loading}
            ></InputText>
            <Dropdown
              id="selectedStatus"
              title=""
              className="w-full"
              selectedName={selectedStatus.label}
              disabled={loading}
              isError={false}
              minWidth="10rem"
            >
              {stdStatus.map((item) => (
                <DropdownOption
                  selected={selectedStatus.value === item.value}
                  onClick={() => {
                    setSelectedStatus(item);
                    searchConditionRef.current.status = item.value;
                    let limit = 20;
                    handleGetBulkImport(limit);
                  }}
                  key={item.value}
                >
                  <span
                    className={`${
                      selectedStatus.value === item.value ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </DropdownOption>
              ))}
            </Dropdown>
            <IoFilterOutline className="text-[1.75rem] text-dark-gray"></IoFilterOutline>
          </div>
          <div className="w-9/12 flex space-x-2 justify-end">
            {permissionPage?.isCreate && (
              <Button
                onClick={() => {
                  setIsOpenImport(true);
                }}
                variant="outlined"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <FiDownload className="text-primary-blue text-lg" />
                <p className="text-primary-blue text-base">
                  {t("settings.bulkImport.importTemplate")}
                </p>
              </Button>
            )}
            {permissionPage?.isCreate && (
              <Button
                className="flex items-center gap-2 bg-primary-blue text-white"
                onClick={() => {
                  setOpenDrawerMode("create");
                  setData({ bulkImportDetail: {} });
                  setOpenDrawer(true);
                }}
                disabled={loading}
              >
                <IoAdd className="text-lg"></IoAdd>
                <span className="text-white text-sm font-semibold">
                  {t("settings.bulkImport.createNew")}
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="border-b border-lilac-gray mt-4"></div>
        <div className="w-full">
          <Table
            columns={columns}
            data={bulkImport.data || []}
            pagination={bulkImport.pagination}
            handlePageChange={handlePageChange}
            loading={loading}
            pageSize={searchConditionRef.current.pageSize}
          />
        </div>
      </div>
      <Dialog
        open={isOpenImport}
        onClose={() => {
          setIsOpenImport(false);
          setIsSelectedInterface(true);
          setSelectedInterface({ label: "", value: "" });
        }}
        className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
      >
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative">
          <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {/* ❌ Close icon */}{" "}
            <button
              onClick={() => {
                setIsOpenImport(false);
                setIsSelectedInterface(true);
                setSelectedInterface({ label: "", value: "" });
              }}
              className="absolute top-4 right-4 text-gray-700 hover:text-black text-4xl leading-none"
              aria-label="Close"
            >
              &times; {/* or use an SVG/icon if you prefer */}
            </button>
            <div className="flex items-start gap-2 pt-6 pr-6 pl-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {t("settings.bulkImport.template.title")}
                </h2>
                <p className="text-gray-600 text-base mt-1">
                  {t("settings.bulkImport.template.description")}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-md pr-6">
              {[
                "447dfc45-cba6-482c-9dc6-89c91506546b",
                "a7dd9e1b-99e6-4b22-9235-7b7d3d6398e9",
                "07548427-0611-45e1-b812-c33c19f331c2",
              ].map((item) => (
                <div
                  key={item}
                  className="flex border border-solid border-x border-t border-b items-center justify-between p-4"
                >
                  <div className="flex w-full">
                    <div className="w-10/12">
                      <p className="font-semibold">
                        {t(`settings.bulkImport.template.data.${item}.type`)}
                      </p>
                      <p>
                        {t(
                          `settings.bulkImport.template.data.${item}.description`
                        )}
                      </p>
                      {item === "447dfc45-cba6-482c-9dc6-89c91506546b" && (
                        <div className="mt-5">
                          <label
                            htmlFor="dataElementType"
                            className="block mb-2 font-medium text-base/6"
                          >
                            <span className="pr-2" style={{ color: "red" }}>
                              *
                            </span>
                            {t(
                              `settings.bulkImport.template.data.${item}.selectInterface`
                            )}
                          </label>

                          <ComboBox
                            minWidth="100%"
                            customeHeight={true}
                            id="selectedInterface"
                            className="text-base w-full mt-2"
                            placeholder={t(
                              "settings.bulkImport.template.selectInterfacePlaceholder"
                            )}
                            isError={!isSelectedInterface} // You can replace this with actual error logic
                            displayName={selectedInterface.label || ""}
                            onChange={(e) => setSearchTerm4Interface(e)}
                            onClose={() => setSearchTerm4Interface("")}
                            defaultValue={selectedInterface.label || ""}
                          >
                            <div className="z-[11111111] relative bg-white">
                              {filteredInterfaceOptions.map((item) => (
                                <ComboBoxOption
                                  key={item.value}
                                  className={`hover:bg-gray-100 text-base ${
                                    selectedInterface.label === item.label
                                      ? "text-white"
                                      : ""
                                  }`}
                                  selected={
                                    selectedInterface.value === item.value
                                  }
                                  value={item}
                                  onClick={() => {
                                    setSelectedInterface(item);
                                    setIsSelectedInterface(true);
                                  }}
                                >
                                  <span>{item.label}</span>
                                </ComboBoxOption>
                              ))}
                            </div>
                          </ComboBox>
                          {!isSelectedInterface && (
                            <p className="text-red-500 pt-2">
                              {t(
                                "purpose.standardPurpose.tabs.standardPurposeInfo.thisfieldisrequired"
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="min-w-[160px] bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 whitespace-nowrap break-keep"
                    onClick={async () => {
                      if (item === "447dfc45-cba6-482c-9dc6-89c91506546b") {
                        if (selectedInterface.value === "") {
                          setIsSelectedInterface(false);
                        } else {
                          handleDownloadExcelInterface();
                        }
                      } else {
                        let configJson: any = {};

                        const selectedTemplate = templateConfigs.find(
                          (t) => t.importTemplateId === item
                        );
                        if (
                          selectedTemplate?.templateName !==
                          "Create Organizations"
                        ) {
                          if (selectedTemplate) {
                            try {
                              configJson = JSON.parse(
                                selectedTemplate.configJson
                              );
                            } catch (error) {
                              console.error(
                                "Invalid JSON in configJson:",
                                error
                              );
                            }
                          }

                          const headers: string[] = [];
                          const headerTableRows: {
                            "Field Name": string;
                            Description: string;
                            Required: boolean;
                          }[] = [];

                          for (const groupKey in configJson) {
                            const group = configJson[groupKey];

                            for (const key in group) {
                              const fieldObj = group[key];

                              if (fieldObj && typeof fieldObj === "object") {
                                const title =
                                  fieldObj.title || fieldObj.field || key;
                                headers.push(title);

                                // Add leading apostrophe to force Excel text + convert literal \n to real newlines
                                const description =
                                  "'" +
                                  (fieldObj.description || "").replace(
                                    /\\n/g,
                                    "\n"
                                  );

                                headerTableRows.push({
                                  "Field Name": title,
                                  Description: description,
                                  Required: !!fieldObj.required,
                                });
                              } else if (typeof fieldObj === "string") {
                                headers.push(fieldObj);
                                headerTableRows.push({
                                  "Field Name": fieldObj,
                                  Description: "",
                                  Required: false,
                                });
                              }
                            }
                          }

                          // Create a new workbook
                          const wb = XLSX.utils.book_new();

                          // Sheet 1: Headers row only (can add your actual data rows if needed)
                          const ws1 = XLSX.utils.aoa_to_sheet([headers]);
                          XLSX.utils.book_append_sheet(wb, ws1, "Data");

                          // Sheet 2: Header info table with multiline Description and wrapped text
                          const ws2 = XLSX.utils.json_to_sheet(headerTableRows);

                          // Wrap text style for all Description column cells (column B)
                          const descCol = "B";
                          const range = XLSX.utils.decode_range(ws2["!ref"]!);

                          for (let R = range.s.r + 1; R <= range.e.r; ++R) {
                            // skip header row (row 1)
                            const cellAddress = descCol + (R + 1); // Excel rows start at 1
                            if (!ws2[cellAddress]) continue;

                            ws2[cellAddress].s = ws2[cellAddress].s || {};
                            ws2[cellAddress].s.alignment = { wrapText: true };
                          }

                          // Append sheet 2
                          XLSX.utils.book_append_sheet(wb, ws2, "Header Info");

                          // Export file (filename from your translation function + .xlsx)
                          XLSX.writeFile(
                            wb,
                            t(
                              `settings.bulkImport.template.data.${item}.type`
                            ) + ".xlsx"
                          );
                        } else {
                          const values = getAllValuesFromConfigJson(
                            selectedTemplate.configJson
                          );
                          handleDownloadExcelOrg(selectedTemplate, values);
                        }

                        setIsSelectedInterface(true);
                        setSelectedInterface({ label: "", value: "" });
                      }
                    }}
                  >
                    {t("settings.bulkImport.template.download")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
      {openDrawer && (
        <div
          className="fixed z-[12] inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={() => {
            confirm({
              title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
              detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
              notify: false, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
              modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
              onConfirm: async () => {
                setOpenDrawer(false);
              }, //จำเป็น
              onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
              successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
              errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
            });
          }}
        ></div>
      )}
      <Info
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        setLoading={setLoading}
        mode={OpenDrawerMode}
        templateConfigs={templateConfigs}
        data={data}
        setData={setData}
        handleGetBulkImport={handleGetBulkImport}
      />
    </div>
  );
};
export default BulkImportDataPage;
