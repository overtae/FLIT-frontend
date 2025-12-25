import { use } from "react";

import { getPageVerification } from "@/lib/api/client";

import { SettlementDetailContent } from "../_components/settlement-detail-content";

export default async function SettlementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isVerified = await getPageVerification("settlements");

  return <SettlementDetailContent settlementId={id} initialVerified={isVerified} />;
}
