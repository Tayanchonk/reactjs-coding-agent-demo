import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IoFilterOutline } from "react-icons/io5";
import DropdownOption from "../../../../../components/CustomComponent/Dropdown/DropdownOption";
import Tag from "../../../../../components/CustomComponent/Tag";
import Dropdown from "../../../../../components/CustomComponent/Dropdown";
import Input from "../../../../../components/CustomComponent/InputText";
import { Table, SortingHeader } from "../../../../../components/CustomComponent";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { getTransactionList } from "../../../../../services/transactionService";
import { getOrganizationChart } from "../../../../../services/organizationService";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { setMenuDescription } from "../../../../../store/slices/menuDescriptionSlice";
import { setDataSubjectPurpose } from "../../../../../store/slices/dataSubjectSlice";
import { AiOutlineClose } from "react-icons/ai";

interface Transaction {
  transactionId: string;
  transactionStatusName: string;
  profileIdentifier: string;
  standardPurposeName: string;
  standardPurposeId: string;
  standardPurposeVersion: string;
  receiptId: string;
  transactionDate: string;
  receivedMode: string;
}

interface MenuItemType {
  id: string;
  label: string;
  value: string;
}

type LocationState = {
  purposeName: string;
  purposeId: string;
};


const Transaction = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { purposeName: initialPurposeName, purposeId: initialPurposeId } =
    (location.state || {}) as LocationState;
  const [currentPurposeName, setCurrentPurposeName] = useState<string | null>(
    initialPurposeName || null
  );
  const [currentPurposeId, setCurrentPurposeId] = useState<string | null>(
    initialPurposeId || null
  );
  const orgparent = useSelector((state: RootState) => state.orgparent);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [receiveStatus] = useState([
    { id: "0", label: "All Received Mode", value: "All" },
    { id: "1", label: "Test", value: "Test" },
    { id: "2", label: "Production", value: "Production" },
  ]);

  const [transactionStatus] = useState([
    { id: "0", label: "All Status", value: "All" },
    { id: "1", label: "Confirmed", value: "Confirmed" },
    { id: "2", label: "Expired", value: "Expired" },
    { id: "3", label: "Not Given", value: "Not Given" },
    { id: "4", label: "Withdrawn", value: "Withdrawn" },
  ]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStatusName, setSelectedStatusName] = useState("All Status");
  const [selectedReceivedMode, setSelectedReceivedMode] = useState("");
  const [selectedReceivedModeName, setSelectedReceivedModeName] = useState("All Received Mode");
  const dateTimeStr = localStorage.getItem("datetime") || undefined;

  const [organization, setOrganization] = useState<any[]>([]);
  const organizationRef = useRef<any[]>([]);

  const [selectedOrganization, setSelectedOrganization] = useState<MenuItemType>({
    id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
    label: "",
    value: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
  });

  const searchConditionRef = useRef({
    searchTerm: "",
    transactionStatus: "",
    receiveMode: "",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "ModifiedDate",
    totalPage: 0,
  });

  const [transactions, setTransactions] = useState<{
    data: Transaction[];
    pagination: { page: number; total_pages: number };
  }>({
    data: [],
    pagination: { page: 1, total_pages: 1 },
  });
  const dataSubject = useSelector((state: RootState) => state.dataSubject);
  console.log("dataSubject", dataSubject);

  useEffect(() => {
    const found = receiveStatus.find(s => s.value === String(dataSubject.statusRetriveMode));
    setSelectedReceivedMode(found?.value || "All");
    setSelectedReceivedModeName(found?.label || "All Received Mode");
    searchConditionRef.current.receiveMode = found?.value || "All";
    console.log(selectedReceivedMode);
    console.log(selectedReceivedModeName);


  }, [dataSubject, receiveStatus]);

  const handleSearch = useCallback(
    debounce(() => {
      let searchFilter = "";
      let orderBy = `column=${searchConditionRef.current.column}&sort=${searchConditionRef.current.sort}`;

      if (searchConditionRef.current.searchTerm.trim() !== "") {
        searchFilter = `searchTerm=${searchConditionRef.current.searchTerm}`;
      }

      const datasubjectId = `datasubjectId=${id}`;
      const filterpurposeId = `stadardPurposeId=${currentPurposeId}`;

      //const orgFilter = organizationRef.current.map((org) => `organizationIds=${org.id}`).join("&");
      const searchStatus = `statusFilter=${searchConditionRef.current.transactionStatus || "All"}`;
      const receivedMode = `receivedMode=${searchConditionRef.current.receiveMode || "All"}`;
      const pagination = `page=${searchConditionRef.current.page}&pageSize=${searchConditionRef.current.pageSize}`;

      const filters = [searchFilter, searchStatus, receivedMode, datasubjectId, orderBy, pagination]
        .filter(Boolean)
        .join("&");

      let searchStr = filters ? `?${filters}` : "";
      console.log("searchStr before purposeId", currentPurposeId);
      if (currentPurposeId) {
        currentPurposeId && (searchStr += `&${filterpurposeId}`);
      }
      console.log("searchStr", searchStr);
      handleGetTransaction(searchStr);
    }, 300),
    [currentPurposeId, id]
  );

  const handleTransactionStatusChange = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setSelectedStatusName(
      transactionStatus.find((s) => s.value === selectedOption)?.label || "All Status"
    );
    searchConditionRef.current.transactionStatus = selectedOption;
    handleSearch();
  };

  const handleReceiveModeChange = (selectedOption: any) => {
    setSelectedReceivedMode(selectedOption);
    setSelectedReceivedModeName(
      receiveStatus.find((s) => s.value === selectedOption)?.label || "All Received Mode"
    );
    dispatch(setDataSubjectPurpose(selectedOption));
    searchConditionRef.current.receiveMode = selectedOption;
    handleSearch();
  };

  const handleGetTransaction = async (filter: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getTransactionList(filter);
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

  useEffect(() => {

    handleSearch();

  }, []);

  /*
  useEffect(() => {
    if (organization.length > 0) {
      handleSearch();
    }
  }, [organization]);
  */

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
  }, []);

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
    organizationRef.current = orgLists;
    setOrganization(orgLists);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Withdrawn": return "text-red-600 bg-red-100";
      case "Confirmed": return "text-green-700 bg-green-100";
      case "Not Given": return "text-yellow-500 bg-yellow-100";
      case "Expired": return "text-gray-600 bg-gray-200";
      default: return "text-gray-600 bg-gray-200";
    }
  };

  const getReceivedModeStyle = (mode: string) => {
    return mode === "Test" ? "text-gray-600 bg-gray-200" : "text-green-600 bg-green-100";
  };

  const handleSort = (column: string) => {
    searchConditionRef.current.sort = searchConditionRef.current.sort === "asc" ? "desc" : "asc";
    searchConditionRef.current.column = column;
    handleSearch();
  };

  const handlePageChange = (page: number) => {
    searchConditionRef.current.page = page;
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
    handleSearch();
  }, [currentPurposeId]);

  const columns = useMemo(() => [
    {
      Header: <SortingHeader onClick={() => handleSort("TransactionId")} title={t("transactions.headers.transactionId")} />, accessor: "transactionId",
      Cell: ({ row }: any) => <span className="text-base font-semibold text-primary-blue cursor-pointer" onClick={() => navigate(`/consent/transaction/details/${row.original.transactionId}`)}>{row.original.transactionId}</span>,
    },
    {
      Header: <SortingHeader onClick={() => handleSort("TransactionStatus.StatusName")} title={t("transactions.headers.transactionStatus")} center={true} />, accessor: "transactionStatusName",
      Cell: ({ value }: any) => (
        <span className="flex justify-center items-center w-full">
          <Tag size="sm" minHeight="1.625rem" className={`px-3 py-1 rounded-md text-base max-w-max ${getStatusStyle(value)}`}>{value}</Tag>
        </span>
      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("Receipt.DataSubject.ProfileIdentifier")} title={t("transactions.headers.profileIdentifier")} />, accessor: "profileIdentifier",
      Cell: ({ row }: any) => <span className="text-base font-normal" >{row.original.profileIdentifier}</span>
    },
    {
      Header: <SortingHeader onClick={() => handleSort("StandardPurposeName")} title={t("transactions.headers.standardPurpose")} />, accessor: "standardPurposeName",
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

      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("StandardPurposeVersion")} title={t("transactions.headers.standardPurposeVersion")} center={true} />, accessor: "standardPurposeVersion",
      Cell: ({ row }: any) => (
        <span className="flex justify-center items-center w-full">
          <Tag size="sm" minHeight="1.625rem" className="text-primary-blue font-medium px-3 py-1 rounded-md text-base bg-blue-100 max-w-max">
            Version {row.original.standardPurposeVersion}
          </Tag>
        </span>
      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("ReceiptId")} title={t("transactions.headers.receiptId")} />, accessor: "receiptId",
      Cell: ({ row }: any) => <span className="text-base font-semibold text-primary-blue cursor-pointer">{row.original.receiptId}</span>,
    },
    {
      Header: <SortingHeader onClick={() => handleSort("TransactionDate")} title={t("transactions.headers.transactionDate")} center={true}/>, accessor: "transactionDate",
      Cell: ({ value }: any) => <span className="flex justify-center items-center w-full">{formatDate(value)}</span>,
    },
    {
      Header: <SortingHeader onClick={() => handleSort("IsTestMode")} title={t("transactions.headers.receivedMode")} center={true}/>, accessor: "receivedMode",
      Cell: ({ row }: any) => (
        <span className="flex justify-center items-center w-full">
          <Tag size="sm" minHeight="1.625rem" className={`px-3 py-1 rounded-md text-base max-w-max ${getReceivedModeStyle(row.original.receivedMode)}`}>{row.original.receivedMode}</Tag>
        </span>
      ),
    },
  ], []);

  /*
  useEffect(() => {
    dispatch(setMenuDescription(t("transactions.description")));
    return () => {
      dispatch(setMenuDescription(""));
    };
  }, [t]);

  */

  return (
    <div className="pt-5 px-10 bg-white">


      <div className="flex pb-2 mb-2">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold">
            {t("dataSubjectProfile.transactions")}
          </h2>
          <p className="text-base ">
            {t("dataSubjectProfile.descriptionTransactions")}
          </p>
        </div>
      </div>

      <div className="flex mb-4 items-center gap-4">
        <div className="relative w-80">
          <Input
            onChange={(e: any) => {
              searchConditionRef.current.page = 1;
              searchConditionRef.current.searchTerm = e.target.value;
              handleSearch();
            }}
            type="search"
            placeholder="Search"
            minWidth="20rem"
          />
        </div>
        <div className="w-45">
          <Dropdown id="selectedStatus" title="" className="w-full" selectedName={selectedStatusName} disabled={false} isError={false} minWidth="12rem">
            {transactionStatus.map((item) => (
              <DropdownOption selected={selectedStatus === item.value} onClick={() => handleTransactionStatusChange(item.value)} key={item.id}>
                <span className={`${selectedStatus === item.value ? "text-white" : ""}`}>{item.label}</span>
              </DropdownOption>
            ))}
          </Dropdown>
        </div>
        <div className="w-52">
          <Dropdown id="selectedMode" title="" className="w-full" selectedName={selectedReceivedModeName} disabled={false} isError={false} minWidth="10rem">
            {receiveStatus.map((item) => (
              <DropdownOption selected={selectedReceivedMode === item.value} onClick={() => handleReceiveModeChange(item.value)} key={item.id}>
                <span className={`${selectedReceivedMode === item.value ? "text-white" : ""}`}>{item.label}</span>
              </DropdownOption>
            ))}
          </Dropdown>
        </div>
        <IoFilterOutline className="text-gray-500 text-2xl cursor-pointer" />
        {currentPurposeName && (
          <Tag
            size="sm"
            minHeight="1.625rem"
            className="text-primary-blue font-medium rounded-md text-base bg-blue-100 "
          >
            {currentPurposeName}
            <AiOutlineClose
              className="cursor-pointer hover:text-gray-700"
              onClick={() => {
                setCurrentPurposeName(null);
                setCurrentPurposeId(null);
                searchConditionRef.current.page = 1;
                // handleSearch();
              }}
            />
          </Tag>
        )}
      </div>

      <Table columns={columns} data={transactions.data} pagination={transactions.pagination} loading={loading} handlePageChange={handlePageChange} />
    </div>
  );
};

export default Transaction;
