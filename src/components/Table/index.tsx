import React, { useEffect, useState } from "react";
import { useTable, usePagination } from "react-table";
import LoadingSpinner from "../LoadingSpinner";
import ImgNotFound from "../../assets/images/NoDataFound.png";
import Pagination from "./Pagination";


interface GlobalTableProps {
  id?: string;
  columns: any;
  data?: any;
  pagination: any;
  handlePageChange: (page: number) => void;
  loading: boolean;
  pageSize?: number;
}

const Table: React.FC<GlobalTableProps> = ({
  id,
  columns,
  data,
  pagination,
  handlePageChange,
  loading,
  pageSize = 20,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: pageSize },
      },
      usePagination
    );
  const [pageItems, setPageItems] = useState<(number | string)[]>([]);

  const pageNumbers = Array.from(
    { length: pagination?.total_pages },
    (_, i) => i
  );

  const getPageItems = (paginationData: any) => {
    const { page: current, total_pages: total } = paginationData;
    const pages: (number | string)[] = [];

    // กรณี total น้อยกว่าหรือเท่ากับ 7 ให้แสดงทั้งหมด
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      console.log("current <= 4 = ", pages);
      return pages;
    }

    // ถ้า current <= 4 ให้แสดง 1–4, …, total-2, total-1, total
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("ellipsis");
      for (let i = total - 2; i <= total; i++) pages.push(i);
      console.log("current <= 4 = ", pages);
      return pages;
    }

    // ถ้า current > total-4 ให้แสดง 1, 2, 3, …, total-3 ถึง total
    if (current > total - 4) {
      pages.push(1, 2, "ellipsis");
      for (let i = total - 3; i <= total; i++) pages.push(i);
      console.log("current > total - 4 = ", pages);
      return pages;
    }

    // กรณีกลาง: 1, 2, …, current-1, current, current+1, …, total-1, total
    pages.push(1, 2, "ellipsis");
    pages.push(current - 1, current, current + 1);
    pages.push("ellipsis");
    pages.push(total - 1, total);
    console.log("getPageItems = ", pages);
    return pages;
  };

  useEffect(() => {
    if (pagination) {
      const items = getPageItems(pagination);
      setPageItems(items);
    } else { console.log("e pagination", pagination); }

  }, [data, pagination]);



  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="relative z-0">
      <div
        className="w-full overflow-x-auto"
        style={{ overflowX: "auto", width: "100%" }}
      >
        <table
          id={id}
          {...getTableProps()}
          className="w-full mt-5"
          style={{ width: "100%", borderCollapse: "collapse", zIndex: 0 }}
        >
          <thead className="bg-[#f9fafb]">
            {headerGroups.map((headerGroup: any) => {
              const { key: headerKey, ...headerProps } =
                headerGroup.getHeaderGroupProps();
              return (
                <tr
                  key={headerKey}
                  {...headerProps}
                  className="text-base font-semibold text-left"
                >
                  {headerGroup.headers.map((column: any) => {
                    const { key: columnKey, ...columnProps } =
                      column.getHeaderProps();
                    return (
                      <th
                        key={columnKey}
                        {...columnProps}
                        className="py-2 whitespace-nowrap px-4 border-b border-[#e5e7eb] font-semibold"
                      >
                        {column.render("Header")}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          {data.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center text-base">
                  <div className="flex justify-center items-center py-10">
                    <img
                      src={ImgNotFound}
                      className="w-48 h-auto"
                      alt="No Data Found"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody {...getTableBodyProps()} className="text-base">
              {page.map((row: any) => {
                prepareRow(row);
                const { key: rowKey, ...rowProps } = row.getRowProps();
                return (
                  <tr key={rowKey} {...rowProps}>
                    {row.cells.map((cell: any) => {
                      const { key: cellKey, ...cellProps } =
                        cell.getCellProps();
                      return (
                        <td
                          key={cellKey}
                          {...cellProps}
                          className="py-3 whitespace-nowrap px-4 border-b border-[#e5e7eb]"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        {data.length > 0 && (
          <Pagination pagination={pagination} handlePageChange={handlePageChange}></Pagination>
        )}
        {/* <div
          className={`pagination flex items-center justify-center space-x-2 mt-4
             h-20`}
        >
          <button
            onClick={() => handlePageChange(pagination?.page - 1)}
            disabled={pagination?.page <= 1}
            className="px-2 py-1 border rounded disabled:opacity-50 text-base font-semibold"
          >
            {"<"}
          </button>
          {pageItems.map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`el-${idx}`} className="px-2 py-1">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => handlePageChange(item as number)}
                className={`px-2 py-1 border rounded font-semibold ${pagination.page === item
                  ? "bg-blue-500 text-white"
                  : ""
                  }`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(pagination?.page + 1)}
            disabled={pagination?.page == pagination?.total_pages}
            className="px-2 py-1 border rounded disabled:opacity-50 text-base font-semibold"
          >
            {">"}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Table;
