"use client";

import { flexRender, type ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

interface SalesDetail {
  id: string;
  name: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  address: string;
  productName: string;
  amount: number;
  paymentMethod: string;
}

const mockSalesDetails: SalesDetail[] = [
  {
    id: "1",
    name: "홍길동",
    nickname: "고객A",
    nicknameId: "customer001",
    phone: "010-1234-5678",
    address: "서울시 강남구",
    productName: "꽃다발",
    amount: 50000,
    paymentMethod: "카드",
  },
  {
    id: "2",
    name: "김철수",
    nickname: "고객B",
    nicknameId: "customer002",
    phone: "010-2345-6789",
    address: "서울시 서초구",
    productName: "꽃바구니",
    amount: 80000,
    paymentMethod: "계좌이체",
  },
  {
    id: "3",
    name: "이영희",
    nickname: "고객C",
    nicknameId: "customer003",
    phone: "010-3456-7890",
    address: "경기도 성남시",
    productName: "동양난",
    amount: 120000,
    paymentMethod: "현장결제",
  },
  {
    id: "4",
    name: "박민수",
    nickname: "고객D",
    nicknameId: "customer004",
    phone: "010-4567-8901",
    address: "인천시 남동구",
    productName: "서양난",
    amount: 150000,
    paymentMethod: "카드",
  },
  {
    id: "5",
    name: "정수진",
    nickname: "고객E",
    nicknameId: "customer005",
    phone: "010-5678-9012",
    address: "서울시 송파구",
    productName: "다육식물",
    amount: 30000,
    paymentMethod: "카드",
  },
];

function createColumns(): ColumnDef<SalesDetail>[] {
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
      accessorKey: "name",
      header: "이름",
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
      accessorKey: "productName",
      header: "상품명",
    },
    {
      accessorKey: "amount",
      header: "금액",
      cell: ({ row }) => `${row.original.amount.toLocaleString()}원`,
    },
    {
      accessorKey: "paymentMethod",
      header: "결제방법",
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

export function SalesDetailTable() {
  const columns = createColumns();
  const table = useDataTableInstance({
    data: mockSalesDetails,
    columns,
    getRowId: (row) => row.id,
  });

  const handleDownloadAll = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    // Download logic here
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
