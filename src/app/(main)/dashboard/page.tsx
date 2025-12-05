import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rootUser } from "@/data/users";

import { Notifications } from "./_components/home/notifications";
import { ScheduleCalendar } from "./_components/home/schedule-calendar";
import { ScheduleTimestamp } from "./_components/home/schedule-timestamp";
import { UserInfo } from "./_components/home/user-info";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-xl font-bold">홈</h1>
        <p className="text-secondary-foreground mt-2 text-sm">대시보드에 오신 것을 환영합니다</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">캘린더 뷰</TabsTrigger>
              <TabsTrigger value="timestamp">타임스탬프 뷰</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-4">
              <ScheduleCalendar />
            </TabsContent>
            <TabsContent value="timestamp" className="mt-4">
              <ScheduleTimestamp />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <UserInfo user={rootUser} />
          <Notifications />
        </div>
      </div>
    </div>
  );
}
