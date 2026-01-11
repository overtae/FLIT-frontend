"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TransactionDetail } from "@/types/transaction.type";

interface TransactionDetailCustomerInfoProps {
  transaction: TransactionDetail;
}

export function TransactionDetailCustomerInfo({ transaction }: TransactionDetailCustomerInfoProps) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold sm:mb-4 sm:text-sm">고객 정보</h3>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Label className="text-muted-foreground w-20 shrink-0 text-xs font-normal sm:w-24">전화번호</Label>
          <Input
            value={transaction.to.phoneNumber ?? ""}
            readOnly
            className="pointer-events-none h-8 border-gray-200 bg-gray-50 text-left text-xs sm:h-9 sm:text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
          <Label className="text-muted-foreground w-20 shrink-0 text-xs font-normal sm:w-24 sm:pt-2">주소</Label>
          <Textarea
            value={transaction.to.address ?? ""}
            readOnly
            rows={2}
            className="pointer-events-none resize-none border-gray-200 bg-gray-50 text-left text-xs sm:text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Label className="text-muted-foreground w-20 shrink-0 text-xs font-normal sm:w-24">상세주소</Label>
          <Input
            value={transaction.to.detailAddress ?? ""}
            readOnly
            className="pointer-events-none h-8 border-gray-200 bg-gray-50 text-left text-xs sm:h-9 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
