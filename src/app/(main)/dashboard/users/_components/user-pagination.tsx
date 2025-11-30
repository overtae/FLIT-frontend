"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserPaginationProps<TData> {
  table: Table<TData>;
}

export function UserPagination<TData>({ table }: UserPaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // Generate array of page numbers (simplified for demo, normally would have logic for many pages)
  // Mocking 5 pages if pageCount is small, or just use pageCount
  const pages = Array.from({ length: Math.max(pageCount, 5) }, (_, i) => i);

  return (
    <div className="flex items-center justify-center space-x-2">
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
          // For demo purposes, we might disable clicking on pages that don't exist in mock data
          // But effectively this sets the page index
        >
          {pageIndex + 1}
        </Button>
      ))}
    </div>
  );
}
