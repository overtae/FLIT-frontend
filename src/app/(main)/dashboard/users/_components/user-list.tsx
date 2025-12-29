"use client";

import { useState, useMemo, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";
import { isSameDay } from "date-fns";
import { Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Input } from "@/components/ui/input";
import { Subtitle } from "@/components/ui/subtitle";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useFilteredPagination } from "@/hooks/use-filtered-pagination";
import { getUsers, getSecederUsers } from "@/service/user.service";
import type { User, SecederUser } from "@/types/user.type";

import { getUserColumns } from "./user-columns";
import { UserDetailModal } from "./user-detail-modal";
import { UserFilter } from "./user-filter";

interface UserListProps {
  category?: string;
}

export function UserList({ category = "all" }: UserListProps) {
  const searchParams = useSearchParams();
  const urlPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) - 1 : 0;
  }, [searchParams]);
  const urlPageSize = useMemo(() => {
    const pageSizeParam = searchParams.get("pageSize");
    return pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
  }, [searchParams]);

  const [allUsers, setAllUsers] = useState<(User | SecederUser)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        if (category === "seceder") {
          const users = await getSecederUsers();
          setAllUsers(users);
        } else {
          const users = await getUsers();
          setAllUsers(users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [category]);

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const columns = useMemo(() => getUserColumns(handleViewDetail), []);

  const filterFn = useMemo(
    () => (user: User | SecederUser) => {
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          user.name.toLowerCase().includes(searchLower) ||
          user.nickname.toLowerCase().includes(searchLower) ||
          ("loginId" in user && user.loginId.toLowerCase().includes(searchLower)) ||
          ("mail" in user && user.mail.toLowerCase().includes(searchLower)) ||
          ("phoneNumber" in user && user.phoneNumber.includes(search));
        if (!matchesSearch) return false;
      }

      if (category !== "seceder" && selectedGrades.length > 0) {
        if ("grade" in user) {
          const userGradeUpper = user.grade.toUpperCase();
          if (!selectedGrades.includes(userGradeUpper)) {
            return false;
          }
        }
      }

      if (selectedDate) {
        if (category === "seceder") {
          if ("secedeDate" in user) {
            const date = new Date(user.secedeDate);
            if (!isSameDay(date, selectedDate)) {
              return false;
            }
          }
        } else {
          if ("joinDate" in user) {
            const date = new Date(user.joinDate);
            if (!isSameDay(date, selectedDate)) {
              return false;
            }
          }
        }
      }

      return true;
    },
    [search, selectedGrades, selectedDate, category],
  );

  const { paginatedData, pageCount, pageIndex, pageSize, setPageIndex, setPageSize, resetPagination } =
    useFilteredPagination({
      data: allUsers,
      filterFn,
      initialPageIndex: urlPage,
      initialPageSize: urlPageSize,
    });

  useEffect(() => {
    setPageIndex(urlPage);
  }, [setPageIndex, urlPage]);

  useEffect(() => {
    setPageSize(urlPageSize);
  }, [setPageSize, urlPageSize]);

  const { table } = useDataTableInstance({
    data: paginatedData as User[],
    columns: columns,
    getRowId: (row) => row.userId.toString(),
    manualPagination: true,
    pageCount,
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  useEffect(() => {
    table.setPagination({ pageIndex, pageSize });
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
          <Subtitle>User List</Subtitle>
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Input
                placeholder=""
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPagination();
                }}
                className="h-9 rounded-full pr-10 pl-4"
              />
              <Search className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
            </div>
            <UserFilter
              category={category}
              selectedGrades={selectedGrades}
              onGradesChange={(grades) => {
                setSelectedGrades(grades);
                resetPagination();
              }}
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
                resetPagination();
              }}
            />
          </div>
        </div>
        <div className="flex-1 rounded-md">
          <DataTable table={table} columns={columns} />
        </div>
        <div className="flex justify-center py-4">
          <DataTablePagination table={table} />
        </div>
      </div>

      <UserDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} user={selectedUser} category={category} />
    </>
  );
}
