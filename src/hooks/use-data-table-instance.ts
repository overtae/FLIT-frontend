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
  manualFiltering?: boolean;
};

type UseDataTableInstanceReturn<TData> = {
  table: Table<TData>;
  rowSelection: RowSelectionState;
};

export function useDataTableInstance<TData, TValue>({
  data,
  columns,
  enableRowSelection = true,
  defaultPageIndex = 0,
  defaultPageSize = 10,
  getRowId,
  manualFiltering = false,
}: UseDataTableInstanceProps<TData, TValue>): UseDataTableInstanceReturn<TData> {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  });

  const memoizedGetRowId = React.useCallback(
    (row: TData, index: number) => {
      if (getRowId) {
        return getRowId(row, index);
      }
      const rowWithId = row as { id?: string | number };
      return rowWithId.id?.toString() ?? index.toString();
    },
    [getRowId],
  );

  React.useEffect(() => {
    if (data.length === 0 && pagination.pageIndex > 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [data.length, pagination.pageIndex]);

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
    manualFiltering,
    autoResetPageIndex: false,
    getRowId: memoizedGetRowId,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: manualFiltering ? undefined : getFacetedRowModel(),
    getFacetedUniqueValues: manualFiltering ? undefined : getFacetedUniqueValues(),
  });

  return { table, rowSelection };
}
