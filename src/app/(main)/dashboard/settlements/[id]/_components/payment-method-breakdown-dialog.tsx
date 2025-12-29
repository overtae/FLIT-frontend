"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaymentMethodBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakdown: {
    card: number;
    bankTransfer: number;
    pos: number;
  };
}

export function PaymentMethodBreakdownDialog({ open, onOpenChange, breakdown }: PaymentMethodBreakdownDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>결제 금액 상세</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">카드결제</span>
            <span className="font-semibold">{breakdown.card.toLocaleString()}원</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">계좌이체</span>
            <span className="font-semibold">{breakdown.bankTransfer.toLocaleString()}원</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">현장결제(POS)</span>
            <span className="font-semibold">{breakdown.pos.toLocaleString()}원</span>
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <Button onClick={() => onOpenChange(false)}>OK</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
