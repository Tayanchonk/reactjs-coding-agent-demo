import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMenuBreadcrumb } from "../../../store/slices/menuBreadcrumbSlice";
import { setMenuHeader } from "../../../store/slices/menuHeaderSlice";
import { setMenuDescription } from '../../../store/slices/menuDescriptionSlice';
import { useLocation } from 'react-router-dom'

import { useTranslation } from "react-i18next";
import { RootState } from '../../../store';
import { debounce } from 'lodash';
import { getOrganizationChart } from "../../../services/organizationService";
import dayjs from 'dayjs';
import { Table, SortingHeader, Button } from "../../../components/CustomComponent";
import DropdownOption from "../../../components/CustomComponent/Dropdown/DropdownOption";
import Tag from "../../../components/CustomComponent/Tag";
import Dropdown from "../../../components/CustomComponent/Dropdown";
import Input from "../../../components/CustomComponent/InputText";
import { IoAdd, IoFilterOutline } from "react-icons/io5";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

import ConfirmModal from "../../../components/Modals/ConfirmModal";
import { useConfirm, ModalType } from "../../../context/ConfirmContext";
import { deleteClientCredential, getClientCredentialList } from '../../../services/clientCredential';
import { fa, th, tr } from '@faker-js/faker/.';
import notification from '../../../utils/notification';

const ClientCredentialListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const orgparent = useSelector((state: RootState) => state.orgparent);
  const [loading, setLoading] = useState(true);

  const dateTimeStr = localStorage.getItem("datetime") || undefined;

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStatusName, setSelectedStatusName] = useState("All Status");
  const [selectedReceivedMode, setSelectedReceivedMode] = useState("");
  const [selectedReceivedModeName, setSelectedReceivedModeName] = useState("All Received Mode");

  const [organization, setOrganization] = useState<any[]>([]);
  const organizationRef = useRef<any[]>([]);


  type MenuItemType = {
    id: string;
    label: string;
    value: string;
  };

  type clientCredential = {
    clientCredentialId: string;
    name: string;
    clientId: string;
    createdDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
  };

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const getUserSession: any = sessionStorage.getItem("user");
  //const userAccountId = JSON.parse(getUserSession);
  const userAccountId = getUserSession
    ? JSON.parse(getUserSession).user_account_id
    : "";
  const customerId = getUserSession
    ? JSON.parse(getUserSession).customer_id
    : "";

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
  const dispatch = useDispatch();

  const [selectedOrganization, setSelectedOrganization] = useState<MenuItemType>({
    id: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
    label: "",
    value: "ab780f1f-bf67-4cee-8695-ed3efdd8a268",
  });

  const searchConditionRef = useRef({
    searchTerm: "",
    page: 1,
    pageSize: 20,
    sort: "desc",
    column: "modifiedDate",
    totalPage: 0,
    customerId: customerId,
  });

  const canShowCreateButton = !loading && permissionPage?.isCreate;

  const [clientCredential, setClientCredential] = useState<{
    data: clientCredential[];
    pagination: { page: number; total_pages: number };
  }>({
    data: [],
    pagination: { page: 1, total_pages: 1 },
  });

  const handleSearch = useCallback(
    debounce(async () => {
      const orgIds = organizationRef.current.map((org) => org.id);

      const requestBody = {
        searchTerm: searchConditionRef.current.searchTerm.trim(),
        sort: searchConditionRef.current.sort,
        column: searchConditionRef.current.column,
        page: searchConditionRef.current.page,
        pageSize: searchConditionRef.current.pageSize,
        organizationIds: [...orgIds, "00000000-0000-0000-0000-000000000000"],
        customerId: searchConditionRef.current.customerId,
      };

      console.log("RequestBody", requestBody);
      await handleGetClientCredential(requestBody);
    }, 300),
    [organization]
  );

  useEffect(() => {
    dispatch(setMenuDescription(t("clientCredential.description")));
    return () => {
      dispatch(setMenuDescription(""));
    };
  }, [t]);

  const handleGetClientCredential = async (requestBody: any): Promise<void> => {
    setLoading(true);
    try {
      console.log("Fetching client credentials with request body:", requestBody);

      const response = await getClientCredentialList(requestBody);
      console.log("ClientCredential List", response);
      setClientCredential({
        data: response.data,
        pagination: {
          page: response.pagination.page,
          total_pages: response.pagination.totalPages,
        },
      });

      console.log('clientCredential', clientCredential);

      searchConditionRef.current.totalPage = response.pagination.total_pages;
      searchConditionRef.current.page = response.pagination.page;
    } catch (error) {
      console.error("Error fetching client credentials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClientCredential = async (id: any) => {
    try {

      const response = await deleteClientCredential(id, userAccountId);
      console.log("ClientCredential By Id", response);
      handleSearch();

    } catch (error) {
      console.error("Error fetching client credentials:", error);
      throw new Error("error");
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

    organizationRef.current = orgLists;
    setOrganization(orgLists);
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

  const columns = useMemo(() => [
    {
      Header: <SortingHeader onClick={() => handleSort("clientCredentialName")} title="clientCredentials.headers.name" />,
      accessor: "clientCredentialName",
      Cell: ({ row }: any) => (
        <span
          className="text-base font-semibold text-primary-blue cursor-pointer"
          onClick={() => navigate("/setting/client-credentials/info/view/" + row.original.clientCredentialId)}
        >
          <div className="relative group justify-start">
            <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.clientCredentialName}</p>
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
              {row.original.clientCredentialName}
            </div>
          </div>
        </span>
      ),
    },
    {
      Header: <SortingHeader onClick={() => handleSort("clientId")} title="clientCredentials.headers.clientId" />,
      accessor: "clientId",
      Cell: ({ row }: any) => <span className="text-base">{row.original.clientId}</span>,
    },
    {
      Header: <SortingHeader onClick={() => handleSort("createdDate")} center={true} title="clientCredentials.headers.createdDate" />,
      accessor: "createdDate",
      Cell: ({ row }: any) =>
        <span className="text-base flex justify-center items-center w-full">
          {formatDate(row.original.createdDate)}
        </span>
    },
    {
      Header: <SortingHeader onClick={() => handleSort("createdByName")} title="clientCredentials.headers.createdBy" />,
      accessor: "createdByName",
      Cell: ({ row }: any) => <span className="text-base">{row.original.createdByName}</span>,
    },
    {
      Header: <SortingHeader onClick={() => handleSort("modifiedDate")} center={true} title="clientCredentials.headers.modifiedDate" />,
      accessor: "modifiedDate",
      Cell: ({ row }: any) =>
        <span className="text-base flex justify-center items-center w-full">
          {formatDate(row.original.modifiedDate)}
        </span>,
    },
    {
      Header: <SortingHeader onClick={() => handleSort("modifiedByName")} title="clientCredentials.headers.modifiedBy" />,
      accessor: "modifiedByName",
      Cell: ({ row }: any) => <span className="text-base">{row.original.modifiedByName}</span>,
    },
    {
      Header: "",
      accessor: "actions",
      Cell: ({ row }: { row: any }) => {
        
        if (!permissionPage) return [];

        const hasUpdatePermission = permissionPage?.isUpdate ?? false;
        const hasDeletePermission = permissionPage?.isDelete ?? false;
        
        if (!(hasUpdatePermission || hasDeletePermission))
          return null;

        if (!(hasUpdatePermission))
          return null;

        return (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="cursor-pointer">
              <BsThreeDotsVertical />
            </MenuButton>
            <MenuItems className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              {hasUpdatePermission && (
                <MenuItem>
                  <button
                    className=" w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700"
                    onClick={() =>
                      navigate(
                        "/setting/client-credentials/info/edit/" + row.original.clientCredentialId
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
                      {t("clientCredentials.edit")}
                    </span>
                  </button>
                </MenuItem>
              )}
              {hasDeletePermission && (

                <MenuItem>
                  <button
                    className=" w-full flex items-center gap-2 px-4 py-2 text-base text-gray-700"
                    onClick={() => {
                      confirm({
                        modalType: ModalType.Delete,
                        notify: false,
                        onConfirm: async () => {
                          try {
                            await handleDeleteClientCredential(row.original.clientCredentialId);
                            notification.success(t("modal.successConfirmSave"));
                          } catch (error) {
                            notification.error(t("modal.errorConfirmSave"));
                          }
                        },
                      });
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
                      {t("clientCredentials.delete")}
                    </span>
                  </button>
                </MenuItem>
              )}
            </MenuItems>
          </Menu>
        );
      },
    },

  ], [permissionPage]);

  useEffect(() => {

    dispatch(setMenuHeader("clientCredentials.title"));
    dispatch(setMenuDescription("clientCredentials.description"));
    dispatch(setMenuBreadcrumb([
      { title: "clientCredentials.settings", url: "/setting" },
      { title: "clientCredentials.title", url: "/setting/clientCredential" },
    ]));
    return () => {
      dispatch(setMenuHeader(""));
      dispatch(setMenuDescription(""));
      dispatch(setMenuBreadcrumb([]));
    };

  }, [t]);

  return (
    <div className="pt-5 px-10 bg-white">
      <div className="flex mb-4 items-center gap-4">
        <div className="relative w-80">
          <Input
            onChange={(e: any) => {
              searchConditionRef.current.page = 1;
              searchConditionRef.current.searchTerm = e.target.value;
              handleSearch();
            }}
            type="search"
            placeholder={t("clientCredentials.searchPlaceholder")}
            minWidth="20rem"
          />
        </div>

        <IoFilterOutline className="text-gray-500 text-2xl cursor-pointer" />
        {!loading && permissionPage?.isCreate && (
          <div className="ml-auto">
            <Button
              className="flex items-center gap-2 bg-primary-blue text-white"
              onClick={() =>
                navigate(`/setting/client-credentials/info/create/0`)
              }
            >
              <IoAdd className="text-lg"></IoAdd>
              <span className="text-white text-base font-semibold">
                {t("clientCredentials.create")}
              </span>
            </Button>
          </div>
        )}
      </div>
        <Table columns={columns} data={clientCredential.data} pagination={clientCredential.pagination} loading={loading} handlePageChange={handlePageChange} />

    </div>
  );
};


export default ClientCredentialListPage;
