"use client";

import { useState, useMemo, useEffect } from "react";

import { Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getUsers } from "@/service/user.service";
import { User } from "@/types/dashboard";

import { getUserColumns } from "./user-columns";
import { UserDetailModal } from "./user-detail-modal";
import { UserFilter } from "./user-filter";
import { UserPagination } from "./user-pagination";

interface UserListProps {
  category?: string;
}

export function UserList({ category }: UserListProps) {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsers({
          category,
          page: pageIndex + 1,
          pageSize,
        });
        setData(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [category, pageIndex, pageSize]);

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns = useMemo(() => getUserColumns(handleViewDetail), []);

  const filteredData = useMemo(() => {
    if (!search) return data;
    const searchLower = search.toLowerCase();
    return data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.nickname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(search),
    );
  }, [data, search]);

  const { table } = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  useEffect(() => {
    const pagination = table.getState().pagination;
    if (pagination.pageIndex !== pageIndex) {
      setPageIndex(pagination.pageIndex);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
  }, [table, pageIndex, pageSize]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

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
