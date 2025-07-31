import {
    useState,
    useEffect,
} from "react"; import { useTranslation } from "react-i18next";
import Tag from "../../../../../components/CustomComponent/Tag";
import Checkbox from "../../../../../components/CustomComponent/CheckBox";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getTransactionDetail } from "../../../../../services/transactionService";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setMenuHeader } from "../../../../../store/slices/menuHeaderSlice";
import { setMenuBreadcrumb } from "../../../../../store/slices/menuBreadcrumbSlice";
import { Button } from "../../../../../components/CustomComponent";

const TransactionDetailPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [transactionDetail, setTransactionDetail] = useState<Transaction | null>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                await handleGetTransactionDetail(id);
            }
        };
        fetchData();
    }, [id]);

    const handleGetTransactionDetail = async (id: string) => {
        setLoading(true);
        try {
            const data = await getTransactionDetail(id);
            setTransactionDetail(data);
            console.log(data)
        } catch (error) {
            console.error(error);
            navigate("/consent/transaction", { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const datimeformat = JSON.parse(localStorage.getItem("datetime") || "{}");
        return dateString ? dayjs(dateString).format(`${datimeformat.dateFormat} ${datimeformat.timeFormat}`) : "-";
    };

    const getStatusTag = (status: string) => {
        switch (status) {
            case "Withdrawn":
                return <Tag size="sm" minHeight="1.25rem" className="text-red-600 font-medium px-2 py-0.5 rounded-md text-xs bg-red-100 max-w-max">
                    <p className="text-base font-semibold">
                        Withdrawn
                    </p>
                </Tag>;
            case "Confirmed":
                return <Tag size="sm" minHeight="1.25rem" className="text-green-700 font-medium px-2 py-0.5 rounded-md text-xs bg-green-100 max-w-max">
                    <p className="text-base font-semibold">
                        Confirmed
                    </p>
                </Tag>;
            case "Not Given":
                return <Tag size="sm" minHeight="1.25rem" className="text-yellow-500 font-medium px-2 py-0.5 rounded-md text-xs bg-yellow-100 max-w-max">
                    <p className="text-base font-semibold">
                        Not Given
                    </p>
                </Tag>;
            case "Expired":
                return <Tag size="sm" minHeight="1.25rem" className="text-gray-600 font-medium px-2 py-0.5 rounded-md text-xs bg-gray-200 max-w-max">
                    <p className="text-base font-semibold">
                        Expired
                    </p>
                </Tag>;
            default:
                return null;
        }
    };

    const getTestModeTag = (status: string) => {
        switch (status) {
            case "Test":
                return <Tag size="sm" minHeight="1.25rem" className="text-gray-600 font-medium px-2 py-0.5 rounded-md text-xs bg-gray-100 max-w-max">
                    <p className="text-base font-semibold">
                        {status}
                    </p>
                </Tag>;
            case "Production":
                return <Tag size="sm" minHeight="1.25rem" className="text-green-700 font-medium px-2 py-0.5 rounded-md text-xs bg-green-100 max-w-max">
                    <p className="text-base font-semibold">
                        {status}
                    </p>
                </Tag>;
            default:
                return null;
        }
    };
    useEffect(() => {
        dispatch(setMenuHeader("transactions.details.transactionsDetails"));
        dispatch(setMenuBreadcrumb([
            { title: t("path.consent"), url: "/consent" },
            { title: t("path.transaction"), url: "/consent/transaction" },
            { title: t("path.transactionDetails"), url: "" },
        ]));
        return () => {
            dispatch(setMenuHeader(""));
            dispatch(setMenuBreadcrumb([]));
        };
    }, [t]);
    return (
        <div className="p-1 bg-gray-50 min-h-screen flex flex-col space-y-1">
            <div className="flex justify-between items-center">
                <div className="absolute top-[120px] right-6 z-1 flex space-x-2 bg-white">
                    <Button
                        onClick={() => navigate(-1)}
                        color="#DFE4EA"
                        className="mr-2"
                        variant="outlined"
                    >
                        <p className="text-base">{t("close")}</p>
                    </Button>
                </div>
            </div>
            {loading && (
                <LoadingSpinner />
            )}
            {!loading && (
                <div className="flex flex-col md:flex-row gap-4">

                    <div className="w-full md:w-5/12">
                        <div className="bg-white rounded-lg p-6 space-y-6 text-sm text-gray-800">
                            <div className="space-y-1">
                                <div className="text-base font-semibold text-gray-900">{t("transactions.details.transactionsInfo")}</div>
                                <div className="text-base text-gray-500 mb-1">{t("transactions.details.transactionDetails")}</div>
                                <div className="flex gap-2 mt-2">

                                    {getStatusTag(transactionDetail?.transactionStatusName || "")}
                                    {getTestModeTag(transactionDetail?.isTestMode || "")}
                                </div>
                            </div>
                            <div className="text-sm flex flex-wrap items-start gap-x-12 gap-y-3">
                                <div className="flex gap-2 whitespace-nowrap">
                                    <span className="text-base font-semibold">{t("transactions.details.transactionDate")}:</span>
                                    <span className="text-base">{formatDate(transactionDetail?.createdDate || "")}</span>
                                </div>
                                <div className="flex gap-2 whitespace-nowrap">
                                    <span className="text-base font-semibold">{t("transactions.details.expireDate")}:</span>
                                    <span className="text-base">
                                        {transactionDetail?.transactionStatusName != "Withdrawn" ? formatDate(transactionDetail?.expiryDate || "") : "-"}
                                    </span>
                                </div>
                                <div className="flex gap-2 whitespace-nowrap">
                                    <span className="text-base font-semibold">{t("transactions.details.consentDate")}:</span>
                                    <span className="text-base">
                                        {transactionDetail?.transactionStatusName != "Withdrawn" ? formatDate(transactionDetail?.consentDate || "") : "-"}
                                    </span>
                                </div>
                            </div>


                            <div className="-mx-6">
                                <hr className="my-4 border-gray-200 border-dashed" />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-base font-semibold text-gray-800">Transaction ID</div>
                                    <div className="text-base">{id}</div>
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-gray-800">Receipt ID</div>
                                    <a href={`/consent/receipts/details/${transactionDetail?.receiptId}`} className="text-base text-blue-600 font-semibold break-words">{transactionDetail?.receiptId}</a>
                                </div>
                            </div>

                            <div className="-mx-6">
                                <hr className="my-4 border-gray-200 border-dashed" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.receiptDate")}</div>
                                    <div className="text-base">{formatDate(transactionDetail?.receiptDate || "")}</div>
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.profileIdentifier")}</div>
                                    {transactionDetail?.profileId === "00000000-0000-0000-0000-000000000000" ?
                                        <div className="text-base">{transactionDetail?.profileName}</div> :
                                        <a href={"/consent/data-subject/view/" + transactionDetail?.profileId + "/information"} className="text-base text-blue-600 font-semibold">{transactionDetail?.profileName}</a>}
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.interface")}</div>
                                    <a href={`/consent/consent-interface/view/${transactionDetail?.interfaceId}/info`} className="text-base text-blue-600 font-semibold">{transactionDetail?.interfaceName}</a>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.interfaceVersion")}</div>
                                    <Tag size="sm" minHeight="1.25rem" className="text-primary-blue font-medium px-2 py-0.5 rounded-md text-xs bg-blue-100 max-w-max"><p className="text-base font-semibold">{t("transactions.details.version")} {transactionDetail?.interfaceVersion}</p></Tag>
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.interactionType")}</div>
                                    <div className="text-base">{transactionDetail?.interactionTypeName}</div>
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.interactionBy")}</div>
                                    <div className="text-base">{(transactionDetail?.interactionTypeName === "Manual" || transactionDetail?.interactionTypeName === "Import") ? transactionDetail?.interactionBy : "-"}</div>
                                </div>
                            </div>

                            <div className="-mx-6">
                                <hr className="my-4 border-gray-200 border-dashed" />
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.withdrawalDate")}</div>
                                    <div className="text-base">{formatDate(transactionDetail?.withdrawalDate || "")}</div>
                                </div>
                                <div>
                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.reason")}</div>
                                    <div className="text-base">{transactionDetail?.withdrawalReason || "-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-7/12 flex flex-col gap-4">
                        <div className="bg-white rounded-lg">
                            <div className="flex items-start px-6 pt-6 pb-2">
                                <div className="flex flex-col flex-grow min-w-0">
                                    <div className="text-base font-semibold text-gray-900">{t("transactions.details.standardPurpose")}</div>
                                    <a
                                        href={`/consent/purpose/standard-purpose/view-spurpose/${transactionDetail?.standardPurposeId}`}
                                        className="text-primary-blue text-base font-semibold break-all"
                                    >
                                        {transactionDetail?.standardPurposeName}
                                    </a>
                                </div>

                                <div className="ml-4 flex-shrink-0">
                                    <Tag size="sm" minHeight="1.25rem" className="text-primary-blue font-medium px-2 py-0.5 rounded-md text-xs bg-blue-100 max-w-max"> <p className="text-base font-semibold"> {t("transactions.details.version")} {transactionDetail?.standardPurposeVersion ? transactionDetail?.standardPurposeVersion : "-"}</p></Tag>
                                </div>
                            </div>
                            <div className="">
                                <div className="p-4">
                                    {Array.isArray(transactionDetail?.preferencePurposeTransaction) &&
                                        transactionDetail.preferencePurposeTransaction.length > 0 && (
                                            <div className="border border-gray-200 rounded-md overflow-hidden">
                                                <div className="border-b border-gray-200 px-4 py-3">
                                                    <div className="text-base font-semibold text-gray-800">{t("transactions.details.preferencePurposes")}</div>
                                                </div>
                                                {transactionDetail?.preferencePurposeTransaction?.map((item: any, index) => (
                                                    <div key={index} className="px-4 py-4 space-y-3">
                                                        <div>
                                                            {/* 
                                                                <div className="font-semibold text-gray-800 text-sm">{t("transactions.details.preferencePurposes")}</div>
                                                            */}
                                                            <div className="text-gray-800 text-base">{item.preferencePurposeName}</div>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 mt-2">
                                                            <div className="text-gray-800 text-base break-all">{item.preferencePurposeName}</div>
                                                            <div className="bg-white rounded-md border border-gray-200 p-3 space-y-3">
                                                                <div className="flex flex-col space-y-2">
                                                                    {item.prefPurposeSelectionJson.options.map((option: any, i: any) => (
                                                                        <label key={i} className="flex items-start gap-2">
                                                                            <Checkbox checked={option.selected} disabled={false} shape="square" color="#656668" />
                                                                            <span className="text-base text-gray-800 break-all">{option.text}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TransactionDetailPage;