"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PasswordVerification } from "@/components/password-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserList } from "../../_components/user-list";
import { UserOverview } from "../../_components/user-overview";

const validCategories = ["all", "customer", "shop", "florist", "seceder"];

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
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="florist">Florist</TabsTrigger>
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
      {category !== "seceder" && <UserOverview category={category} />}
      {category !== "all" && category !== "seceder" && <UserList category={category} />}
    </div>
  );
}
