"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { PasswordVerification } from "@/components/password-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserList } from "../_components/user-list";
import { UserOverview } from "../_components/user-overview";

const validCategories = ["customer", "shop", "florist", "seceder"];

export default function UsersCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [isVerified, setIsVerified] = useState(false);

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
        onVerified={() => setIsVerified(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">유저관리 - {category.toUpperCase()}</h1>
        <p className="text-muted-foreground mt-2">유저 정보를 관리하세요</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="list">User List</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <UserOverview />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <UserList category={category} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
