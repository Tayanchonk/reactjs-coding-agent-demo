import React from "react";
import { useTable, usePagination } from "react-table";
import NoDataImage from "./../../assets/images/NoDataFound.png";
import LoadingSpinner from "../LoadingSpinner"

interface GlobalTableProps {
  columns: any;
  data?: any;
  pagination: any;
  handlePageChange: (page: number) => void;
  loading: boolean;
  pageSize?: number;
}

const PurposeTable: React.FC<GlobalTableProps> = ({
  columns,
  data = [],
  pagination,
  handlePageChange,
  loading,
  pageSize,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex: currentPage },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: pageSize } as any,
    },
    usePagination
  ) as any;

  const pageNumbers = Array.from(
    { length: pagination?.total_pages },
    (_, i) => i
  );

  return (
    <div className="w-full overflow-x-auto pb-10" style={{ overflowX: "auto", width: "100%" }}>
      <table {...getTableProps()} className="w-full mt-5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead className="bg-[#f9fafb]">
          {headerGroups.map((headerGroup: any) => {
            const { key: trKey, ...trProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={trKey} {...trProps} className="text-sm">
                {headerGroup.headers.map((column: any, columnIndex: number) => {
                  const { key: thKey, ...thProps } = column.getHeaderProps();
                  return (
                    <th
                      key={thKey}
                      {...thProps}
                      className={`py-2 whitespace-nowrap px-4 border-b border-[#e5e7eb] ${
                        columnIndex === 0 ? "text-left" : "text-center pr-1"
                      }`}
                    >
                      <div className={`w-full flex items-center ${columnIndex === 0 ? "justify-start" : "justify-center"}`}>
                        {column.render("Header")}
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        <tbody {...getTableBodyProps()} className="text-sm font-light">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10">
                <div className="flex justify-center items-center h-32">
                  <div className="loader">
                      <LoadingSpinner /> 
                  </div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <img src={NoDataImage} alt="No Data Found" className="w-48 h-auto" />
                </div>
              </td>
            </tr>
          ) : (
            page.map((row: any) => {
              prepareRow(row);
              const { key: rowKey, ...rowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...rowProps}>
                  {row.cells.map((cell: any, cellIndex: number) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td key={cellKey} {...cellProps} className={`py-3 whitespace-nowrap px-4 border-b border-[#e5e7eb] ${
                        cellIndex === 0 ||  cellIndex === 3 ||  cellIndex === 6 ? "text-left" : "text-center"
                      }`}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {!loading && data.length > 0 && (
        <div className="pagination flex items-center justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(pagination?.page - 1)}
            disabled={pagination?.page <= 1}
            className="px-2 py-1 border rounded disabled:opacity-50 text-sm"
          >
            {"<"}
          </button>
          {pageNumbers?.map((page: number) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-2 py-1 border rounded text-sm ${
                pagination?.page === page + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(pagination?.page + 1)}
            disabled={pagination?.page == pagination?.total_pages}
            className="px-2 py-1 border rounded disabled:opacity-50 text-sm"
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PurposeTable;
