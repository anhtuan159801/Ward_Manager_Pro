'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Home, Briefcase, User as UserIcon, Users2, Activity, Shield, PersonStanding, Baby, GraduationCap, Building, FileDown } from "lucide-react";
import { ResidentGrowthChart } from "@/components/resident-growth-chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Resident, Event, Feedback } from "@/lib/types";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const getAge = (dob: string) => {
  const today = new Date();
  // Parse DD/MM/YYYY format
  const parts = dob.split('/');
  if (parts.length !== 3) return 0;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  
  const birthDate = new Date(year, month, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

type AgeGroup = 'children' | 'adolescents' | 'youth' | 'militaryService' | 'elderly';
type ResidenceType = 'Thường trú' | 'Tạm trú';

interface SelectedGroup {
    title: string;
    data: Resident[];
}

interface DashboardClientProps {
  residents: Resident[];
  events: Event[];
  feedbacks: Feedback[];
}

export function DashboardClient({ residents, events, feedbacks }: DashboardClientProps) {
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const permanentResidents = residents.filter(r => r.residenceType === 'Thường trú');
  const temporaryResidents = residents.filter(r => r.residenceType === 'Tạm trú');

  const createAgeGroups = (residentsData: Resident[]) => ({
    children: residentsData.filter(r => getAge(r.dob) < 15),
    adolescents: residentsData.filter(r => getAge(r.dob) >= 15 && getAge(r.dob) <= 17),
    youth: residentsData.filter(r => getAge(r.dob) >= 18 && getAge(r.dob) <= 35),
    militaryService: residentsData.filter(r => getAge(r.dob) >= 18 && getAge(r.dob) <= 27),
    elderly: residentsData.filter(r => getAge(r.dob) >= 60),
  });

  const permanentAgeGroups = createAgeGroups(permanentResidents);
  const temporaryAgeGroups = createAgeGroups(temporaryResidents);

  const ageGroupDetailsConfig: Record<AgeGroup, { title: string; icon: React.ReactNode; }> = {
    children: { title: "Thiếu nhi (dưới 15)", icon: <Baby className="h-4 w-4 text-muted-foreground" /> },
    adolescents: { title: "Vị thành niên (15-17)", icon: <GraduationCap className="h-4 w-4 text-muted-foreground" /> },
    youth: { title: "Thanh niên (18-35)", icon: <PersonStanding className="h-4 w-4 text-muted-foreground" /> },
    militaryService: { title: "Độ tuổi nghĩa vụ (18-27)", icon: <Shield className="h-4 w-4 text-muted-foreground" /> },
    elderly: { title: "Người cao tuổi (60+)", icon: <Home className="h-4 w-4 text-muted-foreground" /> },
  };
  
  const handleCardClick = (title: string, data: Resident[]) => {
    setSelectedGroup({ title, data });
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
        setSelectedGroup(null);
    }
  };

  const handleDownloadExcel = () => {
    if (!selectedGroup) return;
  
    const headers = ["ID", "Tên", "Ngày sinh", "Địa chỉ", "Quan hệ", "Số điện thoại", "Email", "Loại cư trú", "Ngày tham gia"];
    const dataToExport = selectedGroup.data.map(resident => [
        resident.id,
        resident.name,
        resident.dob,
        resident.address,
        resident.relationship,
        `'${resident.phone}`, // Prevent excel from converting to number
        resident.email,
        resident.residenceType,
        resident.joinedDate
    ].map(field => `"${String(field).replace(/"/g, '""')}"`)); // Quote all fields
  
    const csvRows = [headers.join(","), ...dataToExport.map(row => row.join(","))];
    const csvContent = csvRows.join("\n");
    
    // Add BOM for UTF-8 support in Excel
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedGroup.title.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const renderAgeGroupCards = (groups: ReturnType<typeof createAgeGroups>, residenceType: ResidenceType) => {
    return (Object.keys(groups) as AgeGroup[]).map(key => {
        const groupConfig = ageGroupDetailsConfig[key];
        const data = groups[key];
        const title = `${groupConfig.title} (${residenceType})`;
        return (
            <Card key={`${residenceType}-${key}`} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleCardClick(title, data)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{groupConfig.title}</CardTitle>
                    {groupConfig.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.length}</div>
                    <p className="text-xs text-muted-foreground">người</p>
                </CardContent>
            </Card>
        )
    });
  };


  const renderResidentList = () => {
    if (!selectedGroup) return null;

    return (
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Danh sách cư dân: {selectedGroup.title}</DialogTitle>
            <DialogDescription className="flex justify-between items-center pr-6">
              <span>Hiện có {selectedGroup.data.length} cư dân trong nhóm này.</span>
               <Button variant="outline" size="sm" onClick={handleDownloadExcel}>
                <FileDown className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </DialogDescription>
          </DialogHeader>
           <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead>Ngày sinh</TableHead>
                        <TableHead>Địa chỉ</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {selectedGroup.data.length > 0 ? (
                        selectedGroup.data.map((resident) => (
                        <TableRow key={resident.id}>
                            <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                <AvatarImage src={resident.avatarUrl} alt={resident.name} />
                                <AvatarFallback>{resident.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{resident.name}</div>
                            </div>
                            </TableCell>
                            <TableCell>{resident.dob}</TableCell>
                            <TableCell>{resident.address}</TableCell>
                            <TableCell>{resident.phone}</TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="text-center">Không có cư dân nào trong nhóm này.</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
        </DialogContent>
      </Dialog>
    );
  };


  // Accurate summaries
  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();
  const countNewResidentsThisMonth = residents.filter(r => {
    const parts = r.joinedDate?.split('/') || [];
    if (parts.length !== 3) return false;
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    return !Number.isNaN(d) && m === thisMonth && y === thisYear;
  }).length;

  const upcoming7Days = events.filter(e => {
    // Assume e.date is ISO or parseable
    const dt = new Date(e.date);
    if (Number.isNaN(dt.getTime())) return false;
    const diff = dt.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  }).length;

  const newFeedbacksToday = feedbacks.filter(f => {
    const dt = new Date(f.timestamp);
    if (Number.isNaN(dt.getTime())) return false;
    return dt.getDate() === now.getDate() && dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về hoạt động trong khu phố của bạn.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số cư dân</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residents.length}</div>
            <p className="text-xs text-muted-foreground">+{countNewResidentsThisMonth} mới trong tháng này</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thường trú</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permanentResidents.length}</div>
            <p className="text-xs text-muted-foreground">Cư dân ổn định</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm trú</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{temporaryResidents.length}</div>
            <p className="text-xs text-muted-foreground">Cư dân ngắn hạn</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sự kiện sắp tới</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">{upcoming7Days} sự kiện trong 7 ngày tới</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phản ánh mới</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
            <p className="text-xs text-muted-foreground">+{newFeedbacksToday} mới hôm nay</p>
          </CardContent>
        </Card>
      </div>

       <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-1">Thống kê Nhân khẩu Thường trú</h2>
            <p className="text-sm text-muted-foreground">Phân loại dân số theo độ tuổi cho các cư dân thường trú.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-4">
                {renderAgeGroupCards(permanentAgeGroups, "Thường trú")}
            </div>
        </div>
        <Separator />
         <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-1">Thống kê Nhân khẩu Tạm trú</h2>
            <p className="text-sm text-muted-foreground">Phân loại dân số theo độ tuổi cho các cư dân tạm trú.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-4">
                {renderAgeGroupCards(temporaryAgeGroups, "Tạm trú")}
            </div>
        </div>
      </div>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Tăng trưởng cư dân</CardTitle>
        </CardHeader>
        <CardContent>
          <ResidentGrowthChart residents={residents} />
        </CardContent>
      </Card>
      
      {renderResidentList()}
    </div>
  );
}
