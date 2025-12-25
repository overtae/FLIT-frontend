import { getPageVerification } from "@/lib/api/client";

import { CustomersContent } from "../_components/customers-content";

export default async function CustomersPage() {
  const isVerified = await getPageVerification("sales");

  return <CustomersContent initialVerified={isVerified} />;
}
