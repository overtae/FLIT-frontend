import { getPageVerification } from "@/lib/api/client";

import { OrdersContent } from "../_components/orders-content";

export default async function OrdersPage() {
  const isVerified = await getPageVerification("sales");

  return <OrdersContent initialVerified={isVerified} />;
}
