import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaCheckCircle } from "react-icons/fa";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import debounce from 'lodash.debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteDataElement, getDataElements } from '../../../services/dataElement.Service';
import { getOrganizationChart } from "../../../services/organizationService";
import { DataElementData } from "../../../interface/dataElement.interface";
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import { ModalType } from '../../../enum/ModalType';
import { formatDate } from '../../../utils/Utils';
import { useSelector } from "react-redux";
import { RootState } from '../../../store';
import {
  Button,
  InputText,
  Table,
  SortingHeader,
  MoreButton,
} from "../../../components/CustomComponent";
const DataElementPage = () => {
  let { t, i18n } = useTranslation();
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  const [dataElement, setdataElement] = useState<DataElementData>({ data: [], pagination: { page: 1, per_page: 5, total_pages: 1, total_items: 1 } });
  const [loading, setLoading] = useState(false);
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [isOpen, setIsOpen] = useState(false);
  const [idDelete, setIdDelete] = useState('');

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const searchConditionRef = useRef({
    searchTerm: '',
    status: 'all',
    page: 1,
    pageSize: 20,
    sort: '',
    column: '',
  });


  const columns = useMemo(
    () => [
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("DataElementName")}
            title="dataelement.headercolumn.dataelementname"
          />
        ),
        accessor: "dataElementName",

        Cell: ({ row }: { row: any }) => (
          <div
            className="flex items-center"
            onClick={() => {
              navigate(
                `/consent/data-element/view/${row.original.dataElementId}/info`
              );
            }}
          >
            <div className="relative group justify-start">
              <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.dataElementName}</p>
              <div
                className="absolute bottom-full text-wrap left-0 translate-y-[-6px] z-50 hidden group-hover:inline-block 
                bg-gray-800 text-white text-xs rounded py-1 px-2 max-w-96 shadow-lg break-words"
              >
                {row.original.dataElementName}
              </div>
            </div>
          </div>
        ),
      },

      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("DataElementTypeName")}
            title="dataelement.headercolumn.dataelementtype"
            center={true}
          />
        ),
        accessor: 'dataElementTypeName',
        Cell: ({ value }: { value: string }) => (
          <p className="flex justify-center">
            {value}
          </p>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("IsIdentifier")}
            title="dataelement.headercolumn.identifier"
            center={true}
          />
        ),
        accessor: 'isIdentifier',
        // header center
        align: 'center',
        Cell: ({ value }: { value: string }) => (
          <p className="flex justify-center">
            {value ? <FaCheckCircle style={{ "color": "#3758F9", fontSize: 20 }} /> : null}
          </p>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("InterfaceDataElementCount")}
            title="dataelement.headercolumn.interface"
            center={true}
          />
        ),
        accessor: 'interfaceDataElementCount',
        Cell: ({ value }: { value: number }) => (
          <p className="flex justify-center">{value}</p>
        ),
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("OrganizationName")}
            title="dataelement.headercolumn.organization"
          />
        ),
        accessor: 'organizationName',
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("ModifiedBy")}
            title="dataelement.headercolumn.modifiedby"
          />
        ),
        accessor: 'modifiedBy',
      },
      {
        Header: (
          <SortingHeader
            onClick={() => handleSort("ModifiedDate")}
            title="dataelement.headercolumn.modifieddate"
            center={true}
          />
        ),
        align: 'center',
        accessor: 'modifiedDate',
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {
              // dayjs(value).format('DD/MM/YY HH:mm')
              formatDate('datetime', value)
            }
          </div>

        ),
      },
      {
        Header: '',
        accessor: 'actions',
        Cell: ({ row }: { row: any }) => {


          return (
            ((permissionPage?.isUpdate && permissionPage?.isDelete) && row.original.interfaceDataElementCount == 0) && (
              // icon menu
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="cursor-pointer">
                  <BsThreeDotsVertical />
                </MenuButton>

                <MenuItems className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">

                  {permissionPage?.isUpdate ? <MenuItem>

                    <button
                      className="bg-gray-100 w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                      onClick={() => {
                        navigate(`/consent/data-element/edit/${row.original.dataElementId}/info`);
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      <span style={{ marginTop: "5px", color: "#000" }}>{t('edit')}</span>

                    </button>



                  </MenuItem> : null}

                  {permissionPage?.isDelete ? <MenuItem>
                    <button
                      className="bg-gray-100 w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                      onClick={() => {
                        setIdDelete(row.original.dataElementId);
                        setConfirmType(ModalType.Delete);
                        setIsOpen(true);
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      <span style={{ marginTop: "5px", color: "#000" }}>{t('delete')}</span>
                    </button>
                  </MenuItem> : null}
                </MenuItems>

              </Menu>
            )
          );
        }
      },
    ],
    [t, orgparent]
  );

  const handleConfirm = async () => {
    await handleDelete(idDelete);
    setIsOpen(false);
  }

  const onClose = () => {
    setIsOpen(false);
  }


  const handleDelete = async (id: string) => {
    try {
      const response = await deleteDataElement(id);
      let limit = 20;
      handleGetDataElement(limit);
    } catch (error) {
      console.error('errordelete', error);
    }
  }

  const handleGetDataElement = async (limit: number) => {
    try {
      if (orgparent !== "") {
        setLoading(true);
        const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
        var res = await getOrganizationChart(customerId, orgparent);
        var org = res.data.data;
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
        const response: any = await getDataElements(limit, { OrganizationIds: orgList }, searchConditionRef.current);
        setdataElement(response);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('error', error);
    }
  }

  React.useEffect(() => {
    handleGetDataElement(20);
  }, [orgparent]);


  const handlePageChange = (page: number) => {
    console.log('page', page);
    let limit = 20;
    let searchTerm = '';
    let pageSize = 5;
    searchConditionRef.current.page = page;
    handleGetDataElement(limit);
  }

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      console.log('searchTerm', searchTerm);
      let limit = 20;
      searchConditionRef.current.searchTerm = searchTerm;


      handleGetDataElement(limit);
    }, 300), // 300ms delay
    []
  );

  const handleSort = (column: string) => {
    searchConditionRef.current.sort = searchConditionRef.current.sort === 'ASC' ? 'DESC' : 'ASC';
    searchConditionRef.current.column = column;
    let limit = 20;
    handleGetDataElement(limit);
  }

  React.useEffect(() => {
    let limit = 20;
    handleGetDataElement(limit);
  }, []);


  return (

    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="px-12">
        <p className="text-xl font-semibold">
          {t('dataelement.title')}
        </p>
        <p className="">
          {t('dataelement.description')}
        </p>
        <div className="flex justify-between w-100 mt-4">
          <div className="flex gap-2 items-center">
            <InputText
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
              placeholder="Search"
              minWidth="20rem"
            ></InputText>
            <IoFilterOutline className="text-[1.75rem] text-dark-gray"></IoFilterOutline>
          </div>
          <div className="w-9/12 flex justify-end">
            {permissionPage?.isCreate && (<Button
              className="flex items-center gap-2 bg-primary-blue text-white"
              onClick={() => {
                navigate(`/consent/data-element/create/info`);
              }}
            >
              <IoAdd className="text-lg"></IoAdd>
              <span className="text-white text-sm font-semibold">
                {t("dataelement.form.create")}
              </span>
            </Button>)}
          </div>
        </div>


        <div className="border-b border-lilac-gray mt-4"></div>
        <div className="w-full">
          <Table
            columns={columns} data={dataElement.data || []}
            pagination={dataElement.pagination}
            handlePageChange={handlePageChange}
            loading={loading}
            pageSize={searchConditionRef.current.pageSize}
          />
        </div>

        <ConfirmModal modalType={confirmType} isOpen={isOpen} onClose={onClose} title={'Confrim Delete'} detail={'Are you sure you want to delete?'} onConfirm={handleConfirm} />
      </div>
    </div>
  );
};
export default DataElementPage;
