'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AddResidentDialog } from '@/components/add-resident-dialog';
import { format } from 'date-fns';
import type { Resident } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getResidents } from '@/lib/data';
import { deleteAllResidents } from '@/actions/residents';

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [residentToEdit, setResidentToEdit] = useState<Resident | undefined>(undefined);
  const [residentToDelete, setResidentToDelete] = useState<Resident | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [isConfirmDeleteAllDialogOpen, setConfirmDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    const fetchResidents = async () => {
      const data = await getResidents();
      setResidents(data);
    };
    fetchResidents();
  }, []);

  const handleEdit = (resident: Resident) => {
    setResidentToEdit(resident);
    setAddDialogOpen(true);
  };
  
  const handleDeleteConfirm = (resident: Resident) => {
    setResidentToDelete(resident);
    setConfirmDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (residentToDelete) {
      setResidents(residents.filter(r => r.id !== residentToDelete.id));
      setResidentToDelete(null);
      setConfirmDeleteDialogOpen(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      const result = await deleteAllResidents();
      if (result.success) {
        setResidents([]);
        setConfirmDeleteAllDialogOpen(false);
        // Show success message
        alert('Đã xóa toàn bộ dân cư thành công!');
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert(`Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setIsDeletingAll(false);
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    setAddDialogOpen(open);
    if (!open) {
        setResidentToEdit(undefined);
    }
  }


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Quản lý Cư dân</h1>
        <p className="text-muted-foreground">Xem, thêm, sửa, và xóa thông tin cư dân.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Danh sách Cư dân</CardTitle>
            <CardDescription>Hiện có {residents.length} cư dân trong khu phố.</CardDescription>
          </div>
          <div className="flex gap-2">
            <AddResidentDialog 
              open={isAddDialogOpen} 
              onOpenChange={handleDialogClose}
              residentToEdit={residentToEdit}
            >
              <Button onClick={() => setAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm Cư dân
              </Button>
            </AddResidentDialog>
            <Button 
              variant="destructive" 
              onClick={() => setConfirmDeleteAllDialogOpen(true)}
              disabled={residents.length === 0}
            >
              <X className="mr-2 h-4 w-4" />
              Xóa toàn bộ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead className="hidden sm:table-cell">Ngày sinh</TableHead>
                <TableHead className="hidden lg:table-cell">Địa chỉ</TableHead>
                <TableHead className="hidden md:table-cell">Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Cư trú</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents.map((resident) => (
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
                  <TableCell className="hidden sm:table-cell">{resident.dob}</TableCell>
                  <TableCell className="hidden lg:table-cell">{resident.address}</TableCell>
                  <TableCell className="hidden md:table-cell">{resident.phone}</TableCell>
                  <TableCell>
                     <Badge variant={resident.relationship === 'Chủ hộ' ? 'default' : 'secondary'}>
                        {resident.relationship}
                     </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={resident.residenceType === 'Thường trú' ? 'outline' : 'secondary'}>
                      {resident.residenceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(resident)}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteConfirm(resident)}>Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn cư dân
              <span className="font-bold"> {residentToDelete?.name} </span>
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={isConfirmDeleteAllDialogOpen} onOpenChange={setConfirmDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa toàn bộ dân cư?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa toàn bộ {residents.length} cư dân? 
              Hành động này không thể được hoàn tác và sẽ xóa vĩnh viễn tất cả dữ liệu cư dân khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAll}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAll} 
              disabled={isDeletingAll}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingAll ? 'Đang xóa...' : 'Xóa toàn bộ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
