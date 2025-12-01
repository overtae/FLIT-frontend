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
  defaultPageIndex,
  defaultPageSize,
  getRowId,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: controlledOnRowSelectionChange,
}: UseDataTableInstanceProps<TData, TValue>) {
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: defaultPageIndex ?? 0,
    pageSize: defaultPageSize ?? 10,
  });

  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const rowSelection = controlledRowSelection ?? internalRowSelection;

  const handleRowSelectionChange = React.useCallback<OnChangeFn<RowSelectionState>>(
    (updater) => {
      if (!isMountedRef.current) return;
      if (controlledOnRowSelectionChange) {
        controlledOnRowSelectionChange(updater);
      } else {
        setInternalRowSelection((prev) => {
          if (typeof updater === "function") {
            return updater(prev);
          }
          return updater;
        });
      }
    },
    [controlledOnRowSelectionChange],
  );

  const handleSortingChange = React.useCallback<OnChangeFn<SortingState>>((updater) => {
    if (!isMountedRef.current) return;
    setSorting((prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }
      return updater;
    });
  }, []);

  const handleColumnFiltersChange = React.useCallback<OnChangeFn<ColumnFiltersState>>((updater) => {
    if (!isMountedRef.current) return;
    setColumnFilters((prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }
      return updater;
    });
  }, []);

  const handleColumnVisibilityChange = React.useCallback<OnChangeFn<VisibilityState>>((updater) => {
    if (!isMountedRef.current) return;
    setColumnVisibility((prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }
      return updater;
    });
  }, []);

  const handlePaginationChange = React.useCallback((updater: React.SetStateAction<typeof pagination>) => {
    if (!isMountedRef.current) return;
    setPagination((prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }
      return updater;
    });
  }, []);

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
    getRowId:
      getRowId ??
      ((row: TData) => {
        const rowWithId = row as { id?: string | number };
        return rowWithId.id?.toString() ?? "";
      }),
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return table;
}
