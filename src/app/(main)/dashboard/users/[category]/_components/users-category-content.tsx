"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PasswordVerification } from "@/components/password-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserList } from "../../_components/user-list";
import { UserOverview } from "../../_components/user-overview";

const validCategories = ["all", "customer", "shop", "florist", "seceder"];
const PAGE_NAME = "users";

interface UsersCategoryContentProps {
  category: string;
  initialVerified: boolean;
}

export function UsersCategoryContent({ category, initialVerified }: UsersCategoryContentProps) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(initialVerified);

  useEffect(() => {
    if (category && !validCategories.includes(category)) {
      router.replace("/dashboard/users");
    }
  }, [category, router]);

  if (!category || !validCategories.includes(category)) {
    return null;
  }

  if (!isVerified) {
    return (
      <PasswordVerification
        title="비밀번호 재확인"
        description="유저관리에 접근하기 위해 비밀번호를 입력해주세요."
        page="users"
        onVerified={() => setIsVerified(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {category === "seceder" && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 h-auto gap-8 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="relative h-auto w-24 border-0 bg-transparent px-0 pt-2 pb-0 text-xl font-bold text-gray-400 shadow-none before:absolute before:top-0 before:right-0 before:left-0 before:h-1 before:bg-gray-500 before:opacity-0 before:content-[''] data-[state=active]:bg-transparent data-[state=active]:text-rose-500 data-[state=active]:shadow-none data-[state=active]:before:opacity-100"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="customer"
              className="relative h-auto border-0 bg-transparent px-0 pt-2 pb-0 text-xl font-bold text-gray-400 shadow-none before:absolute before:top-0 before:right-0 before:left-0 before:h-1 before:bg-gray-500 before:opacity-0 before:content-[''] data-[state=active]:bg-transparent data-[state=active]:text-rose-500 data-[state=active]:shadow-none data-[state=active]:before:opacity-100"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="shop"
              className="relative h-auto border-0 bg-transparent px-0 pt-2 pb-0 text-xl font-bold text-gray-400 shadow-none before:absolute before:top-0 before:right-0 before:left-0 before:h-1 before:bg-gray-500 before:opacity-0 before:content-[''] data-[state=active]:bg-transparent data-[state=active]:text-rose-500 data-[state=active]:shadow-none data-[state=active]:before:opacity-100"
            >
              Shop
            </TabsTrigger>
            <TabsTrigger
              value="florist"
              className="relative h-auto border-0 bg-transparent px-0 pt-2 pb-0 text-xl font-bold text-gray-400 shadow-none before:absolute before:top-0 before:right-0 before:left-0 before:h-1 before:bg-gray-500 before:opacity-0 before:content-[''] data-[state=active]:bg-transparent data-[state=active]:text-rose-500 data-[state=active]:shadow-none data-[state=active]:before:opacity-100"
            >
              Florist
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <UserOverview category="all" />
          </TabsContent>
          <TabsContent value="customer">
            <UserOverview category="customer" />
          </TabsContent>
          <TabsContent value="shop">
            <UserOverview category="shop" />
          </TabsContent>
          <TabsContent value="florist">
            <UserOverview category="florist" />
          </TabsContent>
        </Tabs>
      )}
      <UserOverview category={category} />
      {category !== "all" && category !== "seceder" && <UserList category={category} />}
    </div>
  );
}
