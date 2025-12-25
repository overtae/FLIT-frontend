import { redirect } from "next/navigation";

import { getPageVerification } from "@/lib/api/client";

import { UsersCategoryContent } from "./_components/users-category-content";

const validCategories = ["all", "customer", "shop", "florist", "seceder"];

interface UsersCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function UsersCategoryPage({ params }: UsersCategoryPageProps) {
  const { category } = await params;

  if (!category || !validCategories.includes(category)) {
    redirect("/dashboard/users");
  }

  const isVerified = await getPageVerification("users");

  return <UsersCategoryContent category={category} initialVerified={isVerified} />;
}
