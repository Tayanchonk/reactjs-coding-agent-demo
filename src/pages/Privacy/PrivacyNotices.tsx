import { useEffect, useMemo, useState } from "react";
import { IoFilterOutline, IoSwapVertical } from "react-icons/io5";
import PreviewModal from "./PrivacyNoticesManagement/PreviewModal";
import {
  InputText,
  Dropdown,
  DropdownOption,
  Table,
  SortingHeader,
  MoreButton,
  Tag,
  Button,
} from "../../components/CustomComponent";
import {
  PrivacyNoticeListRequest,
  PrivacyNoticeListResponse,
  PrivacyNotice,
  PrivacyNoticeStatus,
} from "../../interface/privacy.interface";
import { PricayNoticesColumn, Sort } from "../../enum/privacy.enums";
import {
  getPrivacyNoticeList,
  getPrivacyNoticeStatusList,
} from "../../services/privacyNoticesService";
import { useNavigate } from "react-router-dom";
import { TbFileSearch } from "react-icons/tb";
import { formatDate } from "../../utils/Utils";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const PrivacyNotices = () => {
  const getUserSession: any = sessionStorage.getItem("user");
  let user = { customer_id: "", user_account_id: "" };
  try {
    if (getUserSession) {
      const parsedUser = JSON.parse(getUserSession);
      user = {
        customer_id:
          typeof parsedUser.customer_id === "string"
            ? parsedUser.customer_id
            : "",
        user_account_id:
          typeof parsedUser.user_account_id === "string"
            ? parsedUser.user_account_id
            : "",
      };
    }
  } catch (error) {
    console.error("Failed to parse user session:", error);
  }
  const [privacyNoticeStatusList, setPrivacyNoticeStatusList] = useState<
    PrivacyNoticeStatus[]
  >([]);
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );

  const [privacyNoticeListResponse, setPrivacyNoticeListResponse] =
    useState<PrivacyNoticeListResponse>();
  const [privacyNoticeListRequest, setPrivacyNoticeListRequest] =
    useState<PrivacyNoticeListRequest>({
      customerId: user.customer_id,
      page: 1,
      pageSize: 20,
      sort: Sort.Descending,
      column: PricayNoticesColumn.ModifiedDate,
      searchTerm: "",
    });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewHtmlContent, setPreviewHtmlContent] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getPrivacyNoticeStatusList().then((res) => {
      setPrivacyNoticeStatusList(res);
    });
    getPrivacyNoticeList(privacyNoticeListRequest).then((res) => {
      setPrivacyNoticeListResponse(res);
      setLoading(false);
    });
  }, [privacyNoticeListRequest]);

  const columns = useMemo(
    () => [
      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PricayNoticesColumn.PrivacyNoticeName)}
            title="privacy.privacyNotices.table.privacyNoticesName"
          />
        ),
        accessor: PricayNoticesColumn.PrivacyNoticeName,
        Cell: ({ value }: { value: PrivacyNotice }) => (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              navigate(
                `/privacy/privacy-notices/privacy-notices-management/view/${value.privacyNoticeId}`
              );
            }}
          >
            <p className="text-primary-blue font-medium">
              {value.privacyNoticeName}
            </p>
          </div>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PricayNoticesColumn.PrivacyNoticeStatusName)}
            title="privacy.privacyNotices.table.status"
            center={true}
          />
        ),
        accessor: PricayNoticesColumn.PrivacyNoticeStatusName,
        Cell: ({ value }: { value: string }) => (
          <div className="flex justify-center">
            <Tag
              variant="contained"
              color="#DAF8E6"
              className="w-fit "
              size="sm"
            >
              <p className="text-center text-[#1A8245]">{value}</p>
            </Tag>
          </div>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PricayNoticesColumn.VersionNumber)}
            title="privacy.privacyNotices.table.version"
            center={true}
          />
        ),
        accessor: PricayNoticesColumn.VersionNumber,
        Cell: ({ value }: { value: number }) => (
          <div className="flex justify-center">
            <Tag variant="contained" color="#4361FF1A" size="sm">
              <p className="text-center text-primary-blue">Version {value}</p>
            </Tag>
          </div>
        ),
      },

      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PricayNoticesColumn.PublishedDate)}
            title="privacy.privacyNotices.table.publishedDate"
            center={true}
          />
        ),
        accessor: PricayNoticesColumn.PublishedDate,
        Cell: ({ value }: { value: number }) => (
          <div className="flex justify-center">
            {value}
          </div>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PricayNoticesColumn.ModifiedBy)}
            title="privacy.privacyNotices.table.modifiedBy"
          />
        ),
        accessor: PricayNoticesColumn.ModifiedBy,
      },

      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PricayNoticesColumn.ModifiedDate)}
            title="privacy.privacyNotices.table.modifiedDate"
            center={true}
          />
        ),
        accessor: PricayNoticesColumn.ModifiedDate,
        Cell: ({ value }: { value: number }) => (
          <div className="flex justify-center">
            {value}
          </div>
        ),
      },
      {
        Header: "",
        accessor: "more",
      },
    ],
    [privacyNoticeListResponse]
  );
  const data = useMemo(
    () =>
      privacyNoticeListResponse?.items?.map((item, index) => {
        return {
          privacyNoticeName: {
            privacyNoticeName: item.privacyNotice.privacyNoticeName,
            privacyNoticeId: item.privacyNotice.privacyNoticeId,
          },
          privacyNoticeStatusName: item.privacyNoticeStatusName,
          versionNumber: item.privacyNotice.versionNumber,
          publishedDate: item.privacyNotice.publishedDate
            ? formatDate("datetime", item.privacyNotice.publishedDate)
            : "",
          publishedBy: item.publishedByName,
          modifiedDate: formatDate("datetime", item.privacyNotice.modifiedDate),
          modifiedBy: item.modifiedByName,
          more: (
            <div>
              <MoreButton>
                {permissionPage?.isUpdate && (
                  <Button
                    minWidth="11.875rem"
                    onClick={() => {
                      navigate(
                        `/privacy/privacy-notices/privacy-notices-management/edit/${item.privacyNotice.privacyNoticeId}`
                      );
                    }}
                    className="flex items-center gap-2 bg-white  "
                  >
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    <p>{t("edit")}</p>
                  </Button>
                )}
                <Button
                  className="flex items-center gap-2 bg-white  "
                  onClick={() => handlePreview(index)}
                >
                  <TbFileSearch className="text-lg"></TbFileSearch>
                  <p>{t("privacy.privacyNotices.table.preview")}</p>
                </Button>
              </MoreButton>
            </div>
          ),
        };
      }) || [],
    [privacyNoticeListResponse, t]
  );

  const sorting = (column: PricayNoticesColumn) => {
    // Validate that column is a valid enum value before using it
    const isValidColumn = Object.values(PricayNoticesColumn).includes(column);
    if (!isValidColumn) {
      console.error("Invalid column name:", column);
      return; // Exit if invalid column name is provided
    }

    setPrivacyNoticeListRequest((prev) => ({
      ...prev,
      column: column,
      sort:
        privacyNoticeListRequest.sort === Sort.Descending
          ? Sort.Ascending
          : Sort.Descending,
    }));
  };

  const handlePreview = (index: number) => {
    const selectedPrivacyNotice = privacyNoticeListResponse?.items[index];
    if (!selectedPrivacyNotice) return;
    const privacyNoticeJson = JSON.parse(
      selectedPrivacyNotice.privacyNotice.translationJson || "{}"
    );
    const defaultLanguage = selectedPrivacyNotice.privacyNotice.defaultLanguage;
    const selectedTranslation = privacyNoticeJson.find(
      (item: any) => item.languageId === defaultLanguage
    );
    setPreviewHtmlContent(selectedTranslation?.value || "");

    setShowPreviewModal(true);
  };
  return (
    <>
      <div className="bg-white w-full">
        <div className="mx-3 pt-5 pb-10  px-14">
          <p className="text-xl font-semibold">
            {t("privacy.privacyNotices.privacyNoticesManagement")}
          </p>
          <p className="text-base">{t("privacy.privacyNotices.description")}</p>
          <div className="mt-4 flex items-center gap-2">
            <InputText
              type="search"
              placeholder="Search"
              minWidth="20rem"
              height="2.375rem"
              onChange={(e) => {
                setPrivacyNoticeListRequest((prev) => ({
                  ...prev,
                  searchTerm: e.target.value,
                  page: 1,
                }));
              }}
            ></InputText>
            <Dropdown
              selectedName={selectedStatus ?? "All Status"}
              minWidth="10rem"
              id="dd-status"
            >
              <DropdownOption
                onClick={() => {
                  setSelectedStatus("All Status");
                  setPrivacyNoticeListRequest((prev) => ({
                    ...prev,
                    statusId: null,
                    page: 1,
                  }));
                }}
              >
                <span className="">All Status</span>
              </DropdownOption>
              {privacyNoticeStatusList.map((item) => {
                return (
                  <DropdownOption
                    onClick={() => {
                      setSelectedStatus(item.privacyNoticeStatusName);
                      setPrivacyNoticeListRequest((prev) => ({
                        ...prev,
                        statusId: item.privacyNoticeStatusId,
                        page: 1,
                      }));
                    }}
                    key={item.privacyNoticeStatusId}
                  >
                    <span className="">{item.privacyNoticeStatusName}</span>
                  </DropdownOption>
                );
              })}
            </Dropdown>

            <IoFilterOutline className="size-7 text-dark-gray"></IoFilterOutline>
          </div>
          <div className="w-full">
            <Table
              columns={columns}
              data={data}
              pagination={{
                page: privacyNoticeListResponse?.page,
                total_pages: Math.ceil(
                  (privacyNoticeListResponse?.total ?? 0) / 20
                ),
              }}
              loading={loading}
              handlePageChange={(page) => {
                setPrivacyNoticeListRequest((prev) => ({
                  ...prev,
                  page: page,
                }));
              }}
            />
          </div>
        </div>
      </div>
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        htmlContent={previewHtmlContent}
      ></PreviewModal>
    </>
  );
};

export default PrivacyNotices;
