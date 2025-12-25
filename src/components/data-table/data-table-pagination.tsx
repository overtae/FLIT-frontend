import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  sectionSize?: number;
}

export function DataTablePagination<TData>({
  table,
  leftSlot,
  rightSlot,
  className,
  sectionSize = 5,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = table.getState().pagination.pageIndex;

  const currentSection = Math.floor(currentPage / sectionSize);
  const sectionStartPage = currentSection * sectionSize;
  const sectionEndPage = Math.min(sectionStartPage + sectionSize - 1, pageCount - 1);
  const totalSections = Math.ceil(pageCount / sectionSize);

  const pages = React.useMemo(() => {
    const pages: number[] = [];
    for (let i = sectionStartPage; i <= sectionEndPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [sectionStartPage, sectionEndPage]);

  const updateURL = React.useCallback(
    (newPageIndex: number, newPageSize?: number) => {
      if (newPageIndex === currentPage && newPageSize === undefined) {
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (newPageIndex + 1).toString());
      if (newPageSize !== undefined) {
        params.set("pageSize", newPageSize.toString());
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, currentPage],
  );

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      const previousSection = currentSection - 1;
      const previousSectionLastPage = Math.min((previousSection + 1) * sectionSize - 1, pageCount - 1);
      updateURL(previousSectionLastPage);
    }
  };

  const handleNextSection = () => {
    if (currentSection < totalSections - 1) {
      const nextSection = currentSection + 1;
      const nextSectionFirstPage = nextSection * sectionSize;
      updateURL(nextSectionFirstPage);
    }
  };

  const handleFirstPage = () => {
    updateURL(0);
  };

  const handleLastPage = () => {
    updateURL(pageCount - 1);
  };

  const handlePageClick = (page: number) => {
    updateURL(page);
  };

  const canGoToPreviousSection = currentSection > 0;
  const canGoToNextSection = currentSection < totalSections - 1;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {leftSlot && <div className="absolute top-1/2 left-0 flex -translate-y-1/2 items-center">{leftSlot}</div>}
      <div className="flex flex-1 items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleFirstPage}
          disabled={currentPage === 0 || pageCount === 0}
        >
          <span className="sr-only">첫 페이지</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handlePreviousSection}
          disabled={!canGoToPreviousSection || pageCount === 0}
        >
          <span className="sr-only">이전 섹션</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              className={cn("h-8 w-8 p-0", currentPage === page && "bg-primary text-primary-foreground")}
              onClick={() => handlePageClick(page)}
              disabled={pageCount === 0}
            >
              {page + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleNextSection}
          disabled={!canGoToNextSection || pageCount === 0}
        >
          <span className="sr-only">다음 섹션</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleLastPage}
          disabled={currentPage === pageCount - 1 || pageCount === 0}
        >
          <span className="sr-only">마지막 페이지</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      {rightSlot && <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center">{rightSlot}</div>}
    </div>
  );
}
