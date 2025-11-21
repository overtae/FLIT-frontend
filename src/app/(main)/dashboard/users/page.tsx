"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserList } from "./_components/user-list";
import { UserOverview } from "./_components/user-overview";

export default function UsersPage() {
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">유저관리</h1>
        <p className="text-muted-foreground mt-2">유저 정보를 관리하세요</p>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 재확인</DialogTitle>
            <DialogDescription>유저관리에 접근하기 위해 비밀번호를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setShowPasswordDialog(false);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="비밀번호를 입력하세요" required />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                취소
              </Button>
              <Button type="submit">확인</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="list">User List</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <UserOverview />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <UserList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
