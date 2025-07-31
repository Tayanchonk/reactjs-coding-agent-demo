import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react"; import { useTranslation } from "react-i18next";
import { IoFilterOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import DropdownOption from "../../../../components/CustomComponent/Dropdown/DropdownOption";
import Tag from "../../../../components/CustomComponent/Tag";
import Dropdown from "../../../../components/CustomComponent/Dropdown";
import Input from "../../../../components/CustomComponent/InputText";
import { Table, SortingHeader } from "../../../../components/CustomComponent";
import { deleteReceiptById, getReceiptList } from "../../../../services/receiptsService";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import { RootState } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationChart } from "../../../../services/organizationService";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { setMenuDescription } from "../../../../store/slices/menuDescriptionSlice";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import { setMenuHeader } from "../../../../store/slices/menuHeaderSlice";
import { setMenuBreadcrumb } from "../../../../store/slices/menuBreadcrumbSlice";

interface Receipt {
  receiptId: string;
  transactions: number;
  profileIdentifier: string;
  interfaceName: string;
  isDeletedProfile: boolean;
  isAnonymizeDataElement: boolean;
  interfaceVersion: string;
  receiptDate: string;
  transactionDate: string;
  consentDate: string;
  receivedMode: string;
  interfaceId: string;
}

interface MenuItemType {
  id: string;
  label: string;
  value: string;
}


const ReceiptPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [receiptStatus, setReceiptStatus] = useState([
    { id: "0", label: "All Received Mode", value: "All" },
    { id: "1", label: "Test", value: "Test" },
    { id: "2", label: "Production", value: "Production" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStatusName, setSelectedStatusName] = useState("All Received Mode");
  const searchConditionRef = useRef({
    searchTerm: "",
    status: "",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "ModifiedDate",
    totalPage: 0,
  });
  const dateTimeStr = localStorage.getItem("datetime") || undefined;
  const orgparent = useSelector((state: RootState) => state.orgparent);
  const [organization, setOrganization] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const organizationRef = useRef<any[]>([]);

  const [filterSearch, setFilterSearch] = useState("");
  const [selectedOrganization, setSelectedOrganization] =
    useState<MenuItemType>({
      id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
      label: "",
      value: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
    });
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const getUserSession: any = sessionStorage.getItem("user");
  const userAccountId = JSON.parse(getUserSession);

  const [receipts, setReceipts] = useState<{
    data: Receipt[];
    pagination: { page: number; total_pages: number };
  }>({
    data: [],
    pagination: { page: 1, total_pages: 1 },
  });

  const confirm = useConfirm();
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Delete);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );

  const handleGetReceipts = async (filter: string, orgFilters: Array<string>): Promise<void> => {
    console.log(orgFilters)
    setLoading(true);
    try {
      const response = await getReceiptList(filter, orgFilters);
      console.log("response", response);
      if (response && Array.isArray(response.data)) {
        const formattedData: Receipt[] = response.data.map((item: any) => ({
          receiptId: item.receiptId ?? "-",
          transactions: item.transactions ?? 0,
          profileIdentifier: item.profileEmail ?? "-",
          profileIdentifierId: item.profileId ?? "-",
          interfaceName: item.interfaceName ?? "-",
          interfaceVersion: item.interfaceVersion ?? "-",
          receiptDate: item.receiptDate ?? "-",
          isDeletedProfile: item.isDeletedProfile ?? false,
          isAnonymizeDataElement: item.isAnonymizeDataElement ?? false,
          transactionDate: item.transactionDate ?? "-",
          consentDate: item.consentDate ?? "-",
          receivedMode: item.receivedMode ?? "-",
          interfaceId: item.interfaceId ?? "-",
        }));

        setReceipts({
          data: formattedData,
          pagination: {
            page: response.pagination?.page ?? 1,
            total_pages: response.pagination?.total_pages ?? 1,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce(() => {
      console.log("searchTerm", searchConditionRef.current.searchTerm);

      let searchFilter = "";
      let orderBy = `column=${searchConditionRef.current.column}&sort=${searchConditionRef.current.sort}`;

      if (searchConditionRef.current.searchTerm.trim() !== "") {
        searchFilter = `searchTerm=${searchConditionRef.current.searchTerm}`;
      }

      console.log("(organization.length", organization.length);

      let orgFilters = organizationRef.current.map((org) => org.id)
      orgFilters.push("00000000-0000-0000-0000-000000000000");

      const searchStatus = `statusFilter=${searchConditionRef.current.status || "All"}`;

      const pagination = `page=${searchConditionRef.current.page}&pageSize=${searchConditionRef.current.pageSize}`;


      const filters = [searchFilter, searchStatus, orderBy, pagination]
        .filter(Boolean)
        .join("&");

      const searchStr = filters ? `?${filters}` : "";

      console.log("searchStr", searchStr);

      setFilterSearch(searchStr);
      handleGetReceipts(searchStr, orgFilters);
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

    searchConditionRef.current.status = selectedOption;
    handleSearch();
  };

  const handleSort = (column: string) => {
    searchConditionRef.current.sort = searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;
    handleSearch();
  };

  const handlePageChange = (newPage: number) => {
    searchConditionRef.current.page = newPage;
    handleSearch();
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
    organizationRef.current = orgLists;
    setOrganization(orgLists);
  };


  useEffect(() => {
    if (organization.length > 0) {
      handleSearch();
    }
  }, [organization]);


  const handleDelete = async (receiptId: string) => {
    confirm({
      modalType: ModalType.Delete,
      onConfirm: async () => {
        try {
          const resp = await deleteReceiptById(receiptId, userAccountId.user_account_id);
          console.log("Deleted Success", resp);
          handleSearch();
        } catch (error) {
          console.error("Deleted Failed:", error);
        }
      },
    });
  };


  const getStatusStyle = (status: string) => {
    return status === "Test"
      ? "text-gray-600 bg-gray-200"
      : "text-green-600 bg-green-200";
  };

  const columns = useMemo(() => [
    {
      Header: <SortingHeader onClick={() => handleSort("ReceiptId")} title={t("dataSubjectReceipt.headers.receiptId")} />,
      accessor: "receiptId",
      Cell: ({ row }: any) => (

        <span className="text-base font-semibold text-primary-blue cursor-pointer"
          onClick={() => {
            navigate(
              `/consent/receipts/details/${row.original.receiptId}`
            );
          }}>{row.original.receiptId}</span>
      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("Transactions")} title={t("dataSubjectReceipt.headers.transaction")} center={true} />,
      accessor: "transactions",
      Cell: ({ row }: { row: any }) => (
        <div className="w-full text-center">{row.original.transactions}</div>
      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("DataSubject.ProfileIdentifier")} title={t("dataSubjectReceipt.headers.profileIdentifier")} />,
      accessor: "profileIdentifier",
      Cell: ({ row }: any) => {
        if (row.original.isAnonymizeDataElement || row.original.isDeletedProfile)
          return <div className="text-base ">{row.original.profileIdentifier}</div>
        return <a href={"/consent/data-subject/view/" + row.original.profileIdentifierId + "/information"} className="text-base text-blue-600 font-semibold">{row.original.profileIdentifier}</a>
      }
    },
    {
      Header: <SortingHeader onClick={() => handleSort("Interface.InterfaceName")} title={t("dataSubjectReceipt.headers.interface")} />,
      accessor: "interfaceName",
      Cell: ({ row }: any) => (
        <div
          className="flex items-center"
          onClick={() => navigate(`/consent/consent-interface/view/${row.original.interfaceId}/info`)}>
          <div className="relative group justify-start">
            <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ width: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.interfaceName}</p>
            <div
              className="absolute bottom-full left-0 translate-y-[-6px] z-50 
               hidden group-hover:inline-block bg-gray-800 text-white text-xs rounded py-1 px-2 
               shadow-lg break-words min-w-max max-w-[300px]"
              style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {row.original.interfaceName}
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("InterfaceVersion")} title={t("dataSubjectReceipt.headers.interfaceVersion")} center={true} />,
      accessor: "interfaceVersion",
      Cell: ({ row }: any) => (
        <div className="w-full flex justify-center">
          <Tag
            size="sm"
            minHeight="1.625rem"
            className="text-primary-blue font-medium px-3 py-1 rounded-md text-base bg-blue-100"
          >
            Version {row.original.interfaceVersion}
          </Tag>
        </div>
      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("ReceiptDate")} title={t("dataSubjectReceipt.headers.receiptDate")} center={true} />,
      accessor: "receiptDate",
      Cell: ({ value }: any) => <span className="flex justify-center items-center w-full">{formatDate(value)}</span>,
    },
    {
      Header: <SortingHeader onClick={() => handleSort("IsTestMode")} title={t("dataSubjectReceipt.headers.receivedMode")} center={true} />,
      accessor: "receivedMode",
      Cell: ({ row }: any) => (
        <div className="w-full flex justify-center">
          <Tag size="sm" minHeight="1.625rem" className={`px-3 py-1 rounded-md text-base max-w-max ${getStatusStyle(row.original.receivedMode)}`}>
            {row.original.receivedMode}
          </Tag>
        </div>

      ),
    },
    {
      Header: "",
      accessor: "actions",
      Cell: ({ row }: { row: any }) => {
        const hasDeletePermission = permissionPage?.isDelete ?? false;

        if (hasDeletePermission && row.original.receivedMode !== "Test") return null;

        return (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="cursor-pointer">
              <BsThreeDotsVertical />
            </MenuButton>
            <MenuItems className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <MenuItem>
                <button
                  className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                  onClick={() => {
                    handleDelete(row.original.receiptId);
                    console.log("Delete receipt:", row.original.receiptId);
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
                    Delete
                  </span>
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        );
      },
    },

  ], [t]);

  useEffect(() => {
    dispatch(setMenuDescription(t("dataSubjectReceipt.description")));
    return () => {
      dispatch(setMenuDescription(""));
    };
  }, [t]);

  return (
    <div className="pt-5 px-10 bg-white">
      {/* Search + Filter */}
      <div className="flex mb-4 items-center gap-4">
        <div className="relative w-80">
          <Input
            onChange={(e: any) => {
              searchConditionRef.current.page = 1;
              handleInputChange(e.target.value);
            }}
            type="search"
            placeholder="Search"
            minWidth="20rem"

          />
        </div>

        <div className="w-52">
          <Dropdown
            id="selectedStatus"
            title=""
            className="w-full"
            selectedName={selectedStatusName}
            disabled={false}
            isError={false}
            minWidth="10rem"
          >
            {receiptStatus.map((item) => (
              <DropdownOption
                selected={selectedStatus === item.value}
                onClick={() => {
                  handleStatusChange(item.value);
                  setSelectedStatus(item.value);
                  setSelectedStatusName(item.label);
                }}
                key={item.id}
              >
                <span className={`${selectedStatus === item.value ? "text-white" : ""}`}>
                  {item.label}
                </span>
              </DropdownOption>
            ))}
          </Dropdown>
        </div>

        <IoFilterOutline className="text-gray-500 text-2xl cursor-pointer" />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={receipts.data}
        pagination={receipts.pagination}
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
};

export default ReceiptPage;


