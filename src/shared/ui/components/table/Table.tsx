import React from 'react';

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { cn } from '@/shared/lib/utils/cn';

import st from './Table.module.scss';

export const Table = <TData,>({
  data,
  columns,
  className,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  className?: string;
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn(st.wrapper, className)}>
      <table className={st.table}>
        <thead className={st.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={st.th}
                  style={{
                    width: (header.column.columnDef.meta as { width?: string } | undefined)?.width,
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {data.length ? (
          <tbody className={st.tbody}>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <React.Fragment key={row.id}>
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={st.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {rowIndex < table.getRowModel().rows.length - 1 && (
                  <tr>
                    <td colSpan={columns.length} className={st.rowDivider} />
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};
