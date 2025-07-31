import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Tag from "../../../../../components/CustomComponent/Tag";
import PreferenceModal from "../../../../../components/StandardPurpose/PreferenceModal";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BsClock, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import VersionList from "../../../../../components/StandardPurpose/VersionList";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import StandardPurposeInfo from "../../../../../components/StandardPurpose/StandardPurposeInfo";
import PurposePreference from "../../../../../components/Table/TablePurposePreference";
import dayjs from "dayjs";
import {
  CreateNewVerionStandardPurpose,
  CreateStandardPreference,
  CreateStandardPurpose,
  DeleteStandardPreference,
  GetInterfaceByStandardPurposeId,
  GetStandardPreference,
  GetStandardPurposeById,
  GetStandardPurposeVersions,
  PublishStandardPurpose,
  UpdateStandardPurpose,
} from "../../../../../services/standardPurposeService";
import { useConfirm, ModalType } from "../../../../../context/ConfirmContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import ConfirmModal from "../../../../../components/Modals/ConfirmModal";
import ConfirmPublishModal from "../../../../../components/StandardPurpose/ConfirmPublishModal";
import { useTranslation } from "react-i18next";
import {
  CSPreferencePurpose,
  PreferencePurposeListRequest,
} from "../../../../../interface/purpose.interface";
import { getPreferencePurposeList } from "../../../../../services/preferencePurposeService";
import { getConsentGeneral } from "../../../../../services/consentSettingService";
import { getOrganizationChart } from "../../../../../services/organizationService";
import notification from "../../../../../utils/notification";
import { Button } from "../../../../../components/CustomComponent";
import TranslationsModue from "../../../../../components/TranslationsModue";
import { TranslationField } from "../../../../../interface/purpose.interface";
import UpdateInterface from "../../../../../components/StandardPurpose/UpdateInterface";
import { TranslationItem } from "../../../../Privacy/PrivacyNoticesManagement/PrivacyNoticesManagement";
import { CreateInterfaceNewVersion, updateConsentInterface } from "../../../../../services/consentInterfaceService";
import { setManagePreferencePurposeSlice } from "../../../../../store/slices/preferencePurposeSlice";

type PurposePreference = {
  [x: string]: any;
  name: string;
  description: string;
  options: number;
  modifiedDate: string;
  modifiedBy: string;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  isActiveStatus: boolean;
  modifiedById: string;
  modifiedByName: string;
  prefPurposeCustomerId: string;
  prefPurposeDescription: string;
  prefPurposeIsRequired: boolean;
  prefPurposeName: string;
  prefPurposeOrganizationId: string;
  prefPurposeOrganizationName: string;
  prefPurposeSelectionJson: string;
  prefPurposeTranslationJson: string;
  standardPreferenceId: string;
  stdPurposeId: string;
};

type PurposePreferenceVersion = {
  name: string;
  description: string;
  options: number;
  modifiedDate: string;
  modifiedBy: string;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  customerId: string;
  isActiveStatus: boolean;
  modifiedById: string;
  modifiedByName: string;
  organizationId: string;
  parentVersionId: string;
  publishedBy: string;
  publishedByName: string;
  publishedDate: string;
  purposeName: string;
  standardPurposeId: string;
  stdPurposeStatusId: string;
  stdPurposeStatusName: string;
  translationJson: any;
  versionNumber: number;
};
interface MenuItemType {
  id: string;
  label: string;
  value: string;
}

