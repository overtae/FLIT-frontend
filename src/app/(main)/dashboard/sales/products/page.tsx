import { getPageVerification } from "@/lib/api/client";

import { ProductsContent } from "../_components/products-content";

export default async function ProductsPage() {
  const isVerified = await getPageVerification("sales");

  return <ProductsContent initialVerified={isVerified} />;
}
