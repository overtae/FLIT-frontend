import { getPageVerification } from "@/lib/api/client";

import { UsersContent } from "./_components/users-content";

export default async function UsersPage() {
  const isVerified = await getPageVerification("users");

  return <UsersContent initialVerified={isVerified} />;
}