function StandardPurposeForm() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const orgparent = useSelector((state: RootState) => state.orgparent);
  const [isUpdateInterfaceOpen, setIsUpdateInterfaceOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("standard-purpose-info");
  const [
    enableRequireOrganizationPurposes,
    setEnableRequireOrganizationPurposes,
  ] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [purposeName, setPurposeName] = useState("");
  const [purposeDesc, setPurposeDesc] = useState("");
  const [expireNumber, setExpireNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [standardPurpose, setStandardPurpose] = useState<any>(null);
  const [isShowPublishBtn, setIsShowPublishBtn] = useState(false);
  const [isShowSaveBtn, setIsShowSaveBtn] = useState(false);
  const [isShowEditBtn, setIsShowEditBtn] = useState(false);
  const [isShowCancelBtn, setIsShowCancelBtn] = useState(false);
  const [translationJson, setTranslationJson] = useState<TranslationField[]>(
    []
  );
  const [organization, setOrganization] = useState<any[]>([]);
  const [formType, setFormType] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishedloading, setPublishedloading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [purposePreferenceList, setPurposePreferenceList] = useState<any[]>([]);
  const [fieldsets, setFieldsets] = useState<any[]>([
    { name: "Purpose Name", value: "" },
    { name: "Description", value: "" },
  ]);
  const dateTimeStr = localStorage.getItem("datetime") || undefined;
  const searchConditionRef = useRef({
    searchTerm: "",
    status: "all",
    page: 1,
    pageSize: 20,
  });
  const datimeformat = JSON.parse(localStorage.getItem("datetime") || "{}");
  const dispatch = useDispatch();
  const [dataPurposePreference, setDataPurposePreference] = useState<{
    data: PurposePreference[];
    pagination: { page: number; total_pages: number };
  }>({
    data: [],
    pagination: { page: 1, total_pages: 10 },
  });
  const [dataPurposePreferenceVersion, setDataPurposePreferenceVersion] =
    useState<PurposePreferenceVersion[]>([]);
  const { id } = useParams<{ id: string }>();
  const [purposePreferenceID, setPurposePreferenceID] = useState(id || "");
  const [selectedPreferenceOptions, setSelectedPreferenceOptions] = useState<
    { id: number; label: string }[]
  >([]);
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <span className="text-base font-semibold">
            {" "}
            {t(
              "purpose.standardPurpose.preferenceTableHeaders.preferencePurposeName"
            )}{" "}
          </span>
        ),
        accessor: "name",
        Cell: (data: any) => {
          return <div onClick={() => {
            console.log("data.row.original", data.row.original);
            dispatch(
              setManagePreferencePurposeSlice({
                id: data.row.original.prefPurposeId,
              })
            ); navigate("/consent/purpose/preference-purpose/view-preference-purpose")
          }} className="flex items-center gap-2 cursor-pointer">
            <div className="relative group justify-start">
              <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.value}</p>
              <div
                className="absolute bottom-full left-0 translate-y-[-6px] z-50 hidden group-hover:inline-block 
                bg-gray-800 text-white text-xs rounded py-1 px-2  shadow-lg break-words min-w-max max-w-[300px] whitespace-normal overflow-break-words"
              >
                {data.value}
              </div>
            </div>
          </div>
        }
        ,
      },
      {
        Header: (
          <span className="text-base font-semibold">
            {" "}
            {t(
              "purpose.standardPurpose.preferenceTableHeaders.description"
            )}{" "}
          </span>
        ),
        accessor: "description",
        Cell: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <div className="relative group justify-start">
              <p className=" font-medium" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
              <div className="absolute text-wrap min-w-96 text-left bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                {value}
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: (
          <span className="text-base font-semibold">
            {" "}
            {t("purpose.standardPurpose.preferenceTableHeaders.options")}{" "}
          </span>
        ),
        accessor: "prefPurposeSelectionJson",
        Cell: ({ value }: { value: any }) => {
          let parsedSelection = value;
          if (typeof value === 'string') {
            parsedSelection = JSON.parse(value)
          }
          if (parsedSelection.options) {
            return (
              <p className="text-center">{parsedSelection.options.length}</p>
            );
          }
          return <p className="text-center">0</p>;
        },
        className: "text-center w-[80px]",
      },
      {
        Header: (
          <span className="text-base font-semibold">
            {" "}
            {t(
              "purpose.standardPurpose.preferenceTableHeaders.modifiedDate"
            )}{" "}
          </span>
        ),
        accessor: "modifiedDate",
        Cell: ({ value }: { value: string }) =>
          value !== "" && (
            <p className="text-center">
              {dayjs(value).format(
                `${JSON.parse(localStorage.getItem("datetime") || "{}")
                  .dateFormat
                } ${JSON.parse(localStorage.getItem("datetime") || "{}")
                  .timeFormat
                }`
              )}
            </p>
          ),
        className: "text-center w-[150px]",
      },
      {
        Header: (
          <span className="text-base font-semibold">
            {" "}
            {t(
              "purpose.standardPurpose.preferenceTableHeaders.modifiedBy"
            )}{" "}
          </span>
        ),
        accessor: "modifiedByName",
        Cell: ({ value }: { value: string }) => (
          <p className="text-left">{value}</p>
        ),
        className: "text-left w-[150px]",
      },
      {
        Header: "",
        accessor: "actions",
        Cell: (data: any) => {
          if (formType === "new" || formType === "edit") {
            return (
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="cursor-pointer">
                  <BsThreeDotsVertical />
                </MenuButton>
                <MenuItems className="absolute z-[9999] right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <MenuItem>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700"
                      onClick={() => {
                        openConfirmModalDeletePreference(data);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 mt-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      <span style={{ marginTop: "5px", color: "#000" }}>
                        {t("purpose.standardPurpose.actions.delete")}
                      </span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            );
          }
        },
      },
    ];
  }, [formType]);

  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Delete);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCheckData, setIsCheckData] = useState(false);
  const [interfaces, setInterfaces] = useState([]);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );
  const [isNewPage, setIsNewPage] = useState(
    location.pathname.startsWith(
      "/consent/purpose/standard-purpose/new-spurpose"
    )
  );
  const [isEditPage, setIsEditPage] = useState(
    location.pathname.startsWith(
      "/consent/purpose/standard-purpose/edit-spurpose"
    )
  );
  const [isViewPage, setIsViewPage] = useState(
    location.pathname.startsWith(
      "/consent/purpose/standard-purpose/view-spurpose"
    )
  );
  const [cfPrefPurpose, setCFPrefPurpose] = useState([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<MenuItemType>({
      id: "00000000-0000-0000-0000-000000000000",
      label: "",
      value: "00000000-0000-0000-0000-000000000000",
    });
  const [selectedExpireDateType, setSelectedExpireDateType] =
    useState<string>("Day");

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    console.log("isPage", {
      isNewPage: isNewPage,
      isEditPage: isEditPage,
      isViewPage: isViewPage,
    });
    setExpireNumber("1");
    setIsShowEditBtn(false);
    setFormType(
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/new-spurpose"
      )
        ? "new"
        : location.pathname.startsWith(
          "/consent/purpose/standard-purpose/edit-spurpose"
        )
          ? "edit"
          : location.pathname.startsWith(
            "/consent/purpose/standard-purpose/view-spurpose"
          )
            ? "view"
            : "view"
    );
    setIsEdit(
      !location.pathname.startsWith(
        "/consent/purpose/standard-purpose/view-spurpose"
      )
    );
    if (
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/new-spurpose"
      )
    ) {
      setIsEdit(true);
    } else if (
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/edit-spurpose"
      )
    ) {
      setIsEdit(true);
    } else if (
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/view-spurpose"
      )
    ) {
      setIsEdit(false);
    } else {
      setIsEdit(false);
    }
    setSelectedOrganization({
      id: "00000000-0000-0000-0000-000000000000",
      label: "",
      value: "00000000-0000-0000-0000-000000000000",
    });
    const getUserSession: any = sessionStorage.getItem("user");
    handleGetPurposesPreference();
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg") || "null");
    const customerIds = getUserSession
      ? JSON.parse(getUserSession).customer_id
      : "";
    setCustomerId(customerIds);
    localStorage.setItem("activeTab", activeTab);
    async function fetchStandardPurpose() {
      await handleGetStandardPurposeVersions();
      await getOrganizationCharts();
      const consentGeneral = await (await getConsentGeneral(customerIds)).data;
      setEnableRequireOrganizationPurposes(
        consentGeneral.enableRequireOrganizationPurposes
      );
      if (consentGeneral.enableRequireOrganizationPurposes) {
        setSelectedOrganization({
          id: currentOrg.organizationId,
          value: currentOrg.organizationId,
          label: currentOrg.organizationName,
        });
      } else {
        setSelectedOrganization({
          id: "00000000-0000-0000-0000-000000000000",
          label: "",
          value: "00000000-0000-0000-0000-000000000000",
        });
      }
      await fetchPreferencePurposeList();
      if (formType !== "new" && params.id) {
        const sp = await GetStandardPurposeById(params.id!);
        if (
          sp.stdPurposeStatusName != "Draft" &&
          location.pathname.startsWith(
            "/consent/purpose/standard-purpose/edit-spurpose"
          )
        ) {
          navigate(
            `/consent/purpose/standard-purpose/view-spurpose/${params.id}`
          );
        }
        console.log("GetStandardPurposeById", sp);
        setStandardPurpose(sp);
        setIsChecked(sp.isSetConsentExpire);
        setPurposeName(sp.purposeName);
        setPurposeDesc(sp.description);
        setTranslationJson(sp.translationJson);
        setSelectedExpireDateType(sp.consentExpireDateType);
        setSelectedOrganization({
          id: sp.organizationId,
          value: sp.organizationId,
          label: sp.OrganizationName,
        });
        setExpireNumber(sp.consentExpireNumber);
        if (sp.stdPurposeStatusName === "Draft") {
          setIsShowPublishBtn(true);
          setIsShowSaveBtn(true);
          setIsShowEditBtn(false);
          setIsEdit(true);
        }
        if (sp.stdPurposeStatusName != "Draft") {
          setIsShowEditBtn(false);
          setIsShowSaveBtn(false);
          setIsEdit(false);
        }
        if (
          location.pathname.startsWith(
            "/consent/purpose/standard-purpose/view-spurpose"
          )
        ) {
          if (sp.stdPurposeStatusName === "Draft") {
            setIsShowEditBtn(true);
          }
          setIsEdit(false);
          setIsShowPublishBtn(false);
          setIsShowSaveBtn(false);
        }
        setIsShowCancelBtn(true);
        setLoading(false);
      } else {
        setIsShowPublishBtn(true);
        setIsShowSaveBtn(true);
        setLoading(false);
      }
      setIsShowCancelBtn(true);
    }
    fetchStandardPurpose();
  }, [params.id, location]);

  useEffect(() => {
    fetchPreferencePurposeList();
  }, [activeTab]);

  useEffect(() => {
    getOrganizationCharts();
  }, [selectedOrganization]);

  useEffect(() => {
    fetchPreferencePurposeList();
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg") || "null");
    setSelectedOrganization({
      id: currentOrg.organizationId,
      value: currentOrg.organizationId,
      label: currentOrg.organizationName,
    });
    getOrganizationCharts();
  }, [orgparent]);

  useEffect(() => {
    if (!permissionPage.isRead) {
      navigate("/access-denied");
    }
    if (
      !permissionPage.isUpdate &&
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/edit-spurpose"
      )
    ) {
      navigate("/access-denied");
    }
  }, [permissionPage, location.pathname]);

  const getOrganizationCharts = async () => {
    const getUserSession: any = sessionStorage.getItem("user");
    const customerId = getUserSession
      ? JSON.parse(getUserSession).customer_id
      : "";
    await getOrganizationChart(customerId, orgparent.orgParent).then((res) => {
      getOrganization(res.data.data);
    });
  };

  const getOrganization = (org: any) => {
    const orgList: any[] = [];
    if (!enableRequireOrganizationPurposes) {
      orgList.push({
        id: "00000000-0000-0000-0000-000000000000",
        orgName: "",
        organizationChildRelationship: [],
      });
    }
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
    var orgLists = orgList.map((child: any) => {
      return {
        label: child.orgName,
        id: child.id,
        value: child.id,
      };
    });
    setOrganization(orgLists);
  };

  async function fetchPreferencePurposeList() {
    const getUserSession: any = sessionStorage.getItem("user");
    const customerId = getUserSession
      ? JSON.parse(getUserSession).customer_id
      : "";
    const config: PreferencePurposeListRequest = {
      organizationIds: organization.map((og) => og.value),
      customerId: customerId,
      page: 1,
      pageSize: 50000,
      sort: "preferencePurposeName Asc",
      column: "preferencePurposeName",
      searchTerm: "",
    };
    var preferencePurposeList = await getPreferencePurposeList(config);
    console.log("preferencePurposeList", preferencePurposeList.data);

    setPurposePreferenceList(preferencePurposeList.data.items);
  }

  const handleSave = async () => {
    console.log(dataPurposePreference);
    const getUserSession = JSON.parse(sessionStorage.getItem("user") || "{}");
    var StandardPurpose: CreateStandardPurpose = {
      purposeName: purposeName,
      description: purposeDesc,
      organizationId: selectedOrganization ? selectedOrganization.value : "",
      customerId: customerId,
      consentExpireNumber: Number(expireNumber),
      consentExpireDateType: selectedExpireDateType,
      isSetConsentExpire: isChecked,
      translationJson: translationJson,
      modifiedBy: getUserSession.user_account_id,
      createdBy: getUserSession.user_account_id,
    };
    console.log("StandardPurpose handleSave", StandardPurpose);
    let Error = {
      isPurposeNameError: StandardPurpose.purposeName === "" ? false : true,
      isDescriptionError: StandardPurpose.description === "" ? false : true,
      isOrganizationError: StandardPurpose.organizationId === "" ? false : true,
    };
    const allFalse = Object.values(Error).every((value) => value === true);
    if (!allFalse) {
      setIsCheckData(true);
      setActiveTab("standard-purpose-info");
      return false;
    }
    if (
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/edit-spurpose"
      )
    ) {
      console.log("updateata");
      confirm({
        modalType: ModalType.Save,
        onConfirm: async () => {
          setLoading(true);
          let updateata = await UpdateStandardPurpose(
            StandardPurpose,
            standardPurpose.standardPurposeId
          );
          console.log("updateata", updateata);
          await updateStandardPreference(dataPurposePreference.data);
          navigate("/consent/purpose/standard-purpose");
          setLoading(false);
          setIsCheckData(false);
        },
      });

      console.log("formType", formType);
    } else {
      console.log("newData");
      confirm({
        modalType: ModalType.Save,
        onConfirm: async () => {
          setLoading(true);
          let createData = await CreateStandardPurpose(StandardPurpose);
          await addStandardPreference(
            dataPurposePreference.data,
            createData.data.standardPurposeId
          );
          navigate("/consent/purpose/standard-purpose");
          console.log("createData", createData);
          fetchStandardPurpose();
          setLoading(false);
          setIsCheckData(false);
        },
      });
    }
  };

  const handleSavePreferences = (selected: any[]) => {
    console.log("Selected Preferences:", selected);
    if (!Array.isArray(selected)) {
      console.error("selected ไม่ใช่ array หรือ undefined");
    } else {
      const mappedData = selected.map((item) => {
        console.log("Mapping item");
        const { csPreferencePurpose } = item;
        let optionsCount = 0;

        try {
          const parsedSelection = JSON.parse(csPreferencePurpose.selectionJson);
          if (parsedSelection && Array.isArray(parsedSelection.options)) {
            optionsCount = parsedSelection.options.length;
          }
        } catch (error) {
          console.error(" Error parsing selectionJson:", error);
        }

        return {
          name: csPreferencePurpose.preferencePurposeName,
          description: csPreferencePurpose.description || "",
          options: optionsCount,
          modifiedDate: csPreferencePurpose.modifiedDate,
          modifiedBy: csPreferencePurpose.modifiedBy || "",
          createdBy: csPreferencePurpose.createdBy || "",
          createdByName:
            `${item.createdByFirstName} ${item.createdByLastName}`.trim(),
          createdDate: csPreferencePurpose.createdDate || "",
          prefPurposeId: csPreferencePurpose.preferencePurposeId,
          isActiveStatus: csPreferencePurpose.isActiveStatus ?? true,
          modifiedById: csPreferencePurpose.modifiedBy || "",
          modifiedByName:
            `${item.modifiedByFirstName} ${item.modifiedByLastName}`.trim(),
          prefPurposeCustomerId: csPreferencePurpose.customerId || "",
          prefPurposeDescription: csPreferencePurpose.description || "",
          prefPurposeIsRequired: csPreferencePurpose.isRequired ?? false,
          prefPurposeName: csPreferencePurpose.preferencePurposeName,
          prefPurposeOrganizationId: csPreferencePurpose.organizationId || "",
          prefPurposeOrganizationName: item.organizationName || "",
          prefPurposeSelectionJson: csPreferencePurpose.selectionJson || "[]",
          prefPurposeTranslationJson:
            csPreferencePurpose.translationJson || "[]",
          standardPreferenceId: "",
          stdPurposeId: "",
        };
      });
      // modifiedByName: `${item.modifiedByFirstName} ${item.modifiedByLastName}`.trim(),
      // modifiedDate: csPreferencePurpose.modifiedDate || "",
      setDataPurposePreference((prevState) => {
        const existingIds = new Set(
          prevState.data.map((item) => item.prefPurposeId)
        );
        const uniqueMappedData = mappedData.filter(
          (item) => !existingIds.has(item.prefPurposeId)
        );

        return {
          ...prevState,
          data: [...prevState.data, ...uniqueMappedData],
        };
      });

      console.log("dataPurposePreference", dataPurposePreference.data);
    }

    //setSelectedPreferenceOptions(selected);
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("Updated dataPurposePreference:", dataPurposePreference);
    prefData(dataPurposePreference.data);
  }, [dataPurposePreference]);

  const prefData = (item: any) => {
    console.log(item);

    if (!Array.isArray(item)) {
      return;
    }
    const mappedData: CSPreferencePurpose[] = item.map((items) => ({
      prefPurposeId: items.prefPurposeId,
      preferencePurposeId: items.preferencePurposeId,
      preferencePurposeName: items.preferencePurposeName,
      description: items.description || "",
      selectionJson: items.selectionJson || "[]",
      organizationId: items.organizationId || "",
      isRequired: items.isRequired ?? false,
      translationJson: items.translationJson || "[]",
      customerId: items.customerId || "",
      isActiveStatus: items.isActiveStatus ?? true,
      createdDate: new Date(items.createdDate),
      modifiedDate: new Date(items.modifiedDate),
      createdBy: items.createdBy || "",
      modifiedBy: items.modifiedBy || "",
    }));

    // อัปเดต State
    setCFPrefPurpose((prevState) => ({
      ...prevState,
      mappedData,
    }));

    console.log("cfPrefPurpose : ", cfPrefPurpose);
  };

  const handlePublish = async () => {
    const getUserSession = JSON.parse(sessionStorage.getItem("user") || "{}");
    var StandardPurpose = {
      purposeName: purposeName,
      description: purposeDesc,
      organizationId: selectedOrganization ? selectedOrganization.value : "",
      customerId: customerId,
      consentExpireNumber: Number(expireNumber),
      consentExpireDateType: selectedExpireDateType,
      isSetConsentExpire: isChecked,
      translationJson: translationJson,
      modifiedBy: getUserSession.user_account_id,
      createdBy: getUserSession.user_account_id,
    };
    console.log(StandardPurpose);
    let Error = {
      isPurposeNameError: StandardPurpose.purposeName === "" ? false : true,
      isDescriptionError: StandardPurpose.description === "" ? false : true,
      isOrganizationError: StandardPurpose.organizationId === "" ? false : true,
    };
    const allFalse = Object.values(Error).every((value) => value === true);
    if (!allFalse) {
      setIsCheckData(true);
      setActiveTab("standard-purpose-info");
      return false;
    }
    console.log(dataPurposePreference.data);
    setIsConfirmPublishOpen(true);
  };

  const addStandardPreference = async (
    purposePreferences: any,
    stdPurposeId: string
  ) => {
    const getUserSession = JSON.parse(sessionStorage.getItem("user") || "{}");
    for (const dpp of purposePreferences) {
      dpp.stdPurposeId = stdPurposeId;
      dpp.createdBy = getUserSession.user_account_id;
      dpp.prefPurposeSelectionJson = typeof dpp.prefPurposeSelectionJson === "string"
        ? JSON.parse(dpp.prefPurposeSelectionJson) : dpp.prefPurposeSelectionJson
      await CreateStandardPreference(dpp);
    }
  };

  const updateStandardPreference = async (purposePreferences: any) => {
    const getUserSession = JSON.parse(sessionStorage.getItem("user") || "{}");
    console.log("purposePreferences", purposePreferences);
    for (const dpp of purposePreferences) {
      if (dpp.stdPurposeId === "") {
        dpp.stdPurposeId = params.id;
        dpp.createdBy = getUserSession.user_account_id;
        await CreateStandardPreference(dpp);
        setFormType("view");
        handleGetPurposesPreference();
      }
    }
  };

  const modalPublishCommit = async () => {
    const getUserSession = JSON.parse(sessionStorage.getItem("user") || "{}");
    var StandardPurpose = {
      purposeName: purposeName,
      description: purposeDesc,
      organizationId: selectedOrganization ? selectedOrganization.value : "",
      customerId: customerId,
      consentExpireNumber: Number(expireNumber),
      consentExpireDateType: selectedExpireDateType,
      isSetConsentExpire: isChecked,
      translationJson: translationJson,
      modifiedBy: getUserSession.user_account_id,
      createdBy: getUserSession.user_account_id,
    };
    console.log(StandardPurpose)
    setLoading(true);
    setIsConfirmPublishOpen(false);
    let updateata = null;
    console.log(params.id);
    if (!params.id) {
      updateata = await CreateStandardPurpose(StandardPurpose);
    }
    let publishData = await PublishStandardPurpose(
      StandardPurpose,
      params.id ? params.id : updateata?.data.standardPurposeId
    );
    if (
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/new-spurpose"
      )
    ) {
      console.log(dataPurposePreference);
      await addStandardPreference(
        dataPurposePreference.data,
        publishData.data.standardPurposeId
      );
    }
    if (
      location.pathname.startsWith(
        "/consent/purpose/standard-purpose/edit-spurpose"
      )
    ) {
      console.log(dataPurposePreference);
      await updateStandardPreference(dataPurposePreference.data);
    }
    notification.success(t("modal.successConfirmSave"));
    await checkAlredyInterface();
  };

  const checkAlredyInterface = async () => {
    const purpose = dataPurposePreferenceVersion.find(
      (item) => item.versionNumber === standardPurpose.versionNumber - 1
    );
    console.log("------------------------purpose------------------------", purpose)
    if (purpose) {
      const interfacres = await GetInterfaceByStandardPurposeId(purpose.standardPurposeId)
      console.log("--------------------interfacres--------------------", interfacres)
      if (interfacres.length > 0) {
        setInterfaces(interfacres);
        setIsUpdateInterfaceOpen(true);
        setLoading(false);
        return;
      }
    }
    navigate("/consent/purpose/standard-purpose");
    setLoading(false);
    setIsCheckData(false);
    fetchPreferencePurposeList();
    fetchStandardPurpose();
  };

  const fetchStandardPurpose = async () => {
    if (params.id) {
      var sp = await GetStandardPurposeById(params.id);
      console.log(sp);
      setStandardPurpose(sp);
      setIsChecked(sp.isSetConsentExpire);
      setPurposeName(sp.purposeName);
      setPurposeDesc(sp.description);
      setSelectedExpireDateType(sp.consentExpireDateType);
      setSelectedOrganization({
        id: sp.organizationId,
        value: sp.organizationId,
        label: sp.OrganizationName,
      });
      setExpireNumber(sp.consentExpireNumber);
      if (sp.stdPurposeStatusName === "Draft") {
        setIsShowPublishBtn(true);
      } else {
        setIsShowPublishBtn(false);
      }
      if (sp.stdPurposeStatusName != "Draft") {
        setIsShowSaveBtn(false);
        setIsEdit(false);
      } else {
        setIsShowSaveBtn(false);
        setIsEdit(false);
      }
    }
  };

  const handleCancel = () => {
    confirm({
      notify: false,
      modalType: ModalType.Cancel,
      onConfirm: async () => {
        localStorage.setItem("activeTab", "standard-purpose-info");
        navigate("/consent/purpose/standard-purpose");
      },
    });
  };

  const handleCreateNewVarsion = async () => {
    const getUserSession = JSON.parse(sessionStorage.getItem("user") || "{}");
    let StandardPurpose: CreateStandardPurpose = {
      purposeName: standardPurpose.purposeName,
      description: standardPurpose.description,
      organizationId: standardPurpose.organizationId,
      customerId: standardPurpose.customerId,
      consentExpireNumber: standardPurpose.consentExpireNumber,
      consentExpireDateType: standardPurpose.consentExpireDateType,
      isSetConsentExpire: isChecked,
      translationJson: translationJson,
      modifiedBy: getUserSession.user_account_id,
      createdBy: getUserSession.user_account_id,
    };
    let Error = {
      isPurposeNameError: StandardPurpose.purposeName === "" ? false : true,
      isDescriptionError: StandardPurpose.description === "" ? false : true,
      isOrganizationError: StandardPurpose.organizationId === "" ? false : true,
    };
    const allFalse = Object.values(Error).every((value) => value === true);
    if (!allFalse) {
      setIsCheckData(true);
      return false;
    }
    const newVerion = await CreateNewVerionStandardPurpose(
      StandardPurpose,
      standardPurpose.standardPurposeId
    );
    setIsCheckData(false);
    console.log(newVerion);
    navigate("/consent/purpose/standard-purpose");
  };

  const handleGetPurposesPreference = async () => {
    console.log("formType", formType);

    if (isNewPage == false) {
      setLoadingTable(true);
      try {
        const response = await GetStandardPreference(purposePreferenceID);
        console.log("GetStandardPreference", response);
        if (response && Array.isArray(response)) {
          const formattedData: PurposePreference[] = response.map(
            (item, index) => ({
              name: item.prefPurposeName || "-",
              description: item.prefPurposeDescription || "-",
              options: item.interface || 0,
              modifiedDate: item.modifiedDate
                ? new Date(item.modifiedDate).toLocaleString()
                : "-",
              modifiedBy: item.modifiedByName || "-",
              createdBy: item.createdBy || "-",
              createdByName: item.createdByName || "-",
              createdDate: item.createdDate
                ? new Date(item.createdDate).toLocaleString()
                : "-",
              prefPurposeId: item.prefPurposeId || "-",
              isActiveStatus: item.isActiveStatus ?? false,
              modifiedById: item.modifiedBy || "-",
              modifiedByName: item.modifiedByName || "-",
              prefPurposeCustomerId: item.prefPurposeCustomerId || "-",
              prefPurposeDescription: item.prefPurposeDescription || "-",
              prefPurposeIsRequired: item.prefPurposeIsRequired ?? false,
              prefPurposeName: item.prefPurposeName || "-",
              prefPurposeOrganizationId: item.prefPurposeOrganizationId || "-",
              prefPurposeOrganizationName:
                item.prefPurposeOrganizationName || "-",
              prefPurposeSelectionJson: item.prefPurposeSelectionJson || "-",
              prefPurposeTranslationJson:
                item.prefPurposeTranslationJson || "-",
              standardPreferenceId: item.standardPreferenceId || "-",
              stdPurposeId: item.stdPurposeId || "-",
            })
          );

          setDataPurposePreference({
            data: formattedData,
            pagination: {
              page: 1,
              total_pages: Math.ceil(response.length / 20),
            },
          });

          console.log("dataPurposePreference", dataPurposePreference);
          setLoadingTable(false);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    } else {
      setLoadingTable(false);
    }
  };

  const handleGetStandardPurposeVersions = async () => {
    try {
      const response = await GetStandardPurposeVersions(purposePreferenceID);
      console.log("GetStandardPurposeVersions Resp : ", response);

      if (response && Array.isArray(response)) {
        const formattedData: PurposePreferenceVersion[] = response.map(
          (item, index) => ({
            name: item.prefPurposeName || "-",
            description: item.prefPurposeDescription || "-",
            options: item.interface || 0,
            modifiedDate: item.modifiedDate
              ? new Date(item.modifiedDate).toLocaleString()
              : "-",
            modifiedBy: item.modifiedByName || "-",
            createdBy: item.createdBy || "-",
            createdByName: item.createdByName || "-",
            createdDate: item.createdDate
              ? new Date(item.createdDate).toLocaleString()
              : "-",
            customerId: item.customerId || "-",
            isActiveStatus: item.isActiveStatus ?? false,
            modifiedById: item.modifiedBy || "-",
            modifiedByName: item.modifiedByName || "-",
            organizationId: item.organizationId || "-",
            parentVersionId: item.parentVersionId || "-",
            publishedBy: item.publishedBy || "-",
            publishedByName: item.publishedByName || "-",
            publishedDate: item.publishedDate
              ? new Date(item.publishedDate).toLocaleString()
              : "-",
            purposeName: item.purposeName || "-",
            standardPurposeId: item.standardPurposeId || "-",
            stdPurposeStatusId: item.stdPurposeStatusId || "-",
            stdPurposeStatusName: item.stdPurposeStatusName || "-",
            translationJson: item.translationJson || {},
            versionNumber: item.versionNumber || 0,
          })
        );

        setDataPurposePreferenceVersion(formattedData);
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > dataPurposePreference.pagination.total_pages) return;

    searchConditionRef.current.page = page;
  };

  const formatDate = (dateString: string) => {
    let dateTimeString = "";
    if (dateTimeStr) {
      const dateTimeObj = JSON.parse(dateTimeStr);
      dateTimeString = dateTimeObj.dateFormat + " " + dateTimeObj.timeFormat;
    }
    //console.log(dateString);
    if (dateString === "-" || dateString === null) {
      return "-";
    }
    return dayjs(dateString).format(dateTimeString);
    // return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Draft":
        return "text-gray-600 bg-gray-200";
      case "Retired":
        return "text-red-600 bg-red-100";
      case "Published":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-200";
    }
  };

  const openConfirmModalDeletePreference = (data: any) => {
    const prefPurposeId = data.row.original.prefPurposeId;
    const standardPreferenceId = data.row.original.standardPreferenceId;
    confirm({
      notify: true,
      modalType: ModalType.Delete,
      onConfirm: async () => {
        let datafilters = data.data;
        const index = datafilters.findIndex(
          (item: { prefPurposeId: any }) => item.prefPurposeId === prefPurposeId
        );
        if (index !== -1) {
          const newData = [...datafilters];
          newData.splice(index, 1);
          setDataPurposePreference({
            data: newData,
            pagination: {
              page: 1,
              total_pages: Math.ceil(newData.length / 20),
            },
          });
        }
        if (standardPreferenceId) {
          await DeleteStandardPreference(standardPreferenceId);
        }
      },
    });
  };

  const handleEdit = () => {
    setFormType("edit");
    console.log("formType", formType);

    navigate("/consent/purpose/standard-purpose/edit-spurpose/" + params.id);
  };

  useEffect(() => {
    console.log("translationJson", translationJson);
  }, [translationJson]);

  useEffect(() => {
    setFieldsets([
      { name: "Purpose Name", value: purposeName },
      { name: "Description", value: purposeDesc },
    ]);
    console.log(fieldsets);
  }, [purposeName, purposeDesc]);

  const handleInterfaceUpdate = async (selectInterface: any[]) => {
    setIsUpdateInterfaceOpen(false);
    setLoading(true);
    const standardPreference = await GetStandardPreference(standardPurpose.standardPurposeId);
    let contentsData = standardPreference.map((item: any, index: number) => {
      return {
        "pageId": "966a7e9b-10c0-412b-8587-4ce1b0d94a13",
        "sectionId": "b1318ce1-38d1-4728-b565-bb54f0f4f528",
        "ContentId": "bfffd022-e6a9-4a11-9e8d-7ab1a701de1b",
        "fieldTypeId": "b27ccb50-a04e-4b17-a953-ce5ce7064502",
        "fieldTypeName": "preference_purpose",
        "element": {
          "selectedPreferencePurpose": {
            "standardPreferenceId": item.standardPreferenceId,
            "stdPurposeId": item.stdPurposeId,
            "prefPurposeId": item.prefPurposeId,
            "prefPurposeName": item.prefPurposeName,
            "prefPurposeDescription": item.prefPurposeDescription,
            "prefPurposeSelectionJson": item.prefPurposeSelectionJson,
            "prefPurposeTranslationJson": item.prefPurposeTranslationJson,
            "prefPurposeOrganizationId": item.prefPurposeOrganizationId,
            "prefPurposeOrganizationName": item.prefPurposeOrganizationName,
            "prefPurposeCustomerId": item.prefPurposeCustomerId,
            "prefPurposeIsRequired": item.prefPurposeIsRequired,
            "isActiveStatus": item.isActiveStatus,
          },
        },
        "hide": false,
        "isRequired": false,
        "isIdentifier": false,
        "order": index + 2,
        "value": null
      }
    }
    );
    const purpose = dataPurposePreferenceVersion.find(
      (item) => item.versionNumber === standardPurpose.versionNumber - 1
    );
    const oldId = purpose?.standardPurposeId;
    const newId = standardPurpose.standardPurposeId;
    console.log("oldId = ", oldId);
    console.log("newId = ", newId);
    for (const item of selectInterface) {
      var updatedData = item.data;
      updatedData.builder.forEach((page: any) => {
        page.sections.forEach((section: any) => {
          section.contents.forEach((content: any) => {
            const spp = content.element.selectedStandardPurpose;
            if (spp && spp.id === oldId) {
              spp.id = newId;
              section.contents.push(...contentsData);
            }
          });
          section.contents = section.contents.filter((content: any) => {
            const pref = content.element.selectedPreferencePurpose;
            return !(
              pref?.stdPurposeId === oldId
            );
          });

        });
      });
      console.log("standardPreference", standardPreference);
      console.log("updatedData", updatedData);
      if (item.selected) {
        if (item.status === "Draft") {
          try {
            await updateConsentInterface(updatedData)
            notification.success(t("modal.successConfirmSave"));
          } catch (error) {
            notification.error(t("modal.errorConfirmSave"));
          }
        } else {
          try {
            await CreateInterfaceNewVersion(updatedData);
            notification.success(t("modal.successConfirmSave"));
          } catch (error) {
            notification.error(t("modal.errorConfirmSave"));
          }
        }
      }
    }
    navigate("/consent/purpose/standard-purpose");
  }


  return (
    <div
      className={`w-full ${activeTab === "standard-purpose-info" ? "pb-[9rem]" : ""
        } bg-white flex flex-col`}
    >
      {isOpen && (
        <VersionList
          data={dataPurposePreferenceVersion.map((item) => ({
            id: item.standardPurposeId,
            title: item.purposeName,
            version: item.versionNumber.toString(),
            status: item.stdPurposeStatusName,
            modifiedDate: formatDate(item.modifiedDate),
            modifiedBy: item.modifiedByName,
          }))}
          onClose={() => setIsOpen(false)}
        />
      )}
      <div className="flex justify-between items-center px-6 border-b">
        <nav className="flex space-x-6">
          {[
            { name: "standardPurposeInfo", key: "standard-purpose-info" },
            { name: "preferencePurposes", key: "preference-purpose" },
            { name: "translations", key: "translations" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`py-5 px-5 text-base font-semibold transition-colors relative ${activeTab === tab.key ? "text-blue-600" : " hover:text-gray-700"
                }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {t("purpose.standardPurpose.tabs." + tab.name + ".title")}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
              )}
            </button>
          ))}
        </nav>
        {!loading && (
          <div className="flex space-x-2 justify-center items-center">
            {/* <Button
              size="sm"
              variant="outlined"
              color="blue"
              className=" text-primary-blue text-base"
              onClick={checkAlredyInterface}
            >
              tests
            </Button> */}
            {isShowPublishBtn && (
              <>
                <Button
                  size="sm"
                  variant="outlined"
                  color="blue"
                  className=" text-primary-blue text-base"
                  onClick={handlePublish}
                >
                  {t("purpose.standardPurpose.actions.publish")}
                </Button>
                <div className="border-l border-gray-300 h-8"></div>
              </>
            )}
            <Button
              size="sm"
              variant="outlined"
              color="gray"
              className=" text-black text-base"
              onClick={handleCancel}
            >
              {t("purpose.standardPurpose.actions.cancel")}
            </Button>
            {isShowEditBtn && permissionPage.isUpdate && (
              <Button
                size="sm"
                variant="contained"
                color="black"
                className=" text-white text-base"
                onClick={handleEdit}
              >
                {t("purpose.standardPurpose.actions.edit")}
              </Button>
            )}
            {isShowSaveBtn && (
              <Button
                size="sm"
                variant="contained"
                color="#3758F9"
                className="text-white text-base"
                onClick={handleSave}
              >
                {t("purpose.standardPurpose.actions.save")}
              </Button>
            )}
            {formType !== "new" && (
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="cursor-pointer focus:outline-none">
                  <BsThreeDotsVertical className="size-5 text-gray-600 mt-2" />
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                  {standardPurpose &&
                    standardPurpose.stdPurposeStatusName === "Published" &&
                    standardPurpose.latestVersion &&
                    permissionPage.isUpdate && (
                      <MenuItem as="div" onClick={handleCreateNewVarsion}>
                        {({ active }) => (
                          <button
                            className={`flex items-center px-4 py-2 w-full text-left text-base font-semibold rounded-md ${active ? "bg-gray-100" : "text-gray-900"
                              }`}
                          >
                            <IoMdAdd className="size-4 mr-2 " />
                            {t(
                              "purpose.standardPurpose.actions.createNewVersion"
                            )}
                          </button>
                        )}
                      </MenuItem>
                    )}
                  <MenuItem as="div" onClick={() => {
                    setIsOpen(true);
                    handleGetStandardPurposeVersions();
                  }}>
                    {({ active }) => (
                      <button
                        className={`flex items-center px-4 py-2 w-full text-left text-base font-semibold rounded-md ${active ? "bg-gray-100" : "text-gray-900"
                          }`}

                      >
                        <BsClock className="size-4 mr-2 " />
                        {t("purpose.standardPurpose.actions.viewAllVersions")}
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        )}
      </div>
      {loading && <LoadingSpinner />}
      <div className="p-6">
        {activeTab === "standard-purpose-info" && !loading && (
          <>
            <div className="w-full">
              <h2 className="text-xl font-semibold">
                {t("purpose.standardPurpose.tabs.standardPurposeInfo.title")}
              </h2>
              <p className=" text-base">
                {t(
                  "purpose.standardPurpose.tabs.standardPurposeInfo.description"
                )}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <Tag
                  size="sm"
                  minHeight="1.625rem"
                  className="border border-blue-600 text-blue-600 px-3 py-1 rounded-md text-base"
                >
                  {t("purpose.standardPurpose.title")}
                </Tag>

                <Tag
                  size="sm"
                  minHeight="1.625rem"
                  className={`px-3 py-1 rounded-md text-base ${getStatusStyle(
                    standardPurpose
                      ? standardPurpose.stdPurposeStatusName
                      : "Draft"
                  )}`}
                >
                  {standardPurpose
                    ? standardPurpose.stdPurposeStatusName
                    : "Draft"}
                </Tag>

                <Tag
                  size="sm"
                  minHeight="1.625rem"
                  className="text-primary-blue px-3 py-1 rounded-md text-base font-semibold bg-blue-100"
                >
                  {t("purpose.standardPurpose.version")}{" "}
                  {standardPurpose ? standardPurpose.versionNumber : 1}
                </Tag>

                <Tag
                  size="sm"
                  minHeight="1.625rem"
                  className="text-gray-600 text-base font-semibold"
                >
                  {t(
                    "purpose.standardPurpose.tabs.standardPurposeInfo.publishDate"
                  )}
                  :{" "}
                  {standardPurpose
                    ? standardPurpose.publishedDate
                      ? dayjs(standardPurpose.publishedDate).format(
                        `${datimeformat.dateFormat} ${datimeformat.timeFormat}`
                      )
                      : " - "
                    : " - "}
                </Tag>
              </div>
            </div>
          </>
        )}
        {activeTab === "preference-purpose" && !loading && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {t("purpose.standardPurpose.tabs.preferencePurposes.title")}
                </h2>
                <p className=" text-base">
                  {t(
                    "purpose.standardPurpose.tabs.preferencePurposes.description"
                  )}
                </p>
              </div>
              {!location.pathname.startsWith(
                "/consent/purpose/standard-purpose/view-spurpose"
              ) && (
                  <Button
                    size="md"
                    variant="contained"
                    color="#0E1116"
                    className="text-white text-base"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {t(
                      "purpose.standardPurpose.tabs.preferencePurposes.btnAddPurposePreferences"
                    )}
                  </Button>
                )}
            </div>
          </>
        )}
        {activeTab === "translations" && !loading && (
          <>
            {/* <TranslationsPrivacyModue
            titleDesc=""
            addDesc=""
            isView={false}
            translationJson={translationJsonPc}
            setTranslationJson={setTranslationJsonPc}
          /> */}
            <TranslationsModue
              isView={!isEdit}
              translationJson={translationJson}
              fields={fieldsets}
              setTranslationJson={setTranslationJson}
            />
          </>
        )}
      </div>

      {/* Content ของ standard-purpose-info */}
      {activeTab === "standard-purpose-info" && !loading && (
        <StandardPurposeInfo
          enableRequireOrganizationPurposes={enableRequireOrganizationPurposes}
          isCheckData={isCheckData}
          setIsCheckData={setIsCheckData}
          isEdit={isEdit}
          selectedOrganization={selectedOrganization}
          setSelectedOrganization={setSelectedOrganization}
          purposeName={purposeName}
          setPurposeName={setPurposeName}
          purposeDesc={purposeDesc}
          setPurposeDesc={setPurposeDesc}
          organization={organization}
          selectedExpireDateType={selectedExpireDateType}
          setSelectedExpireDateType={setSelectedExpireDateType}
          expireNumber={expireNumber}
          setExpireNumber={setExpireNumber}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          logInfo={standardPurpose}
        />
      )}

      {/* Content ของ Preference Purposes */}
      <div
        className={`${activeTab === "preference-purpose" && !loading
          ? "pl-6 pr-6 pb-6"
          : "hidden"
          } `}
      >
        <PurposePreference
          columns={columns}
          data={dataPurposePreference.data}
          pagination={dataPurposePreference.pagination}
          handlePageChange={handlePageChange}
          loading={loadingTable}
          pageSize={searchConditionRef.current.pageSize}
        />

        <PreferenceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePreferences}
          initialData={purposePreferenceList}
        />
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={confirmTitle}
        modalType={confirmType}
        detail={confirmDetail}
        onConfirm={confirmAction}
        successMessage={confirmSuccessMessage}
        errorMessage={confirmErrorMessage}
      ></ConfirmModal>

      <ConfirmPublishModal
        isOpen={isConfirmPublishOpen}
        onClose={() => setIsConfirmPublishOpen(false)}
        onPublish={modalPublishCommit}
      />

      <UpdateInterface
        isOpen={isUpdateInterfaceOpen}
        interfaces={interfaces.filter((item: any) => item.latestVersion)}
        onClose={() => {
          navigate("/consent/purpose/standard-purpose");
        }}
        onUpdate={handleInterfaceUpdate}
      />
    </div>
  );
}

export default StandardPurposeForm;
