"use client";

import { useState } from "react";

import { PasswordVerification } from "@/components/password-verification";

import { SettlementList } from "./_components/settlement-list";

export default function SettlementsPage() {
  const [isVerified, setIsVerified] = useState(false);

  if (!isVerified) {
    return (
      <PasswordVerification
        title="비밀번호 재확인"
        description="정산관리에 접근하기 위해 비밀번호를 입력해주세요."
        onVerified={() => setIsVerified(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">정산관리</h1>
        <p className="text-muted-foreground mt-2">정산 정보를 관리하세요</p>
      </div>

      <SettlementList />
    </div>
  );
}
