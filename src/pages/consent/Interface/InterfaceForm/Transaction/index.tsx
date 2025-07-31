import { useOutletContext } from "react-router-dom";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import DropdownOption from "../../../../../components/CustomComponent/Dropdown/DropdownOption";
import Tag from "../../../../../components/CustomComponent/Tag";
import { Button } from "../../../../../components/CustomComponent";
import { Table, SortingHeader } from '../../../../../components/CustomComponent';
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import dayjs from "dayjs";
import Dropdown from "../../../../../components/CustomComponent/Dropdown";
import Input from "../../../../../components/CustomComponent/InputText";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import { IoFilterOutline } from "react-icons/io5";
import { getTransactionList } from "../../../../../services/transactionService";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getOrganizationChart } from "../../../../../services/organizationService";
import { setMenuDescription } from "../../../../../store/slices/menuDescriptionSlice";

interface Transaction {
  transactionId: string;
  transactionStatusName: string;
  standardPurposeName: string;
  profileIdentifier: string;
  standardPurpose: string;
  standardPurposeVersion: string;
  receiptId: string;
  interactionDate: string;
}
interface TransactionStatus {
  id: string;
  label: string;
  value: string;
}

interface MenuItemType {
  id: string;
  label: string;
  value: string;
}

const InterfaceTransaction = () => {
  const context = useOutletContext<{ mode: string; id?: string }>();
  const { mode, id } = context || { mode: "create" };
  let { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const orgparent = useSelector((state: RootState) => state.orgparent);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState<{
    data: Transaction[];
    pagination: { page: number; total_pages: number };
  }>({
    data: [],
    pagination: { page: 1, total_pages: 1 },
  });


  const searchConditionRef = useRef({
    searchTerm: "",
    transactionStatus: "All",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "ModifiedDate",
    totalPage: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStatusName, setSelectedStatusName] = useState("All Status");
  const dateTimeStr = localStorage.getItem("datetime") || undefined;
  const [transacStatus, setTransacStatus] = useState<TransactionStatus[]>([]);

  const [organization, setOrganization] = useState<any[]>([]);
  const organizationRef = useRef<any[]>([]);

  const [selectedOrganization, setSelectedOrganization] = useState<MenuItemType>({
    id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
    label: "",
    value: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
  });
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );

  const [transactionStatus] = useState([
    { id: "0", label: "All Status", value: "All" },
    { id: "1", label: "Confirmed", value: "Confirmed" },
    { id: "2", label: "Expired", value: "Expired" },
    { id: "3", label: "Not Given", value: "Not Given" },
    { id: "4", label: "Withdrawn", value: "Withdrawn" },
  ]);

  const datas = [
    {
      transactionId: "92dead62-471a-46a4-3322-0135dac2bca1",
      transactionStatus: "Confirmed",
      profileIdentifier: "pp@gmail.com",
      standardPurpose: "ยอมรับข้อตกลงให้ใช้ข้อมูลสุขภาพ",
      standardPurposeVersion: "Version 1",
      receiptId: "cade7261-dc20-469f-bf2c-09f3b26692e",
      interactionDate: "11/18/24 14:10",
    },
    {
      transactionId: "92dead62-471a-46a4-828b-0135dac2bca5",
      transactionStatus: "Withdrawn",
      profileIdentifier: "hh@gmail.com",
      standardPurpose: "ยอมรับข้อตกลงให้ใช้ข้อมูลสุขภาพจิต",
      standardPurposeVersion: "Version 2",
      receiptId: "cade7261-dc20-469f-bf2c-09f3b26692e",
      interactionDate: "11/18/24 14:10",
    },
  ];



  const columns = useMemo(() => {
    return [
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("TransactionId")}
            title={t("transactions.headers.transactionId")}
          />
        ),
        accessor: "transactionId",
        Cell: ({ row }: { row: any }) => (
          <span className="text-base font-semibold text-primary-blue cursor-pointer" onClick={() => navigate("/consent/transaction/details/" + row.original.transactionId)}>{row.original.transactionId}</span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("TransactionStatus.StatusName")}
            title={t("transactions.headers.transactionStatus")}
            center={true}
          />
        ),
        accessor: "transactionStatusName",
        Cell: ({ value }: { value: string }) => (
          <span className="flex justify-center items-center w-full">
            <Tag
              size="sm"
              minHeight="1.625rem"
              className={`px-3 py-1 rounded-md text-base max-w-max ${getStatusStyle(value)}`}
            >
              {value}
            </Tag>
          </span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("ProfileIdentifier")}
            title={t("transactions.headers.profileIdentifier")}
          />
        ),
        accessor: "profileIdentifier",
        Cell: ({ row }: { row: any }) => (
          <a href={"/consent/data-subject/view/" + row.original.profileIdentifierId + "/information"} className="text-base font-semibold text-primary-blue">{row.original.profileIdentifier}</a>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("StandardPurposeName")}
            title={t("transactions.headers.standardPurpose")}
          />
        ),
        accessor: "standardPurposeName",
        Cell: ({ row }: any) => (
          <div
            className="flex items-center"
            onClick={() => navigate("/consent/purpose/standard-purpose/view-spurpose/" + row.original.standardPurposeId)}>
            <div className="relative group justify-start">
              <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ width: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.standardPurposeName}</p>
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
                {row.original.standardPurposeName}
              </div>
            </div>
          </div>

        )
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("StandardPurposeVersion")}
            title={t("transactions.headers.standardPurposeVersion")}
            center={true}
          />
        ),
        accessor: "standardPurposeVersion",
        Cell: ({ value }: { value: string }) => (
          <span className="flex justify-center items-center w-full">
            <Tag
              size="sm"
              minHeight="1.625rem"
              className="text-primary-blue font-medium px-3 py-1 rounded-md text-base bg-blue-100 max-w-max"
            >
              Version {value}
            </Tag>
          </span>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("ReceiptId")}
            title={t("transactions.headers.receiptId")}
          />
        ),
        accessor: "receiptId",
        Cell: ({ row }: { row: any }) => (
          <a href={"/consent/receipts/details/" + row.original.receiptId} className="text-base font-semibold text-primary-blue">{row.original.receiptId}</a>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("InteractionDate")}
            title={t("transactions.headers.interactionDate")}
            center={true}
          />
        ),
        accessor: "interactionDate",
        Cell: ({ value }: { value: string }) => (
          <div className="flex justify-center items-center w-full">{formatDate(value)}</div>
        ),
      },
      {
        Header: <SortingHeader onClick={() => handleSort("IsTestMode")} title={t("transactions.headers.receivedMode")} center={true} />, accessor: "receivedMode",
        Cell: ({ row }: any) => (
          <span className="flex justify-center items-center w-full">
            <Tag size="sm" minHeight="1.625rem" className={`px-3 py-1 rounded-md text-base max-w-max ${getReceivedModeStyle(row.original.receivedMode)}`}>{row.original.receivedMode}</Tag>
          </span>
        ),
      },
    ];
  }, []);


  React.useEffect(() => {
    // handleSearch()
    console.log("permissionPage", permissionPage);

    //handleGetTransaction();
  }, []);

  const getReceivedModeStyle = (mode: string) => {
    return mode === "Test" ? "text-gray-600 bg-gray-200" : "text-green-600 bg-green-100";
  };

  const handleGetTransaction = async (filter: string, orgFilters: Array<string>): Promise<void> => {
    console.log("handleGetTransaction filter", filter);
    console.log("handleGetTransaction organization", organization);
    setLoading(true);
    try {
      const response = await getTransactionList(filter, orgFilters);
      console.log("response", response);
      if (response && Array.isArray(response.data)) {
        const formattedData: Transaction[] = response.data.map((item: any) => ({
          transactionId: item.transactionId ?? "-",
          transactionStatusName: item.transactionStatusName ?? "-",
          profileIdentifier: item.profileName ?? "-",
          profileIdentifierId: item.profileId ?? "-",
          standardPurposeName: item.standardPurposeName ?? "-",
          standardPurposeId: item.standardPurposeId ?? "-",
          standardPurposeVersion: item.standardPurposeVersion ?? "-",
          receiptId: item.receiptId ?? "-",
          transactionDate: item.transactionDate ?? "-",
          receivedMode: item.receivedMode ?? "-",
        }));

        setTransactions({
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

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Withdrawn": return "text-red-600 bg-red-100";
      case "Confirmed": return "text-green-700 bg-green-100";
      case "Not Given": return "text-yellow-500 bg-yellow-100";
      case "Expired": return "text-gray-600 bg-gray-200";
      default: return "text-gray-600 bg-gray-200";
    }
  };


  const handleSearch = useCallback(
    debounce(() => {
      let searchFilter = "";
      let orderBy = `column=${searchConditionRef.current.column}&sort=${searchConditionRef.current.sort}`;

      if (searchConditionRef.current.searchTerm.trim() !== "") {
        searchFilter = `searchTerm=${searchConditionRef.current.searchTerm}`;
      }

      const interfaceId = `interfaceId=${id}`;

      const orgFilters = organizationRef.current.map((org) => org.id)


      const searchStatus = `statusFilter=${searchConditionRef.current.transactionStatus || "All"}`;
      const pagination = `page=${searchConditionRef.current.page}&pageSize=${searchConditionRef.current.pageSize}`;

      const filters = [searchFilter, searchStatus, interfaceId, orderBy, pagination]
        .filter(Boolean)
        .join("&");

      const searchStr = filters ? `?${filters}` : "";

      console.log("searchStr", searchStr);
      handleGetTransaction(searchStr, orgFilters);
    }, 300),
    [organization]
  );

  useEffect(() => {
    searchConditionRef.current.searchTerm = searchTerm;
    searchConditionRef.current.transactionStatus = selectedStatus;
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

    searchConditionRef.current.transactionStatus = selectedOption;
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
    if (organization.length > 0) {
      handleSearch();
    }
  }, [organization]);

  useEffect(() => {
    if (!orgparent || !orgparent.orgParent) return;
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
    const customerId = getUserSession ? JSON.parse(getUserSession).customer_id : "";
    getOrganizationChart(customerId, orgparent.orgParent).then((res) => {
      getOrganization(res.data.data);
    });
  };

  const getOrganization = (org: any) => {
    const orgList: any[] = [];
    orgList.push({
      id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
      orgName: "",
      organizationChildRelationship: [],
    });
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
    const orgLists = orgList.map((child: any) => ({
      label: child.orgName,
      id: child.id,
      value: child.id,
    }));

    setOrganization(orgLists);
    organizationRef.current = orgLists;
  };


  return (
    <div className="p-4">
      <div className="flex pb-2 mb-1">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold">
            {t("transactions.title")}
          </h2>
          <p className="text-base ">
            {t("transactions.description")}
          </p>
        </div>
      </div>
      <div className="flex mb-2">
        <div className="flex space-x-4 items-center mr-2">
          <div className="relative w-80">
            <Input
              onChange={(e: any) => {
                searchConditionRef.current.page = 1;
                searchConditionRef.current.searchTerm = e.target.value;
                handleSearch();
              }}
              type="search"
              placeholder="search"
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
              {transactionStatus.map((item) => (
                <DropdownOption
                  selected={selectedStatus === item.value}
                  onClick={() => {
                    handleStatusChange(item.value)
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

      </div>
      <div className="w-full">
        <Table
          columns={columns}
          data={transactions.data}
          pagination={transactions.pagination}
          loading={loading}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default InterfaceTransaction;