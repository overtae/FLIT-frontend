"use client";

import { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { PasswordVerification } from "@/components/password-verification";

const PAGE_CONFIG: Record<string, { title: string; description: string }> = {
  users: {
    title: "비밀번호 재확인",
    description: "유저관리에 접근하기 위해 비밀번호를 입력해주세요.",
  },
  sales: {
    title: "비밀번호 재확인",
    description: "거래관리에 접근하기 위해 비밀번호를 입력해주세요.",
  },
  settlements: {
    title: "비밀번호 재확인",
    description: "정산관리에 접근하기 위해 비밀번호를 입력해주세요.",
  },
};

function getPageKey(pathname: string): string | null {
  if (pathname.startsWith("/dashboard/users")) return "users";
  if (pathname.startsWith("/dashboard/sales")) return "sales";
  if (pathname.startsWith("/dashboard/settlements")) return "settlements";
  return null;
}

interface PasswordVerificationProviderProps {
  children: ReactNode;
  initialVerified: boolean;
}

export function PasswordVerificationProvider({ children, initialVerified }: PasswordVerificationProviderProps) {
  const pathname = usePathname();
  const pageKey = getPageKey(pathname);

  if (!initialVerified && pageKey) {
    const config = PAGE_CONFIG[pageKey];
    return (
      <PasswordVerification
        title={config.title}
        description={config.description}
        page={pageKey}
        onVerified={() => window.location.reload()}
      />
    );
  }

  return <>{children}</>;
}
