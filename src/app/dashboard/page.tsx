'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Home, Briefcase, User, Users2, Activity, Shield, PersonStanding, Baby, GraduationCap, Building } from "lucide-react";
import { mockResidents } from "@/lib/data";
import { mockEvents, mockFeedbacks } from "@/lib/data";
import { ResidentGrowthChart } from "@/components/resident-growth-chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Resident } from "@/lib/types";
import { format } from 'date-fns';


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

type AgeGroup = 'children' | 'adolescents' | 'youth' | 'elderly' | null;

export default function DashboardPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const permanentResidents = mockResidents.filter(r => r.residenceType === 'Thường trú').length;
  const temporaryResidents = mockResidents.filter(r => r.residenceType === 'Tạm trú').length;

  const ageGroups = {
    children: mockResidents.filter(r => getAge(r.dob) < 15),
    adolescents: mockResidents.filter(r => getAge(r.dob) >= 15 && getAge(r.dob) <= 17),
    youth: mockResidents.filter(r => getAge(r.dob) >= 18 && getAge(r.dob) <= 35),
    elderly: mockResidents.filter(r => getAge(r.dob) >= 60),
  };

  const ageGroupDetails: Record<NonNullable<AgeGroup>, { title: string; icon: React.ReactNode; data: Resident[] }> = {
    children: { title: "Thiếu nhi (dưới 15)", icon: <Baby className="h-4 w-4 text-muted-foreground" />, data: ageGroups.children },
    adolescents: { title: "Vị thành niên (15-17)", icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />, data: ageGroups.adolescents },
    youth: { title: "Thanh niên (18-35)", icon: <PersonStanding className="h-4 w-4 text-muted-foreground" />, data: ageGroups.youth },
    elderly: { title: "Người cao tuổi (60+)", icon: <Home className="h-4 w-4 text-muted-foreground" />, data: ageGroups.elderly },
  };

  const handleCardClick = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
        setSelectedAgeGroup(null);
    }
  };

  const renderResidentList = () => {
    if (!selectedAgeGroup) return null;

    const details = ageGroupDetails[selectedAgeGroup];

    return (
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Danh sách cư dân: {details.title}</DialogTitle>
            <DialogDescription>
              Hiện có {details.data.length} cư dân trong nhóm tuổi này.
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
                    {details.data.length > 0 ? (
                        details.data.map((resident) => (
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
            <div className="text-2xl font-bold">{permanentResidents}</div>
            <p className="text-xs text-muted-foreground">Cư dân ổn định</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm trú</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{temporaryResidents}</div>
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

       <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Thống kê Dân số</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(ageGroupDetails) as Array<NonNullable<AgeGroup>>).map(key => {
                const group = ageGroupDetails[key];
                return (
                    <Card key={key} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleCardClick(key)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{group.title}</CardTitle>
                            {group.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{group.data.length}</div>
                            <p className="text-xs text-muted-foreground">người</p>
                        </CardContent>
                    </Card>
                )
            })}
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
