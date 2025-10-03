'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Home, Briefcase, User, Users2, Activity, Shield, PersonStanding, Baby, GraduationCap, Building, FileDown } from "lucide-react";
import { mockResidents } from "@/lib/data";
import { mockEvents, mockFeedbacks } from "@/lib/data";
import { ResidentGrowthChart } from "@/components/resident-growth-chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Resident } from "@/lib/types";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const getAge = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

type AgeGroup = 'children' | 'adolescents' | 'youth' | 'elderly';
type ResidenceType = 'Thường trú' | 'Tạm trú';

interface SelectedGroup {
    title: string;
    data: Resident[];
}

export default function DashboardPage() {
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const permanentResidents = mockResidents.filter(r => r.residenceType === 'Thường trú');
  const temporaryResidents = mockResidents.filter(r => r.residenceType === 'Tạm trú');

  const createAgeGroups = (residents: Resident[]) => ({
    children: residents.filter(r => getAge(r.dob) < 15),
    adolescents: residents.filter(r => getAge(r.dob) >= 15 && getAge(r.dob) <= 17),
    youth: residents.filter(r => getAge(r.dob) >= 18 && getAge(r.dob) <= 35),
    elderly: residents.filter(r => getAge(r.dob) >= 60),
  });

  const permanentAgeGroups = createAgeGroups(permanentResidents);
  const temporaryAgeGroups = createAgeGroups(temporaryResidents);

  const ageGroupDetailsConfig: Record<AgeGroup, { title: string; icon: React.ReactNode; }> = {
    children: { title: "Thiếu nhi (dưới 15)", icon: <Baby className="h-4 w-4 text-muted-foreground" /> },
    adolescents: { title: "Vị thành niên (15-17)", icon: <GraduationCap className="h-4 w-4 text-muted-foreground" /> },
    youth: { title: "Thanh niên (18-35)", icon: <PersonStanding className="h-4 w-4 text-muted-foreground" /> },
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
    // This is a placeholder for the actual Excel download logic.
    // In a real app, you'd use a library like 'xlsx' or a server endpoint.
    if (!selectedGroup) return;

    const headers = ["ID", "Tên", "Ngày sinh", "Địa chỉ", "Quan hệ", "Số điện thoại", "Email", "Loại cư trú", "Ngày tham gia"];
    const dataToExport = selectedGroup.data.map(resident => [
        resident.id,
        resident.name,
        resident.dob,
        resident.address,
        resident.relationship,
        resident.phone,
        resident.email,
        resident.residenceType,
        resident.joinedDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...dataToExport.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedGroup.title.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                            <TableCell>{format(new Date(resident.dob), 'dd/MM/yyyy')}</TableCell>
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
            <div className="text-2xl font-bold">{mockResidents.length}</div>
            <p className="text-xs text-muted-foreground">+2 mới trong tháng này</p>
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

       <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-1">Thống kê Nhân khẩu Thường trú</h2>
            <p className="text-sm text-muted-foreground">Phân loại dân số theo độ tuổi cho các cư dân thường trú.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                {renderAgeGroupCards(permanentAgeGroups, "Thường trú")}
            </div>
        </div>
        <Separator />
         <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline mb-1">Thống kê Nhân khẩu Tạm trú</h2>
            <p className="text-sm text-muted-foreground">Phân loại dân số theo độ tuổi cho các cư dân tạm trú.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                {renderAgeGroupCards(temporaryAgeGroups, "Tạm trú")}
            </div>
        </div>
      </div>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Tăng trưởng cư dân</CardTitle>
        </CardHeader>
        <CardContent>
          <ResidentGrowthChart />
        </CardContent>
      </Card>
      
      {renderResidentList()}
    </div>
  );
}
