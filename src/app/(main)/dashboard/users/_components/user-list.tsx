"use client";

import { useState, useMemo, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Input } from "@/components/ui/input";
import { Subtitle } from "@/components/ui/subtitle";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getUsers } from "@/service/user.service";
import { User } from "@/types/dashboard";

import { getUserColumns } from "./user-columns";
import { UserDetailModal } from "./user-detail-modal";
import { UserFilter } from "./user-filter";

interface UserListProps {
  category?: string;
}

export function UserList({ category }: UserListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageIndex = parseInt(searchParams.get("page") ?? "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const searchValue = searchParams.get("search");
        const gradesValue = searchParams.get("grades");
        const dateValue = searchParams.get("date");

        const response = await getUsers({
          category,
          page: pageIndex + 1,
          pageSize,
          search: searchValue ?? undefined,
          grades: gradesValue ?? undefined,
          date: dateValue ?? undefined,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pageIndex, pageSize, searchParams.toString()]);

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns = useMemo(() => getUserColumns(handleViewDetail), []);

  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  const { table } = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

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
          <Subtitle>User List</Subtitle>
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Input
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const params = new URLSearchParams(searchParams.toString());
                    if (search.trim()) {
                      params.set("search", search.trim());
                    } else {
                      params.delete("search");
                    }
                    router.push(`?${params.toString()}`, { scroll: false });
                  }
                }}
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
          <DataTablePagination table={table} />
        </div>
      </div>

      <UserDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} user={selectedUser} />
    </>
  );
}
