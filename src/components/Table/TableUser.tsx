import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';

interface GlobalTableProps {
  columns: any;
  data?: any;
  pagination: any;
  handlePageChange: (page: number) => void;
  loading: boolean;
  pageSize?: number;
}

const TableUser: React.FC<GlobalTableProps> = ({ columns, data, pagination, handlePageChange, loading, pageSize }) => {


  console.log("data", data);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex: currentPage },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: pageSize }, // Set the initial page size here
    },
    usePagination
  );


  const pageNumbers = Array.from({ length: pagination?.total_pages }, (_, i) => i);


  return (
    <div className="w-full overflow-x-auto" style={{ overflowX: "auto", width: "100%" }}>

      <div className="w-full overflow-x-auto" style={{ overflowX: "auto", width: "100%" }}>
        <table {...getTableProps()} className="w-full mt-5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead className="bg-[#f9fafb]">
            {headerGroups.map((headerGroup: any) => {
              const { key: headerKey, ...headerProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={headerKey} {...headerProps} className="text-sm text-left">
                  {headerGroup.headers.map((column: any) => {
                    const { key: columnKey, ...columnProps } = column.getHeaderProps();
                    return (
                      <th key={columnKey} {...columnProps} className="py-2 whitespace-nowrap px-4 border-b border-[#e5e7eb]">
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
       
          <tbody {...getTableBodyProps()} className="text-sm font-light">
        
            {page.map((row: any) => {
              prepareRow(row);
              const { key: rowKey, ...rowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...rowProps}>
                  {row.cells.map((cell: any) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td key={cellKey} {...cellProps} className="py-3 whitespace-nowrap px-4 border-b border-[#e5e7eb]">
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
              <div className="flex justify-center items-center h-64 ">
                <div className="loader">Loading...</div>
              </div>
            )}
        <div className="pagination flex items-center justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(pagination?.page - 1)}
            disabled={pagination?.page <= 1}
            className="px-2 py-1 border rounded disabled:opacity-50 text-sm"
          >
            {'<'}
          </button>
          {pageNumbers?.map((page: number) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-2 py-1 border rounded text-sm ${pagination?.page === page + 1 ? 'bg-blue-500 text-white' : ''}`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(pagination?.page + 1)}
            disabled={pagination?.page == pagination?.total_pages}
            className="px-2 py-1 border rounded disabled:opacity-50 text-sm"
          >
            {'>'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default TableUser;
