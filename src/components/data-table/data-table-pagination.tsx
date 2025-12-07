import * as React from "react";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

export function DataTablePagination<TData>({ table, leftSlot, rightSlot, className }: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const pages = React.useMemo(() => {
    const maxVisiblePages = 7;
    if (pageCount <= maxVisiblePages) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    const pages: (number | "ellipsis")[] = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(pageCount - 1, currentPage + 2);

    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) {
        pages.push("ellipsis");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < pageCount - 1) {
      if (endPage < pageCount - 2) {
        pages.push("ellipsis");
      }
      pages.push(pageCount - 1);
    }

    return pages;
  }, [pageCount, currentPage]);

  if (pageCount <= 0 && !leftSlot && !rightSlot) {
    return null;
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {leftSlot && <div className="absolute top-1/2 left-0 flex -translate-y-1/2 items-center">{leftSlot}</div>}
      <div className="flex flex-1 items-center justify-center gap-2">
        {pageCount > 0 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">이전 페이지</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {pages.map((page) => {
                if (page === "ellipsis") {
                  return (
                    <span key="ellipsis" className="text-muted-foreground px-2">
                      ...
                    </span>
                  );
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    className={cn("h-8 w-8 p-0", currentPage === page && "bg-primary text-primary-foreground")}
                    onClick={() => table.setPageIndex(page)}
                  >
                    {page + 1}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">다음 페이지</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {rightSlot && <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center">{rightSlot}</div>}
    </div>
  );
}
