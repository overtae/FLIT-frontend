"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { PasswordVerification } from "@/components/password-verification";
import { Button } from "@/components/ui/button";

import { SettlementDetail } from "../[id]/_components/settlement-detail";

interface SettlementDetailContentProps {
  settlementId: string;
  initialVerified: boolean;
}

export function SettlementDetailContent({ settlementId, initialVerified }: SettlementDetailContentProps) {
  const router = useRouter();

  if (!initialVerified) {
    return (
      <PasswordVerification
        title="비밀번호 재확인"
        description="정산관리에 접근하기 위해 비밀번호를 입력해주세요."
        page="settlements"
        onVerified={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2 sm:mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        이전
      </Button>

      <SettlementDetail settlementId={settlementId} />
    </div>
  );
}
