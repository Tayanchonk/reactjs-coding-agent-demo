import React, { useMemo, useState, useEffect } from "react";
import {
  Button,
  InputText,
  Table,
  SortingHeader,
  MoreButton,
} from "../../../../components/CustomComponent";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { getOrganizationChart } from "../../../../services/organizationService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { getPreferencePurposeList } from "../../../../services/preferencePurposeService";
import {
  PreferencePurposeListRequest,
  PreferencePurposeList,
} from "../../../../interface/purpose.interface";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../utils/Utils";
import { setManagePreferencePurposeSlice } from "../../../../store/slices/preferencePurposeSlice";
import { useTranslation } from "react-i18next";
import { PreferencePurposeColumn, Sort } from "../../../../enum/purpose.enums";

function PreferencePurpose() {
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const { t, i18n } = useTranslation();

  // Safely parse user data from sessionStorage with validation
  const getUserSession: any = sessionStorage.getItem("user");
  let user = { customer_id: "" };
  try {
    const parsedUser = JSON.parse(getUserSession);
    // Validate customer_id is a string or number
    if (
      parsedUser &&
      (typeof parsedUser.customer_id === "string" ||
        typeof parsedUser.customer_id === "number")
    ) {
      user = parsedUser;
    } else {
      console.error("Invalid user data in session storage");
      // Could redirect to login or show error
    }
  } catch (error) {
    console.error("Error parsing user data from session storage:", error);
    // Could redirect to login or show error
  }

  const dispatch = useDispatch();

  const [preferencePurposeList, setPreferencePurposeList] =
    useState<PreferencePurposeList>();
  const [preferecePurposeListRequest, setPreferencePurposeListRequest] =
    useState<PreferencePurposeListRequest>({
      organizationIds: [],
      customerId: String(user.customer_id), // Ensure customer_id is a string
      page: 1,
      pageSize: 20,
      sort: Sort.Descending,
      column: PreferencePurposeColumn.ModifiedDate,
      searchTerm: "",
    });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOrganizationChart(user.customer_id, orgparent).then((res) => {
      getOrganizationId(res.data.data);
    });
  }, [orgparent]);

  useEffect(() => {
    if (preferecePurposeListRequest.organizationIds.length > 0) {
      setLoading(true);
      getPreferencePurposeList(preferecePurposeListRequest).then((res) => {
        setPreferencePurposeList(res.data);
        setLoading(false);
      });
    }
  }, [preferecePurposeListRequest]);
  const getOrganizationId = (org: any) => {
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
    setPreferencePurposeListRequest((prev) => ({
      ...prev,
      organizationIds: orgList,
      page: 1,
    }));
  };
  const columns = useMemo(
    () => [
      {
        Header: (
          <SortingHeader
            onClick={() =>
              sorting(PreferencePurposeColumn.PreferencePurposeName)
            }
            title="consent.preferencePurpose.preferencePurposeName"
          // Cell: ({ value }: { value: string }) => <p>{value}</p>,
          />
        ),
        accessor: "preferencePurposeName",
        Cell: ({ value }: { value: any }) => (
          <div
            className="flex items-center"
            onClick={() => {
              dispatch(
                setManagePreferencePurposeSlice({
                  id: value.id,
                })
              );
              navigate(
                `/consent/purpose/preference-purpose/view-preference-purpose`
              );
            }}
          >
            <div className="relative group justify-start">
              <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value.name}</p>
              <div
                className="absolute bottom-full text-wrap left-0 translate-y-[-6px] z-50 hidden group-hover:inline-block 
                bg-gray-800 text-white text-xs rounded py-1 px-2 max-w-96 shadow-lg break-words"
              >
                {value.name}
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PreferencePurposeColumn.OrganizationName)}
            title="consent.preferencePurpose.organization"
          />
        ),
        accessor: "organizationName",
      },
      {
        Header: (
          <SortingHeader
            onClick={() =>
              sorting(PreferencePurposeColumn.StandardPreferenceCount)
            }
            title="consent.preferencePurpose.standardPreferenceCount"
            center={true}
          />
        ),
        accessor: "standardPreferenceCount",
        Cell: ({ value }: { value: number }) => (
          <p className="text-center">{value}</p>
        ),
      },

      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PreferencePurposeColumn.CreatedBy)}
            title="createdBy"
          />
        ),
        accessor: "createdBy",
      },
      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PreferencePurposeColumn.CreatedDate)}
            title="createdDate"
            center={true}
          />
        ),
        accessor: "createdDate",
        Cell: ({ value }) => (
          <span className="flex items-center justify-center"> {value}</span>
        ),
      },

      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PreferencePurposeColumn.ModifiedBy)}
            title="modifiedBy"
          />
        ),
        accessor: "modifiedBy",
      },
      {
        Header: (
          <SortingHeader
            onClick={() => sorting(PreferencePurposeColumn.ModifiedDate)}
            title="modifiedDate"
            center={true}
          />
        ),
        accessor: "modifiedDate",
        Cell: ({ value }) => (
          <span className="flex items-center justify-center"> {value}</span>
        ),
      },
      {
        Header: "",
        accessor: "edit",
      },
    ],
    [preferecePurposeListRequest]
  );

  const sorting = (column: PreferencePurposeColumn) => {
    const sort =
      preferecePurposeListRequest.sort === Sort.Ascending
        ? Sort.Descending
        : Sort.Ascending;
    setPreferencePurposeListRequest((prev) => ({
      ...prev,
      sort: sort,
      column: column,
    }));
  };
  const data = useMemo(
    () =>
      preferencePurposeList?.items?.map((item) => {
        return {
          preferencePurposeName: {
            name: item.csPreferencePurpose.preferencePurposeName,
            id: item.csPreferencePurpose.preferencePurposeId,
          },
          organizationName: item.organizationName,
          standardPreferenceCount: item.standardPreferenceCount,
          createdDate: formatDate(
            "datetime",
            item.csPreferencePurpose.createdDate
          ),
          createdBy: item.createdByFirstName + " " + item.createdByLastName,
          modifiedDate: formatDate(
            "datetime",
            item.csPreferencePurpose.modifiedDate
          ),
          modifiedBy: item.modifiedByFirstName + " " + item.modifiedByLastName,
          edit: (
            <div>
              {permissionPage?.isUpdate && (
                <MoreButton>
                  <Button
                    minWidth="11.875rem"
                    size="sm"
                    className="flex items-center gap-2 bg-white"
                    onClick={() => {
                      dispatch(
                        setManagePreferencePurposeSlice({
                          id: item.csPreferencePurpose.preferencePurposeId,
                        })
                      );
                      navigate(
                        `/consent/purpose/preference-purpose/edit-preference-purpose`
                      );
                    }}
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
                    <span>{t("edit")}</span>
                  </Button>
                </MoreButton>
              )}
            </div>
          ),
        };
      }) || [],
    [preferencePurposeList, t]
  );

  return (
    <>
      <p className="text-xl font-semibold">
        {t("consent.preferencePurpose.preferencePurpose")}
      </p>
      <p className="">{t("consent.preferencePurpose.description")}</p>
      <div className="flex justify-between w-100 mt-4">
        <div className="flex gap-2 items-center">
          <InputText
            onChange={(e) => {
              setPreferencePurposeListRequest((prev) => ({
                ...prev,
                searchTerm: e.target.value,
                page: 1,
              }));
            }}
            type="search"
            placeholder="Search"
            minWidth="20rem"
            height="2.375rem"
          ></InputText>
          <IoFilterOutline className="text-[1.75rem] text-dark-gray"></IoFilterOutline>
        </div>
        {permissionPage?.isCreate && (
          <div>
            <Button
              className="flex items-center gap-2 bg-primary-blue text-white font-semibold"
              onClick={() => {
                dispatch(
                  setManagePreferencePurposeSlice({
                    mode: "create",
                    preferencePurpose: null,
                  })
                );
                navigate(
                  "/consent/purpose/preference-purpose/create-preference-purpose"
                );
              }}
            >
              <IoAdd className="text-lg"></IoAdd>
              <span className="text-white font-semibold">
                {t("consent.preferencePurpose.createNew")}
              </span>
            </Button>
          </div>
        )}
      </div>
      <div className="border-b border-lilac-gray mt-4"></div>
      <div className="w-full">
        <Table
          columns={columns}
          data={data}
          pagination={{
            page: preferencePurposeList?.page,
            total_pages: Math.ceil((preferencePurposeList?.total ?? 0) / 20),
          }}
          loading={loading}
          handlePageChange={(page) => {
            setPreferencePurposeListRequest((prev) => ({
              ...prev,
              page: page,
            }));
          }}
        />
      </div>
    </>
  );
}

export default PreferencePurpose;
