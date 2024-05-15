"use client"
import React, { useMemo } from 'react'
import { useTable, useSortBy, usePagination, useGlobalFilter, Column } from 'react-table'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface DataTableProps {
  data: any[]
  columns: Column<any>[]
}

const schema = yup.object().shape({
  globalFilter: yup.string().max(20, 'Maximum 20 characters allowed'),
})

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  const { control, handleSubmit, watch, setValue } = useForm({
    resolver: yupResolver(schema),
  })

  const globalFilter = watch('globalFilter')

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const onSubmit = () => {
    setGlobalFilter(globalFilter)
  }

  const handleCellChange = (id: number, accessor: string, value: any) => {
    const updatedData = data.map((row: any) =>
      row.id === id ? { ...row, [accessor]: value } : row
    )
    setValue(accessor, value)
    // Optionally, you can update state with updatedData
    // setData(updatedData);
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <Controller
          name="globalFilter"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Search..."
              className="p-2 border rounded"
            />
          )}
        />
        <button type="submit" className="p-2 ml-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </form>
      
      <table {...getTableProps()} className="min-w-full bg-white border">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-2 border"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-100">
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-2 border"
                    key={cell.column.id}
                  >
                    {cell.column.id === 'name' || cell.column.id === 'age' ? (
                      <input
                        value={cell.value}
                        onChange={(e) =>
                          handleCellChange(row.original.id, cell.column.id, e.target.value)
                        }
                      />
                    ) : (
                      cell.render('Cell')
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default DataTable
