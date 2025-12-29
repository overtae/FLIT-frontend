import { useMemo, useState, useCallback, useEffect } from "react";

interface UseFilteredPaginationOptions<T> {
  data: T[];
  filterFn?: (item: T) => boolean;
  initialPageIndex?: number;
  initialPageSize?: number;
}

interface UseFilteredPaginationReturn<T> {
  filteredData: T[];
  paginatedData: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  pageCount: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
  onPaginationChange: (
    updater:
      | { pageIndex?: number; pageSize?: number }
      | ((prev: { pageIndex: number; pageSize: number }) => { pageIndex?: number; pageSize?: number }),
  ) => void;
}

export function useFilteredPagination<T>({
  data,
  filterFn,
  initialPageIndex = 0,
  initialPageSize = 10,
}: UseFilteredPaginationOptions<T>): UseFilteredPaginationReturn<T> {
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setPageIndex(initialPageIndex);
  }, [initialPageIndex]);

  useEffect(() => {
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  const filteredData = useMemo(() => {
    if (!filterFn) return data;
    return data.filter(filterFn);
  }, [data, filterFn]);

  const totalCount = filteredData.length;
  const pageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (pageIndex >= pageCount && pageCount > 0) {
      setPageIndex(Math.max(0, pageCount - 1));
    } else if (pageCount === 0) {
      setPageIndex(0);
    }
  }, [pageCount, pageIndex]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pageIndex, pageSize]);

  const resetPagination = useCallback(() => {
    setPageIndex(0);
  }, []);

  const onPaginationChange = useCallback(
    (
      updater:
        | { pageIndex?: number; pageSize?: number }
        | ((prev: { pageIndex: number; pageSize: number }) => { pageIndex?: number; pageSize?: number }),
    ) => {
      const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;

      if (newPagination.pageIndex !== undefined) {
        setPageIndex(newPagination.pageIndex);
      }
      if (newPagination.pageSize !== undefined) {
        setPageSize(newPagination.pageSize);
        setPageIndex(0);
      }
    },
    [pageIndex, pageSize],
  );

  return {
    filteredData,
    paginatedData,
    pageIndex,
    pageSize,
    totalCount,
    pageCount,
    setPageIndex,
    setPageSize,
    resetPagination,
    onPaginationChange,
  };
}
