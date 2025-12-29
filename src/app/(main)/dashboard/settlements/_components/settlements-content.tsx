"use client";

import { PasswordVerificationProvider } from "@/components/providers/password-verification-provider";

import { SettlementList } from "./settlement-list";

interface SettlementsContentProps {
  initialVerified: boolean;
}

export function SettlementsContent({ initialVerified }: SettlementsContentProps) {
  return (
    <PasswordVerificationProvider initialVerified={initialVerified}>
      <div className="space-y-6">
        <SettlementList />
      </div>
    </PasswordVerificationProvider>
  );
}
