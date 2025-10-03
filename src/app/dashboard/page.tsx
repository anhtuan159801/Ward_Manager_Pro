import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, MessageSquare } from "lucide-react";
import { mockResidents, mockEvents, mockFeedbacks } from "@/lib/data";
import { ResidentGrowthChart } from "@/components/resident-growth-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về hoạt động trong khu phố của bạn.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số cư dân</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResidents.length}</div>
            <p className="text-xs text-muted-foreground">+2 mới trong tháng này</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sự kiện sắp tới</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <p className="text-xs text-muted-foreground">1 sự kiện trong tuần tới</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phản ánh mới</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFeedbacks.length}</div>
            <p className="text-xs text-muted-foreground">+3 mới hôm nay</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Tăng trưởng cư dân</CardTitle>
        </CardHeader>
        <CardContent>
          <ResidentGrowthChart />
        </CardContent>
      </Card>

    </div>
  );
}
