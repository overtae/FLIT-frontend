import { getPasswordVerified } from "@/lib/api/client";

import { SettlementsContent } from "./_components/settlements-content";

export default async function SettlementsPage() {
  const isVerified = await getPasswordVerified();

  return <SettlementsContent initialVerified={isVerified} />;
}
