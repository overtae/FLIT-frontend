"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TransactionDetail } from "@/types/transaction.type";

interface TransactionDetailFloristInfoProps {
  transaction: TransactionDetail;
}

export function TransactionDetailFloristInfo({ transaction }: TransactionDetailFloristInfoProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">플로리스트 정보</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">전화번호</Label>
          <Input
            value={transaction.from.phoneNumber ?? ""}
            readOnly
            className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
        <div className="flex items-start gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 pt-2 text-xs font-normal">주소</Label>
          <Textarea
            value={transaction.from.address ?? ""}
            readOnly
            rows={2}
            className="pointer-events-none resize-none border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">상세주소</Label>
          <Input
            value={transaction.from.detailAddress ?? ""}
            readOnly
            className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
      </div>
    </div>
  );
}
