import { getPageVerification } from "@/lib/api/client";

import { SalesContent } from "./_components/sales-content";

export default async function SalesPage() {
  const isVerified = await getPageVerification("sales");

  return <SalesContent initialVerified={isVerified} />;
}
