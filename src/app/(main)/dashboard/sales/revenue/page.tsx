import { getPageVerification } from "@/lib/api/client";

import { RevenueContent } from "../_components/revenue-content";

export default async function RevenuePage() {
  const isVerified = await getPageVerification("sales");

  return <RevenueContent initialVerified={isVerified} />;
}
