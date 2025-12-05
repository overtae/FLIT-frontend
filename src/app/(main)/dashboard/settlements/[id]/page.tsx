"use client";

import { use } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SettlementDetail } from "./_components/settlement-detail";

export default function SettlementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        이전
      </Button>

      <SettlementDetail settlementId={id} />
    </div>
  );
}
