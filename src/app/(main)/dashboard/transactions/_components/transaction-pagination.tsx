"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransactionPaginationProps<TData> {
  table: Table<TData>;
}

export function TransactionPagination<TData>({ table }: TransactionPaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // 페이지가 1개 미만일 경우 보여주지 않거나, 최소 1개 페이지를 렌더링하려면 조건을 조정하세요.
  // 여기서는 실제 pageCount만큼만 버튼을 생성하도록 수정합니다.
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">이전 페이지</span>
        &lt;
      </Button>
      {pages.map((pageIndex) => (
        <Button
          key={pageIndex}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 rounded-full p-0 font-normal hover:bg-transparent hover:text-red-500",
            currentPage === pageIndex ? "font-bold text-red-500" : "text-muted-foreground",
          )}
          onClick={() => table.setPageIndex(pageIndex)}
        >
          {pageIndex + 1}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">다음 페이지</span>
        &gt;
      </Button>
    </div>
  );
}
