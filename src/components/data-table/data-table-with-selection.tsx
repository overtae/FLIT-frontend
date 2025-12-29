"use client";

import { flexRender, type Table as TanStackTable, type RowSelectionState } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableWithSelectionProps<TData> {
  table: TanStackTable<TData>;
  rowSelection: RowSelectionState;
  onRowClick?: (row: TData) => void;
  filterKey?: string;
}

export function DataTableWithSelection<TData>({
  table,
  rowSelection,
  onRowClick,
  filterKey,
}: DataTableWithSelectionProps<TData>) {
  const rowSelectionKey = JSON.stringify(rowSelection);
  const rows = table.getRowModel().rows;
  const columns = table.getAllColumns();
  const tableKey = filterKey ? `${rowSelectionKey}-${filterKey}` : rowSelectionKey;

  return (
    <Table key={tableKey}>
      <TableHeader className="bg-muted sticky top-0 z-10">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="cursor-default">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="**:data-[slot=table-cell]:first:w-8">
        {!rows.length ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => {
            const isSelected = row.getIsSelected();

            return (
              <TableRow
                key={row.id}
                data-state={isSelected ? "selected" : undefined}
                className={cn(onRowClick ? "cursor-pointer" : "cursor-default", isSelected && "bg-muted")}
                onClick={(e) => {
                  if (!onRowClick) return;

                  const target = e.target as HTMLElement;
                  const isInteractiveElement =
                    target.closest("button") ??
                    target.closest("a") ??
                    target.closest("[role='button']") ??
                    target.closest("input") ??
                    target.closest("select") ??
                    target.closest("[data-no-row-click]");

                  if (!isInteractiveElement) {
                    onRowClick(row.original);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
