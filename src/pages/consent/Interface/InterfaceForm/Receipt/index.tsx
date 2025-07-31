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
import { deleteReceiptById, getReceiptList } from "../../../../../services/receiptsService";
import { getOrganizationChart } from "../../../../../services/organizationService";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { setMenuDescription } from "../../../../../store/slices/menuDescriptionSlice";
import { useParams, useNavigate } from "react-router-dom";


interface Receipt {
    receiptId: string;
    transactions: number;
    profileIdentifier: string;
    interfaceName: string;
    interfaceVersion: string;
    receiptDate: string;
    transactionDate: string;
    consentDate: string;
    receivedMode: string;
    interfaceId: string;
}

interface ReceiptStatus {
    id: string;
    label: string;
    value: string;
}

interface MenuItemType {
    id: string;
    label: string;
    value: string;
}


const InterfaceReceipt = () => {
    const context = useOutletContext<{ mode: string; id?: string }>();
    const { mode, id } = context || { mode: "create" };
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [receipts, setReceipts] = useState<{
        data: Receipt[];
        pagination: { page: number; total_pages: number };
    }>({
        data: [],
        pagination: { page: 1, total_pages: 1 },
    });

    const [receiptStatus, setReceiptStatus] = useState([
        { id: "0", label: "All Received Mode", value: "All" },
        { id: "1", label: "Test", value: "Test" },
        { id: "2", label: "Production", value: "Production" },
    ]);

    const organizationRef = useRef<any[]>([]);

    const searchConditionRef = useRef({
        searchTerm: "",
        status: "",
        page: 1,
        pageSize: 20,
        sort: "desc",
        column: "modifiedDate",
        totalPage: 0,
    });

    const orgparent = useSelector((state: RootState) => state.orgparent);
    const [organization, setOrganization] = useState<any[]>([]);
    const [selectedOrganization, setSelectedOrganization] =
        useState<MenuItemType>({
            id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
            label: "",
            value: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
        });
    const [filterSearch, setFilterSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedStatusName, setSelectedStatusName] = useState("All Status");
    const dateTimeStr = localStorage.getItem("datetime") || undefined;

    const columns = useMemo(() => [
        {
            Header: <SortingHeader
                onClick={() => handleSort("ReceiptId")}
                title={t("dataSubjectReceipt.headers.receiptId")}
            />,
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
            Cell: ({ row }: any) => (
                <a href={"/consent/data-subject/view/" + row.original.profileIdentifierId + "/information"} className="text-base font-semibold text-primary-blue">{row.original.profileIdentifier}</a>
            ),
        },
        {
            Header: <SortingHeader onClick={() => handleSort("ReceiptDate")} title={t("dataSubjectReceipt.headers.receiptDate")} center={true} />,
            accessor: "receiptDate",
            Cell: ({ value }: any) => <div className="flex justify-center items-center w-full">{formatDate(value)}</div>,
        },
        {
            Header: <SortingHeader onClick={() => handleSort("IsTestMode")} title={t("dataSubjectReceipt.headers.receivedMode")} center={true} />,
            accessor: "receivedMode",
            Cell: ({ row }: any) => (
                <div className="flex justify-center items-center w-full">
                    <Tag size="sm" minHeight="1.625rem" className={`px-3 py-1 rounded-md text-base max-w-max ${getStatusStyle(row.original.receivedMode)}`}>
                        {row.original.receivedMode}
                    </Tag>
                </div>

            ),
        },
    ], [t]);

    useEffect(() => {
        // handleGetReceipts();
    }, []);

    const getStatusStyle = (status: string) => {
        return status === "Test"
            ? "text-gray-600 bg-gray-200"
            : "text-green-600 bg-green-200";
    };

    const handleGetReceipts = async (filter: string, orgFilterss: Array<string>): Promise<void> => {
        console.log(filter);
        console.log(orgFilterss);
        setLoading(true);
        try {
            const response = await getReceiptList(filter, orgFilterss);
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

    const handleSearch = useCallback(
        debounce(() => {
            console.log("searchTerm", searchConditionRef.current.searchTerm);

            let searchFilter = "";
            let orderBy = `column=${searchConditionRef.current.column}&sort=${searchConditionRef.current.sort}`;

            if (searchConditionRef.current.searchTerm.trim() !== "") {
                searchFilter = `searchTerm=${searchConditionRef.current.searchTerm}`;
            }

            const orgFilterss = organizationRef.current.map((org) => org.id)

            const interfaceId = `interfaceId=${id}`;

            const searchStatus = `statusFilter=${searchConditionRef.current.status || "All"}`;

            const pagination = `page=${searchConditionRef.current.page}&pageSize=${searchConditionRef.current.pageSize}`;


            const filters = [searchFilter, searchStatus, interfaceId, orderBy, pagination]
                .filter(Boolean)
                .join("&");

            const searchStr = filters ? `?${filters}` : "";

            console.log("searchStr", searchStr);

            setFilterSearch(searchStr);
            handleGetReceipts(searchStr, orgFilterss);
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
        if (organization.length > 0) {
            handleSearch();
        }
    }, [organization]);

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

    return (
        <div className="p-4">
            <div className="flex pb-2 mb-1">
                <div className="w-9/12">
                    <h2 className="text-xl font-semibold">{t("receipts.title")}</h2>
                    <p className="text-base">{t("receipts.description")}</p>
                </div>
            </div>
            <div className="flex mb-2">
                <div className="flex space-x-4 items-center mr-2">
                    <div className="relative w-80">
                        <Input
                            onChange={(e: any) => {
                                handleInputChange(e.target.value);
                                searchConditionRef.current.page = 1;
                            }}
                            type="search"
                            placeholder="Search"
                            minWidth="20rem"
                        ></Input>
                    </div>

                </div>
                <IoFilterOutline className="text-gray-500 text-2xl my-auto cursor-pointer" />

            </div>
            <div className="w-full">
                <Table
                    columns={columns}
                    data={receipts.data}
                    pagination={receipts.pagination}
                    loading={loading}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
};




export default InterfaceReceipt;