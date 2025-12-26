"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import * as XLSX from "@e965/xlsx";
import { Search } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getTransactions } from "@/service/transaction.service";
import { Transaction, PaymentMethod, TransactionType } from "@/types/dashboard";

import { createTransactionColumns } from "./transaction-columns";
import { TransactionDetailModal } from "./transaction-detail-modal";
import { TransactionFilter } from "./transaction-filter";

interface TransactionListProps {
  category: "order" | "order-request" | "canceled";
  subCategory?: "all" | "shop" | "florist" | "order-request";
}

export function TransactionList({ category, subCategory }: TransactionListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const pageIndex = parseInt(searchParams.get("page") ?? "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  useEffect(() => {
    const buildCategoryParams = (params: {
      subCategory?: string;
      refundStatus?: string;
      type?: string;
      paymentMethod?: string;
      page?: number;
      pageSize?: number;
    }) => {
      if (category === "canceled") {
        params.refundStatus = "환불처리";
        if (subCategory && subCategory !== "all" && subCategory !== "order-request") {
          params.subCategory = subCategory;
        }
      } else if (category === "order") {
        if (subCategory && subCategory !== "all") {
          params.subCategory = subCategory;
        }
      } else {
        params.subCategory = "order-request";
      }
    };

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const params: {
          subCategory?: string;
          refundStatus?: string;
          type?: string;
          paymentMethod?: string;
          page?: number;
          pageSize?: number;
        } = {
          page: pageIndex + 1,
          pageSize,
        };

        buildCategoryParams(params);

        const searchValue = searchParams.get("search");
        const typesValue = searchParams.get("types");
        const paymentMethodsValue = searchParams.get("paymentMethods");
        const refundStatusesValue = searchParams.get("refundStatuses");
        const dateValue = searchParams.get("date");

        // URL에서 읽어온 필터 값들을 API 파라미터에 추가
        if (typesValue) {
          const types = typesValue.split(",");
          if (types.length > 0) {
            params.type = types[0] as TransactionType;
          }
        }
        if (paymentMethodsValue) {
          const methods = paymentMethodsValue.split(",");
          if (methods.length > 0) {
            params.paymentMethod = methods[0] as PaymentMethod;
          }
        }

        const response = await getTransactions({
          ...params,
          search: searchValue ?? undefined,
          types: typesValue ?? undefined,
          paymentMethods: paymentMethodsValue ?? undefined,
          refundStatuses: refundStatusesValue ?? undefined,
          date: dateValue ?? undefined,
        });
        setTransactions(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subCategory, pageIndex, pageSize, searchParams.toString()]);

  const handleViewDetail = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  }, []);

  const handleDownload = useCallback((transaction: Transaction) => {
    const data = [
      {
        주문번호: transaction.orderNumber,
        From: transaction.from,
        To: transaction.to,
        상품명: transaction.productName,
        결제금액: transaction.paymentAmount,
        주문접수일: transaction.orderDate,
        결제일: transaction.paymentDate,
        결제방법: transaction.paymentMethod,
        구분: transaction.type,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "거래 내역");
    const fileName = `${transaction.orderNumber}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }, []);

  const columns = useMemo(
    () =>
      createTransactionColumns({
        onViewDetail: handleViewDetail,
        onDownload: handleDownload,
        category,
      }),
    [category, handleViewDetail, handleDownload],
  );

  const { table, rowSelection } = useDataTableInstance({
    data: transactions,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  const handleDownloadAll = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const transactionsToDownload = selectedRows.map((row) => row.original);

    const data = transactionsToDownload.map((t) => ({
      주문번호: t.orderNumber,
      From: t.from,
      To: t.to,
      상품명: t.productName,
      결제금액: t.paymentAmount,
      주문접수일: t.orderDate,
      결제일: t.paymentDate,
      결제방법: t.paymentMethod,
      구분: t.type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "거래 목록");
    const fileName = `주문목록_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col space-y-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Input
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const params = new URLSearchParams(searchParams.toString());
                    if (search.trim()) {
                      params.set("search", search.trim());
                    } else {
                      params.delete("search");
                    }
                    router.push(`?${params.toString()}`, { scroll: false });
                  }
                }}
                className="h-9 rounded-full pr-10 pl-4"
              />
              <Search className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
            </div>
            <TransactionFilter type={category} />
          </div>
        </div>
        <div className="flex-1 rounded-md">
          <DataTableWithSelection table={table} rowSelection={rowSelection} />
        </div>
        <div className="border-t px-4 py-4">
          <DataTablePagination
            table={table}
            leftSlot={
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={Object.keys(rowSelection).length === 0}
              >
                전체 다운로드
              </Button>
            }
          />
        </div>
      </div>

      <TransactionDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction}
        category={category}
      />
    </>
  );
}
