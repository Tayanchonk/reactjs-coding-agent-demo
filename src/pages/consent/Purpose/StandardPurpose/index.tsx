import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaSearch } from "react-icons/fa";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import Select from "react-select";
import PurposeTable from "./../../../../components/Table/TablePurpose";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import customStyles from "../../../../utils/styleForReactSelect";
import {
  DeleteStandardPurpose,
  getStandardPurposeListByCustomerId,
  GetStandardPurposeStatus,
} from "../../../../services/standardPurposeService";
import { RootState } from "../../../../store";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import Dropdown from "../../../../components/CustomComponent/Dropdown";
import Input from "../../../../components/CustomComponent/InputText";

import LoadingSpinner from "../../../../components/LoadingSpinner";
import { formatDate } from "react-datepicker/dist/date_utils";
import dayjs from "dayjs";
import { filter } from "lodash";
import { getOrganizationChart } from "../../../../services/organizationService";
import DropdownOption from "../../../../components/CustomComponent/Dropdown/DropdownOption";
import Tag from "../../../../components/CustomComponent/Tag";
import { Button } from "../../../../components/CustomComponent";
import { Table, SortingHeader } from "../../../../components/CustomComponent";

// Define the Purpose Interface
interface Purpose {
  standardPurposeId: string;
  purposeName: string;
  description: string;
  organizationID: string;
  organizationName: string;
  customerID: string;
  isActiveStatus: boolean;
  versionNumber: number;
  stdPurposeStatusID: string;
  stdPurposeStatusName: string;
  consentExpireType: string;
  parentVersionID: string | null;
  translations: any[];
  createdDate: string;
  createdBy: string;
  createdByName: string;
  modifiedDate: string;
  modifiedBy: string;
  modifiedByName: string;
  publishedDate: string | null;
  publishedBy: string | null;
  publishedByName: string;
  latestVersion: string | null;
}

interface StdStatus {
  id: string;
  label: string;
  value: string;
}
interface MenuItemType {
  id: string;
  label: string;
  value: string;
}

