import { useOutletContext } from "react-router-dom";
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { IoFilterOutline } from "react-icons/io5";
import debounce from 'lodash.debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getInterfaces } from '../../../../services/dataElement.Service';
import { formatDate } from '../../../../utils/Utils';
import {
  InputText,
  SortingHeader,
  Table,
  Dropdown,
  DropdownOption
} from "../../../../components/CustomComponent";

const DataElementInterface = () => {
  let { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useOutletContext<{ mode: string; id?: string }>();
  const { mode, id } = context || { mode: "create" };
  const [interfaces, setInterfaces] = useState({ data: [], pagination: { page: 1, per_page: 5, total_pages: 1, total_items: 1 } });
  const [loading, setLoading] = useState(false);

  const searchConditionRef = useRef({
    searchTerm: '',
    statusFilter: 'Published',
    page: 1,
    pageSize: 20,
    sort: '',
    column: '',
  });

  const handleGetInterface = async (limit: number) => {
    try {

      setLoading(true);
      const response: any = await getInterfaces(id, limit, searchConditionRef.current);
      setInterfaces(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('error', error);
    }
  }

  const handlePageChange = (page: number) => {
    console.log('page', page);
    let limit = 20;
    let searchTerm = '';
    let pageSize = 5;
    searchConditionRef.current.page = page;
    handleGetInterface(limit);
  }


  const handleSort = (column: string) => {
    searchConditionRef.current.sort = searchConditionRef.current.sort === 'ASC' ? 'DESC' : 'ASC';
    searchConditionRef.current.column = column;
    let limit = 20;
    handleGetInterface(limit);
  }

  React.useEffect(() => {
    let limit = 20;
    handleGetInterface(limit);
  }, []);

  const columns = useMemo(
    () => [
      {

        Header: (
          <SortingHeader
            onClick={() => handleSort("InterfaceName")}
            title="dataelement.headercolumn.interfacename"
          />
        ),
        accessor: "interfaceName",
        Cell: ({ row }: { row: any }) => (
          <div className="flex items-center" onClick={() => {
            navigate(`/consent/consent-interface/${mode}/${row.original.interfaceId}/info`);
          }}>
            <div className="relative group ml-2 justify-start">
              <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.interfaceName}</p>
              <div className="absolute text-left bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                {row.original.interfaceName}
              </div>
            </div>
          </div>
        ),
      },

      {

        Header: (
          <SortingHeader
            onClick={() => handleSort("InterfaceStatusName")}
            title="dataelement.headercolumn.interfacestatus"
            center={true}
          />
        ),
        accessor: 'status',
        Cell: ({ value }: { value: string }) => (
          <span className={`flex justify-center px-2 py-1 rounded-md 
            ${value === 'Published' ? 'bg-green-100 text-green-700' :
              value === 'Retired' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'}`}>
            {value}
          </span>
        ),
      },
      {

        Header: (
          <SortingHeader
            onClick={() => handleSort("Version")}
            title="dataelement.headercolumn.interfaceversion"
            center={true}
          />
        ),
        align: 'center',
        accessor: 'version',
        Cell: ({ value }: { value: number }) => <span className="flex justify-center border text-blue-600 px-3 py-1 rounded-md text-sm font-semibold bg-blue-100">{value}</span>,
      },
      {

        Header: (
          <SortingHeader
            onClick={() => handleSort("PublishedBy")}
            title="dataelement.headercolumn.interfacepublishedby"
          />
        ),
        accessor: 'publishedBy',
      },
      {

        Header: (
          <SortingHeader
            onClick={() => handleSort("PublishedDate")}
            title="dataelement.headercolumn.interfacepublisheddate"
            center={true}
          />
        ),
        align: 'center',
        accessor: 'publishedDate',
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {
              // dayjs(value).format('DD/MM/YY HH:mm')
              value ? formatDate('datetime', value) : null
            }
          </div>

        ),
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
      }
    ],
    [t]
  );

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      let limit = 20;
      searchConditionRef.current.searchTerm = searchTerm;


      handleGetInterface(limit);
    }, 300), // 300ms delay
    []
  );


  return (
    <div className="px-12">
      <div className="flex mt-4">
        <div className="flex gap-2 items-center">
          <InputText
            onChange={(e) => handleSearch(e.target.value)}
            type="search"
            placeholder="Search"
            minWidth="10rem"
          ></InputText>
          <IoFilterOutline className="text-[1.75rem] text-dark-gray"></IoFilterOutline>
        </div>
        <div className="w-2/12 my-auto mx-1 ml-10">
          <Dropdown
            id="dataelementtypes"
            className="w-full"
            selectedName={searchConditionRef.current.statusFilter}
            selectedLabel={
              searchConditionRef.current.statusFilter
            }
          >
            {[
              { value: 'all', label: t('dataelement.form.allstatus') },
              { value: 'Published', label: t('dataelement.form.published') },
              { value: 'Draft', label: t('dataelement.form.draft') },
              { value: 'Retired', label: t('dataelement.form.retired') }
            ].map((status) => (
              <DropdownOption
                className="h-[2.625rem]"
                key={status.value}
                onClick={() => {
                  searchConditionRef.current.statusFilter = status.value;
                  let limit = 20;
                  handleGetInterface(limit);
                }}
              >
                {status.label}
              </DropdownOption>
            ))}
          </Dropdown>
        </div>

      </div>


      <div className="border-b border-lilac-gray mt-4"></div>
      <div className="w-full">
        <Table columns={columns} data={interfaces.data || []} pagination={interfaces.pagination}
          handlePageChange={handlePageChange}
          loading={loading}
          pageSize={searchConditionRef.current.pageSize}
        />
      </div>

    </div>

  );
};

export default DataElementInterface;
