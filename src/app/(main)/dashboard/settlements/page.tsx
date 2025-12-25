import { getPageVerification } from "@/lib/api/client";

import { SettlementsContent } from "./_components/settlements-content";

export default async function SettlementsPage() {
  const isVerified = await getPageVerification("settlements");

  return <SettlementsContent initialVerified={isVerified} />;
}
