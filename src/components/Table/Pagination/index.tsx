import React from 'react';

interface PaginationData {
  page: number;
  total_pages: number;
}

type PaginationProps = {
  pagination: PaginationData;
  handlePageChange: (page: number) => void;
};

function Pagination({ pagination, handlePageChange }: PaginationProps) {
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

  const pageItems = getPageItems(pagination);

  return (
    <div
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
    </div>
  );
}

export default Pagination;
