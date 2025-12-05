import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  OnChangeFn,
  PaginationState,
  Table,
} from "@tanstack/react-table";

type UseDataTableInstanceProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  enableRowSelection?: boolean;
  defaultPageIndex?: number;
  defaultPageSize?: number;
  getRowId?: (row: TData, index: number) => string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
};

export function useDataTableInstance<TData, TValue>({
  data,
  columns,
  enableRowSelection = true,
  defaultPageIndex = 0,
  defaultPageSize = 10,
  getRowId,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: controlledOnRowSelectionChange,
}: UseDataTableInstanceProps<TData, TValue>): Table<TData> {
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  });

  const rowSelection = controlledRowSelection ?? internalRowSelection;

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = React.useCallback(
    (updater) => {
      if (controlledOnRowSelectionChange) {
        controlledOnRowSelectionChange(updater);
      } else {
        setInternalRowSelection((prev) => {
          return typeof updater === "function" ? updater(prev) : updater;
        });
      }
    },
    [controlledOnRowSelectionChange],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection,
    getRowId: (row, index) => {
      if (getRowId) {
        return getRowId(row, index);
      }
      const rowWithId = row as { id?: string | number };
      return rowWithId.id?.toString() ?? index.toString();
    },
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return table;
}
