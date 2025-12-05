"use client";

import { flexRender, type ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

interface RevenueDetail {
  id: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  address: string;
  revenueAmount: number;
  revenueCount: number;
  cancelAmount: number;
  cancelCount: number;
  refundAmount: number;
  refundCount: number;
}

const mockRevenueDetails: RevenueDetail[] = [
  {
    id: "1",
    nickname: "아미화",
    nicknameId: "sm101",
    phone: "010-0000-0000",
    address: "서울시 강남구 테헤란로 27",
    revenueAmount: 5000000,
    revenueCount: 50,
    cancelAmount: 200000,
    cancelCount: 2,
    refundAmount: 100000,
    refundCount: 1,
  },
  {
    id: "2",
    nickname: "플로리스트A",
    nicknameId: "fl001",
    phone: "010-1111-1111",
    address: "서울시 서초구 서초대로 123",
    revenueAmount: 8000000,
    revenueCount: 80,
    cancelAmount: 300000,
    cancelCount: 3,
    refundAmount: 150000,
    refundCount: 2,
  },
  {
    id: "3",
    nickname: "매장B",
    nicknameId: "shop002",
    phone: "010-2222-2222",
    address: "경기도 성남시 분당구 정자동",
    revenueAmount: 12000000,
    revenueCount: 120,
    cancelAmount: 500000,
    cancelCount: 5,
    refundAmount: 200000,
    refundCount: 2,
  },
];

function createColumns(): ColumnDef<RevenueDetail>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="전체 선택"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="행 선택"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nickname",
      header: "닉네임(ID)",
      cell: ({ row }) => `${row.original.nickname} (${row.original.nicknameId})`,
    },
    {
      accessorKey: "phone",
      header: "번호",
    },
    {
      accessorKey: "address",
      header: "주소",
    },
    {
      id: "revenue",
      header: "매출액(건수)",
      cell: ({ row }) => `${row.original.revenueAmount.toLocaleString()}원 (${row.original.revenueCount}건)`,
    },
    {
      id: "cancel",
      header: "취소금액 (건수)",
      cell: ({ row }) => `${row.original.cancelAmount.toLocaleString()}원 (${row.original.cancelCount}건)`,
    },
    {
      id: "refund",
      header: "환불금액 (건수)",
      cell: ({ row }) => `${row.original.refundAmount.toLocaleString()}원 (${row.original.refundCount}건)`,
    },
    {
      id: "download",
      header: "다운로드",
      cell: () => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Download logic here
            }}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">다운로드</span>
          </Button>
        );
      },
    },
  ];
}

export function RevenueDetailTable() {
  const columns = createColumns();
  const table = useDataTableInstance({
    data: mockRevenueDetails,
    columns,
    getRowId: (row) => row.id,
  });

  const handleDownloadAll = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    // TODO: Download logic here
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <Button variant="outline" onClick={handleDownloadAll}>
          <Download className="mr-2 h-4 w-4" />
          전체 다운로드
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-[60px]">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
