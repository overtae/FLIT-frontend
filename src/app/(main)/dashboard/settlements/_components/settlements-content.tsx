"use client";

import { useState } from "react";

import { PasswordVerification } from "@/components/password-verification";

import { SettlementList } from "./settlement-list";

interface SettlementsContentProps {
  initialVerified: boolean;
}

export function SettlementsContent({ initialVerified }: SettlementsContentProps) {
  const [isVerified] = useState(initialVerified);

  if (!isVerified) {
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
    <div className="space-y-6">
      <SettlementList />
    </div>
  );
}