function StandardPurpose() {
  let { t, i18n } = useTranslation();

  const confirm = useConfirm();
  const navigate = useNavigate();
  const [purposes, setPurposes] = useState<{
    data: Purpose[];
    pagination: { page: number; total_pages: number };
  }>({
    data: [],
    pagination: { page: 1, total_pages: 1 },
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(false);
  const searchConditionRef = useRef({
    searchTerm: "",
    status: "",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "modifiedDate",
    totalPage: 0,
  });
  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = getUserSession
    ? JSON.parse(getUserSession).customer_id
    : "";

  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Delete);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );

  const [filterSearch, setFilterSearch] = useState("");
  const [stdStatus, setStdStatus] = useState<StdStatus[]>([]);
  const [selectedOptionStdStatus, setSelectedOptionStdStatus] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStatusName, setSelectedStatusName] = useState("All Status");

  const [sortConfig, setSortConfig] = useState({
    column: "modifiedDate",
    order: "desc",
  });
  const dateTimeStr = localStorage.getItem("datetime") || undefined;

  const [selectedOrganization, setSelectedOrganization] =
    useState<MenuItemType>({
      id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
      label: "",
      value: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
    });
  const orgparent = useSelector((state: RootState) => state.orgparent);
  const [
    enableRequireOrganizationPurposes,
    setEnableRequireOrganizationPurposes,
  ] = useState(true);
  const [organization, setOrganization] = useState<any[]>([]);

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  //console.log('permissionPage', permissionPage);

  //const dateTime = dateTimeStr ? JSON.parse(dateTimeStr) : null;
  const columns = useMemo(() => {
    /*
    const renderSortableHeader = (label: string, columnKey: string, isFirstColumn = false) => (
      <div className={`flex items-center w-full ${isFirstColumn ? "justify-between" : "pl-3 justify-center"}`}>
        <span className={`${isFirstColumn ? "" : "flex-1 text-center"}`}>{label}</span>
        <svg
          onClick={() => handleSort(columnKey)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 cursor-pointer ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
      </div>
    );
    */

    return [
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("purposeName")}
            title={t("purpose.standardPurpose.tableHeaders.name")}
          />
        ),
        //  Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.name'), "purposeName", true),
        accessor: "purposeName",
        Cell: ({ row }: { row: any }) => (
          <div
            className="flex items-center"
            onClick={() => {
              navigate(
                `/consent/purpose/standard-purpose/view-spurpose/${row.original.standardPurposeId}`
              );
            }}
          >
            <div className="relative group justify-start">
              <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.purposeName}</p>
              <div
                className="absolute bottom-full text-wrap left-0 translate-y-[-6px] z-50 hidden group-hover:inline-block 
                bg-gray-800 text-white text-xs rounded py-1 px-2 max-w-96 shadow-lg break-words"
              >
                {row.original.purposeName}
              </div>
            </div>
          </div>
          /*
          <span onClick={() => navigate(`/consent/purpose/standard-purpose/view-spurpose/` + row.original.standardPurposeId)}  
          className="text-primary-blue font-medium cursor-pointer truncate w-60 block"
          title={row.original.purposeName} >
            {row.original.purposeName}
          </span>
          */
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("stdPurposeStatusName")}
            title={t("purpose.standardPurpose.tableHeaders.status")}
            center={true}
          />
        ),
        //Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.status'), "stdPurposeStatusName"),
        accessor: "stdPurposeStatusName",
        Cell: ({ value }: { value: string }) => (
          <span className="flex justify-center items-center w-full">
            <Tag
              size="sm"
              minHeight="1.625rem"
              className={`px-3 py-1 rounded-md text-base max-w-max ${getStatusStyle(
                value ? value : "Draft"
              )}`}
            >
              {value ? value : "Draft"}
            </Tag>
          </span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("versionNumber")}
            title={t("purpose.standardPurpose.tableHeaders.version")}
            center={true}
          />
        ),
        //Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.version'), "versionNumber"),
        accessor: "versionNumber",
        Cell: ({ value }: { value: number }) => (
          <span className="flex justify-center items-center w-full">
            <Tag
              size="sm"
              minHeight="1.625rem"
              className=" text-primary-blue font-medium px-3 py-1 rounded-md text-base bg-blue-100 max-w-max"
            >
              Version {value}
            </Tag>
          </span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("organizationName")}
            title={t("purpose.standardPurpose.tableHeaders.organization")}
          />
        ),
        //Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.organization'), "organizationName", true),
        accessor: "organizationName",
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("countInterface")}
            title={t("purpose.standardPurpose.tableHeaders.interface")}
            center={true}
          />
        ),
        //Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.interface'), "countInterface"),
        accessor: "countInterface",
        Cell: ({ row }: { row: any }) => (
          <span className="flex items-center justify-center">
            {row.original.countInterface}
          </span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("publishedDate")}
            title={t("purpose.standardPurpose.tableHeaders.publishedDate")}
            center={true}
          />
        ),
        //Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.publishedDate'), "publishedDate"),
        accessor: "publishedDate",
        Cell: ({ row }: { row: any }) => (
          <span className="flex items-center justify-center">
            {formatDate(row.original.publishedDate)}
          </span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("modifiedByName")}
            title={t("purpose.standardPurpose.tableHeaders.modifiedBy")}
          />
        ),
        //Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.modifiedBy'), "modifiedByName", true),
        accessor: "modifiedByName",
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("modifiedDate")}
            title={t("purpose.standardPurpose.tableHeaders.modifiedDate")}
            center={true}
          />
        ),
        //Header: renderSortableHeader(t('purpose.standardPurpose.tableHeaders.modifiedDate'), "modifiedDate"),
        accessor: "modifiedDate",
        Cell: ({ row }: { row: any }) => (
          <span className="flex items-center justify-center"> {formatDate(row.original.modifiedDate)}</span>
        ),
      },
      {
        Header: "",
        accessor: "actions",
        Cell: ({ row }: { row: any }) => {
          // ใช้ permissionPage จาก props (สมมติว่ามันถูกดึงจาก useMemo หรือ Redux)
          const hasUpdatePermission = permissionPage?.isUpdate ?? false;
          const hasDeletePermission = permissionPage?.isDelete ?? false;
          const isDraft = row.original.stdPurposeStatusName === "Draft";

          // ถ้าไม่มีสิทธิ์แก้ไขและลบ หรือไม่ใช่ "Draft" ให้ return null
          if (!(hasUpdatePermission || hasDeletePermission) || !isDraft)
            return null;

          return (
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="cursor-pointer" disabled={!isDraft}>
                <BsThreeDotsVertical />
              </MenuButton>
              <MenuItems className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                {hasUpdatePermission && (
                  <MenuItem>
                    <button
                      className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                      onClick={() =>
                        navigate(
                          `/consent/purpose/standard-purpose/edit-spurpose/` +
                          row.original.standardPurposeId
                        )
                      }
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      <span style={{ marginTop: "5px", color: "#000" }}>
                        {t("purpose.standardPurpose.actions.edit")}
                      </span>
                    </button>
                  </MenuItem>
                )}
                {hasDeletePermission && (
                  <MenuItem>
                    <button
                      className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                      onClick={() =>
                        handleDeletePurpose(row.original.standardPurposeId)
                      }
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
                )}
              </MenuItems>
            </Menu>
          );
        },
      },
    ];
  }, [t, sortConfig, purposes, permissionPage]);

  const [searchQuery, setSearchQuery] = React.useState("");
  // const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  React.useEffect(() => {
    // handleSearch()
    console.log("permissionPage", permissionPage);

    handleGetStatus();
  }, []);

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
  };

  const handleDeletePurpose = async (id: string) => {
    confirm({
      modalType: ModalType.Delete,
      onConfirm: async () => {
        try {
          const resp = await DeleteStandardPurpose(id, JSON.parse(sessionStorage.getItem("user") as string).user_account_id);
          console.log("Deleted Success", resp);
          handleSearch();
        } catch (error) {
          console.error("Deleted Failed:", error);
        }
      },
    });
  };

  /*
  const openConfirmModalDeletePreference = (id: string) => {

    console.log("Delete:", id);
    setConfirmTitle("");
    setConfirmDetail("");
    setConfirmType(ModalType.Delete);
    setConfirmAction(() => handleDeletePurpose(id));
    setIsConfirmModalOpen(true);
    setConfirmSuccessMessage("");
    setConfirmErrorMessage("");
  };
  */

  const handleGetPurposes = async (filter: string): Promise<void> => {
    console.log(customerId);
    console.log(filter);
    setLoading(true);
    try {
      const response = await getStandardPurposeListByCustomerId(
        customerId,
        filter
      );
      console.log("res", response);

      if (response && Array.isArray(response.results)) {
        const formattedData: Purpose[] = response.results.map((item: any) => ({
          standardPurposeId: item.standardPurposeId,
          purposeName: item.purposeName ?? "-",
          description: item.description ?? "-",
          organizationID: item.organizationID ?? "-",
          organizationName: item.OrganizationName ?? "-",
          customerID: item.customerID ?? "-",
          isActiveStatus: item.isActiveStatus ?? false,
          versionNumber: item.versionNumber ?? 0,
          stdPurposeStatusID: item.stdPurposeStatusID ?? "-",
          stdPurposeStatusName: item.stdPurposeStatusName ?? "-",
          consentExpireType: item.consentExpireType ?? "-",
          parentVersionID: item.parentVersionID ?? null,
          translations: item.translations ?? [],
          createdDate: item.createdDate
            ? new Date(item.createdDate).toLocaleString()
            : "-",
          createdBy: item.createdBy ?? "-",
          createdByName: item.createdByName ?? "-",
          modifiedDate: item.modifiedDate ?? "-",
          modifiedBy: item.modifiedBy ?? "-",
          modifiedByName: item.modifiedByName ?? "-",
          publishedDate: item.publishedDate ?? "-",
          publishedBy: item.publishedBy ?? "-",
          publishedByName: item.publishedByName ?? "-",
          latestVersion: item.latestVersion ?? null,
          countInterface: item.countInterface,
        }));

        //if (response && Array.isArray(response)) {
        setPurposes({
          data: formattedData,
          pagination: {
            page: searchConditionRef.current.page,
            total_pages: response.totalPages,
          },
        });
        //}

        console.log("purposes", purposes);

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGetStatus = async () => {
    try {
      const response = await GetStandardPurposeStatus();
      //console.log('res', response);
      if (response && Array.isArray(response)) {
        const formattedData: StdStatus[] = response.map((item, index) => ({
          id: item.StdPurposeStatusId,
          label: item.StdPurposeStatusName,
          value: item.StdPurposeStatusId,
        }));
        formattedData.unshift({
          id: "",
          label: "All Status",
          value: "",
        });

        setStdStatus(formattedData.filter((item) => item.label !== "Retired"));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log(purposes);
  }, [purposes]);

  const handleSearch = useCallback(
    debounce(() => {
      console.log("searchTerm", searchConditionRef.current.searchTerm);

      let searchFilter = "";
      let searchStatus = "";
      let orderBy = `OrderBy=${searchConditionRef.current.column} ${searchConditionRef.current.sort}`;

      if (searchConditionRef.current.searchTerm.trim() !== "") {
        searchFilter = `SearchTerm=${searchConditionRef.current.searchTerm}`;
      }

      console.log("organization", organization);

      const orgFilter = organization
        .map((org) => `organizationId=="${org.id}"`)
        .join(" or ");

      let orgFilters = orgFilter + `or organizationId=="00000000-0000-0000-0000-000000000000"`;

      if (searchConditionRef.current.status !== "") {
        searchStatus = `Filter=stdPurposeStatusId=="${searchConditionRef.current.status}" and (${orgFilter})`;
      } else {
        if (orgFilters !== "") searchStatus = `Filter=(${orgFilters})`;
      }

      const pagination = `Page=${searchConditionRef.current.page}&PageSize=${searchConditionRef.current.pageSize}`;
      console.log("pagination", pagination);

      const filters = [searchFilter, searchStatus, orderBy, pagination]
        .filter(Boolean)
        .join("&");
      const searchStr = filters ? `?${filters}` : "";

      console.log("searchStr", searchStr);

      setFilterSearch(searchStr);
      handleGetPurposes(searchStr);
    }, 300),
    [organization]
  );

  useEffect(() => {
    searchConditionRef.current.searchTerm = searchTerm;
    searchConditionRef.current.status = selectedStatus;
    //searchConditionRef.current.page =
  }, [searchTerm, selectedStatus, searchConditionRef.current.page]);

  const handleInputChange = (value: any) => {
    console.log("searchTerm value", value);
    searchConditionRef.current.searchTerm = searchTerm;
    setSearchTerm(value);
    handleSearch();
  };

  const handleStatusChange = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    console.log(selectedOption);

    searchConditionRef.current.page = selectedOption;
    handleSearch();
  };

  const handleSort = (column: string) => {
    searchConditionRef.current.sort =
      searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;
    handleSearch();
  };

  const handlePageChange = (newPage: number) => {
    searchConditionRef.current.page = newPage;
    handleSearch();
  };

  useEffect(() => {
    console.log("orgparent", orgparent);
    // ตรวจสอบว่า orgparent มีค่าก่อนเรียก API
    if (!orgparent || !orgparent.orgParent) {
      console.warn("orgparent ไม่มีค่า หรือ orgParent เป็น null");
      return;
    }
    setLoading(true);
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg") || "null");
    setSelectedOrganization({
      id: currentOrg.organizationId,
      value: currentOrg.organizationId,
      label: currentOrg.organizationName,
    });
    getOrganizationCharts();
  }, [orgparent]);

  const getOrganizationCharts = async () => {
    const getUserSession: any = sessionStorage.getItem("user");
    const customerId = getUserSession
      ? JSON.parse(getUserSession).customer_id
      : "";
    console.log(customerId, orgparent);
    getOrganizationChart(customerId, orgparent.orgParent).then((res) => {
      getOrganization(res.data.data);
    });
  };

  const getOrganization = (org: any) => {
    const orgList: any[] = [];
    //if (!enableRequireOrganizationPurposes) {
    orgList.push({
      id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
      orgName: "",
      organizationChildRelationship: [],
    });
    // }
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
    console.log("orgList", orgList);
    setOrganization(orgLists);
  };

  useEffect(() => {
    if (organization.length > 0) {
      handleSearch();
    }
  }, [organization]);

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Draft":
        return " text-gray-600 bg-gray-200";
      case "Retired":
        return " text-red-600 bg-red-100";
      case "Published":
        return " text-green-600 bg-green-100";
      default:
        return " text-gray-600 bg-gray-200";
    }
  };

  return (
    <div className="">
      <div className="flex pb-2 mb-1">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold">
            {t("purpose.standardPurpose.title")}
          </h2>
          <p className="text-base ">
            {t("purpose.standardPurpose.description")}
          </p>
        </div>
      </div>
      <div className="flex mb-2">
        <div className="flex space-x-4 items-center mr-2">
          <div className="relative w-80">
            <Input
              onChange={(e) => {
                handleInputChange(e.target.value);
                searchConditionRef.current.page = 1;
              }}
              type="search"
              placeholder="Search"
              minWidth="20rem"
            ></Input>
          </div>
          <div className="w-2/12">
            <Dropdown
              id="selectedStatus"
              title=""
              className="w-full"
              selectedName={selectedStatusName}
              disabled={false}
              isError={false}
              minWidth="10rem"
            >
              {stdStatus.map((item) => (
                <DropdownOption
                  selected={selectedStatus === item.value}
                  onClick={() => {
                    handleStatusChange(item.id);
                    setSelectedStatusName(item.label);
                    searchConditionRef.current.page = 1;
                    handleSearch();
                  }}
                  key={item.id}
                >
                  <span
                    className={`${selectedStatus === item.value ? "text-white" : ""
                      }`}
                  >
                    {item.label}
                  </span>
                </DropdownOption>
              ))}
            </Dropdown>
          </div>
        </div>
        <IoFilterOutline className="text-gray-500 text-2xl my-auto cursor-pointer" />
        {permissionPage.isCreate && (
          <div className="ml-auto">
            <Button
              className="flex items-center gap-2 bg-primary-blue text-white"
              onClick={() =>
                navigate(`/consent/purpose/standard-purpose/new-spurpose`)
              }
            >
              <IoAdd className="text-lg"></IoAdd>
              <span className="text-white text-base font-semibold">
                {t("purpose.standardPurpose.createPurpose")}
              </span>
            </Button>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        data={purposes.data}
        pagination={purposes.pagination}
        loading={loading}
        handlePageChange={handlePageChange}
      />

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
    </div>
  );
}

export default StandardPurpose;
