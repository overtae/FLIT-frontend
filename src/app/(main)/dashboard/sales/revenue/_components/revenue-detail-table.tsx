"use client";

import { useMemo } from "react";

import { Download } from "lucide-react";
import * as XLSX from "xlsx";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { revenueColumns } from "./columns.revenue";

const mockRevenueDetails = [
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

export function RevenueDetailTable() {
  const columns = useMemo(() => revenueColumns, []);
  const { table, rowSelection } = useDataTableInstance({
    data: mockRevenueDetails,
    columns,
    getRowId: (row) => row.id,
  });

  const handleDownloadAll = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      "닉네임(ID)": `${row.original.nickname} (${row.original.nicknameId})`,
      번호: row.original.phone,
      주소: row.original.address,
      "매출액(건수)": `${row.original.revenueAmount.toLocaleString()}원 (${row.original.revenueCount}건)`,
      "취소금액 (건수)": `${row.original.cancelAmount.toLocaleString()}원 (${row.original.cancelCount}건)`,
      "환불금액 (건수)": `${row.original.refundAmount.toLocaleString()}원 (${row.original.refundCount}건)`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "매출 상세");

    const fileName = `매출상세_${new Date().toISOString().split("T")[0]}.xlsx`;
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
