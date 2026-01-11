"use client";

import { ReactNode, useEffect, useState } from "react";

import { AccountDropdown } from "@/app/(main)/dashboard/_components/sidebar/account-dropdown";
import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { NotificationPopover } from "@/app/(main)/dashboard/_components/sidebar/notification-popover";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getUserMe } from "@/service/auth.service";
import type { UserMeResponse } from "@/types/auth.type";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/types/preferences/layout";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const sidebarVariant: SidebarVariant = "sidebar";
  const sidebarCollapsible: SidebarCollapsible = "icon";
  const contentLayout: ContentLayout = "full-width";
  const navbarStyle: NavbarStyle = "sticky";

  const [user, setUser] = useState<UserMeResponse>({
    userId: 0,
    nickname: "Guest",
    level: "",
  });

  useEffect(() => {
    getUserMe()
      .then(setUser)
      .catch(() => {
        // 로그인되지 않은 경우 기본값 유지
      });
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        variant={sidebarVariant}
        collapsible={sidebarCollapsible}
        className="top-12! z-40 h-[calc(100vh-3rem)]!"
      />
      <header
        data-navbar-style={navbarStyle}
        className={cn(
          "text-sidebar fixed top-0 right-0 left-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear",
          "data-[navbar-style=sticky]:bg-sidebar-foreground data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:backdrop-blur-md",
          "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
        )}
      >
        <div className="flex w-full items-center justify-end px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <AccountDropdown user={user} />
            <NotificationPopover />
          </div>
        </div>
      </header>
      <SidebarInset data-content-layout={contentLayout} className={cn("mt-12")}>
        <div className="bg-background h-full p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
