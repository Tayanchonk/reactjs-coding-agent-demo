// tanstackTable

import React from 'react';
import {
    Column,
    ColumnDef,
    PaginationState,
    Table,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { makeData, Data } from './makeData'
import { BsThreeDotsVertical } from 'react-icons/bs';
const TanstackTable = () => {

    const rerender = React.useReducer(() => ({}), {})[1]

    const columns = React.useMemo<ColumnDef<Data>[]>(
        () => [
            {
                accessorKey: 'retentionPolicyName',
                cell: info => info.getValue(),
                header: () => <span>Retention Policy Name</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.retentionPolicyType,
                id: 'retentionPolicyType',
             
                header: () => <span>Retention Policy Type</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'retentionPolicyStatus',
                header: () => 'Retention Policy Status',
                cell: info => {
                    const value = info.getValue() as string;
                    const bgColor = value === 'Active' ? 'rgb(238 253 242)' : 'rgba(249, 249, 249, 1)';
                    const BdColor = value === 'Active' ? 'rgba(196, 234, 208, 1)' : 'rgba(216, 220, 217, 1)';
                    const textColor = value === 'Active' ? 'rgb(21 117 54)' : '#656668'; 

                    return (
                        <span className='font-medium' style={{ backgroundColor: bgColor, color: textColor, padding: '3px 10px', borderRadius: '0.5em', border: `1px solid ${BdColor}` }}>
                            {value}
                        </span>
                    );
                },
                footer: props => props.column.id,

            },
            {
                accessorKey: 'createdBy',
                header: () => <span>Created By</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'createdDate',
                header: 'Created Date',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'activity',
                header: '',
                cell: () => <BsThreeDotsVertical />,
                // cell: ({ row }) => {
                //     return <button
                //         {...{
                //         //   onClick: row.getToggleExpandedHandler(),
                //           style: { cursor: 'pointer' },
                //         }}
                //       >
                //        <BsThreeDotsVertical />
                //       </button>

                //   }, 

                // footer: props => props.column.id,
            },

        ],
        []
    )

    const [data, setData] = React.useState(() => makeData(100000))

    function MyTable({
        data,
        columns,
    }: {
        data: Data[]
        columns: ColumnDef<Data>[]
    }) {
        const [pagination, setPagination] = React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

        const table = useReactTable({
            columns,
            data,
            debugTable: true,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onPaginationChange: setPagination,
            //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
            state: {
                pagination,
            },
            // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
        })

        return (
            <div className="p-2">
                <div className="h-2" />
                <table className="w-full mt-5">
                    <thead className="bg-[#f9fafb]">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id} colSpan={header.colSpan} className='text-[14px] text-left px-4 py-3'>
                                            <div
                                                {...{
                                                    className: header.column.getCanSort()
                                                        ? 'cursor-pointer select-none'
                                                        : '',
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[header.column.getIsSorted() as string] ?? null}
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} table={table} />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="text-sm font-light">
                        {table.getRowModel().rows.map(row => {
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id} className="py-3 px-4 border-b border-[#e5e7eb]">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="h-2" />
                <div className="flex items-center gap-2">
                    <button
                        className="border rounded p-1"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <input
                            type="number"
                            min="1"
                            max={table.getPageCount()}
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            className="border p-1 rounded w-16"
                        />
                    <button
                        className="border rounded p-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount().toLocaleString()}
                        </strong>
                    </span>
                  
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                {/* <div>
              Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
              {table.getRowCount().toLocaleString()} Rows
            </div>
            <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
            </div>
        )
    }

    function Filter({
        column,
        table,
    }: {
        column: Column<any, any>
        table: Table<any>
    }) {
        const firstValue = table
            .getPreFilteredRowModel()
            .flatRows[0]?.getValue(column.id)

        const columnFilterValue = column.getFilterValue()

        return typeof firstValue === 'number' ? (
            <div className="flex space-x-2" onClick={e => e.stopPropagation()}>

                <input
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={e =>
                        column.setFilterValue((old: [number, number]) => [
                            old?.[0],
                            e.target.value,
                        ])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
        ) :
            column.id !== 'activity' &&
            (
                <input
                    className="w-full border shadow rounded h-[30px] p-1 mt-1"
                    onChange={e => column.setFilterValue(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    placeholder={`Search...`}
                    type="text"
                    value={(columnFilterValue ?? '') as string}
                />
            )
    }


    return (
        <div>
            Tanstack Table

            <MyTable
                {...{
                    data,
                    columns,
                }}
            />
        </div>
    );
}
export default TanstackTable;