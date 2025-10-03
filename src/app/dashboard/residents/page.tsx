import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockResidents } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ResidentsPage() {
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
            <CardDescription>Hiện có {mockResidents.length} cư dân trong khu phố.</CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm Cư dân
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead className="hidden lg:table-cell">Địa chỉ</TableHead>
                <TableHead className="hidden md:table-cell">Số điện thoại</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Cư trú</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResidents.map((resident) => (
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
                  <TableCell className="hidden lg:table-cell">{resident.address}</TableCell>
                  <TableCell className="hidden md:table-cell">{resident.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{resident.email}</TableCell>
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
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
