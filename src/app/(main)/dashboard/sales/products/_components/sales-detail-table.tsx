"use client";

import { useMemo } from "react";

import { Download } from "lucide-react";
import * as XLSX from "xlsx";

import { productColumns } from "@/app/(main)/dashboard/sales/products/_components/columns.product";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
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

export function SalesDetailTable() {
  const columns = useMemo(() => productColumns, []);
  const { table, rowSelection } = useDataTableInstance({
    data: mockSalesDetails,
    columns,
  });

  const handleDownloadAll = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      이름: row.original.name,
      "닉네임(ID)": `${row.original.nickname} (${row.original.nicknameId})`,
      번호: row.original.phone,
      주소: row.original.address,
      상품명: row.original.productName,
      금액: `${row.original.amount.toLocaleString()}원`,
      결제방법: row.original.paymentMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "판매 상세");

    const fileName = `판매상세_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <DataTableWithSelection table={table} rowSelection={rowSelection} />
      </div>

      <DataTablePagination
        table={table}
        leftSlot={
          <Button variant="outline" onClick={handleDownloadAll} disabled={Object.keys(rowSelection).length === 0}>
            <Download className="mr-2 h-4 w-4" />
            전체 다운로드
          </Button>
        }
      />
    </div>
  );
}
