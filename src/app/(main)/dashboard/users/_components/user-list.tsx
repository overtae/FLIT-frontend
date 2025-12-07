"use client";

import { useState, useMemo } from "react";

import { Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { getUserColumns, User } from "./user-columns";
import { UserDetailModal } from "./user-detail-modal";
import { UserFilter } from "./user-filter";
import { UserPagination } from "./user-pagination";

const mockUsers: User[] = [
  {
    id: "1",
    category: "customer",
    grade: "Green",
    name: "전수민",
    nickname: "오후(jeon)",
    email: "jeon@gmail.com",
    address: "서울시 노원구 동일로 174길 27",
    phone: "010-0000-0000",
    lastAccessDate: "2022.11.07",
    joinDate: "2022.10.24",
  },
  {
    id: "2",
    category: "shop",
    grade: "Flinney",
    name: "아이와",
    nickname: "아이와(Amihwa)",
    email: "amihwa@gmail.com",
    address: "서울시 노원구 동일로 174길 27",
    phone: "010-0000-0000",
    lastAccessDate: "2022.11.07",
    joinDate: "2022.11.07",
  },
  {
    id: "3",
    category: "florist",
    grade: "Silver",
    name: "이플로리스트",
    nickname: "florist123",
    email: "florist@example.com",
    address: "서울시 마포구",
    phone: "010-3456-7890",
    lastAccessDate: "2024-01-13",
    joinDate: "2023-03-01",
  },
  // TODO: category seceder 추가
];

interface UserListProps {
  category?: string;
}

export function UserList({ category }: UserListProps) {
  const [data] = useState<User[]>(() => {
    if (category && category !== "all") {
      return mockUsers.filter((user) => user.category === category);
    }
    return mockUsers;
  });
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns = useMemo(() => getUserColumns(handleViewDetail), []);

  const { table } = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <div className="flex min-h-screen flex-col space-y-4">
        <div className="flex items-center justify-between pt-16">
          <h2 className="text-foreground text-lg font-bold">User List</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Input
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 rounded-full pr-10 pl-4"
              />
              <Search className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
            </div>
            <UserFilter />
          </div>
        </div>
        <div className="flex-1 rounded-md">
          <DataTable table={table} columns={columns} />
        </div>
        <div className="flex justify-center py-4">
          <UserPagination table={table} />
        </div>
      </div>

      <UserDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} user={selectedUser} />
    </>
  );
}
