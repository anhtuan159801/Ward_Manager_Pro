'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, File, X, Download, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TemplateInstructionsDialog } from './template-instructions-dialog';
import { DataPreviewDialog } from './data-preview-dialog';
import { parseExcelFile, parseCsvFile } from '@/lib/file-utils';
import { saveResidents } from '@/actions/residents';
import type { Resident } from '@/lib/types';


type AddResidentDialogProps = {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  residentToEdit?: Resident;
};

export function AddResidentDialog({ children, open, onOpenChange, residentToEdit }: AddResidentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date | undefined>(
      residentToEdit ? new Date(residentToEdit.dob) : undefined
  );
  const [parsedData, setParsedData] = useState<Resident[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (residentToEdit) {
      setDate(new Date(residentToEdit.dob));
      // You can set other form fields here as well
    } else {
      setDate(undefined);
    }
  }, [residentToEdit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ];
      if (selectedFile && allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          variant: 'destructive',
          title: 'Loại tệp không hợp lệ',
          description: 'Vui lòng chọn tệp Excel (.xlsx, .xls) hoặc CSV (.csv).',
        });
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleDownloadTemplate = (format: 'excel' | 'csv') => {
    const filename = format === 'excel' 
      ? 'danh-sach-dan-cu-template.xlsx' 
      : 'danh-sach-dan-cu-template.csv';
    
    const link = document.createElement('a');
    link.href = `/templates/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Tải xuống thành công',
      description: `Đã tải xuống file template ${format.toUpperCase()}`,
    });
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      let result;
      
      if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await parseExcelFile(file);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        result = await parseCsvFile(file);
      } else {
        throw new Error('Định dạng file không được hỗ trợ');
      }

      if (result.success) {
        setParsedData(result.data);
        setShowPreview(true);
        toast({
          title: 'Đọc file thành công',
          description: `Đã đọc được ${result.data.length} dòng dữ liệu`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi đọc file',
          description: result.errors.join(', '),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi xử lý file',
        description: error instanceof Error ? error.message : 'Lỗi không xác định',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveResidents(parsedData);
      
      if (result.success) {
        toast({
          title: 'Lưu thành công',
          description: result.message,
        });
        setShowPreview(false);
        setParsedData([]);
        setFile(null);
        onOpenChange?.(false);
        // Refresh the page or trigger a refetch
        window.location.reload();
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi lưu dữ liệu',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi không xác định',
        description: error instanceof Error ? error.message : 'Lỗi hệ thống',
      });
    } finally {
      setIsSaving(false);
    }
  };

  
  const dialogTitle = residentToEdit ? 'Chỉnh sửa Cư dân' : 'Thêm Cư dân';
  const dialogDescription = residentToEdit ? 'Chỉnh sửa thông tin chi tiết của cư dân.' : 'Chọn phương thức nhập liệu phù hợp.';


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Nhập thủ công</TabsTrigger>
            <TabsTrigger value="upload">Tải lên từ tệp</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Họ và tên
                </Label>
                <Input id="name" defaultValue={residentToEdit?.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ngày sinh</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'col-span-3 justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Địa chỉ
                </Label>
                <Input id="address" defaultValue={residentToEdit?.address} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input id="phone" defaultValue={residentToEdit?.phone} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" type="email" defaultValue={residentToEdit?.email} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Quan hệ</Label>
                <Select defaultValue={residentToEdit?.relationship}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn quan hệ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chủ hộ">Chủ hộ</SelectItem>
                    <SelectItem value="Thành viên">Thành viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Cư trú</Label>
                <Select defaultValue={residentToEdit?.residenceType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn loại cư trú" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thường trú">Thường trú</SelectItem>
                    <SelectItem value="Tạm trú">Tạm trú</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu thông tin</Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="upload">
            <div className="py-4 space-y-4">
              {/* Template Download Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Tải template mẫu</h4>
                  <TemplateInstructionsDialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Hướng dẫn
                    </Button>
                  </TemplateInstructionsDialog>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate('excel')}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Excel (.xlsx)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    CSV (.csv)
                  </Button>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tải lên file dữ liệu</h4>
                <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                  <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} accept=".xlsx, .xls, .csv" />
                  {!file ? (
                    <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <UploadCloud className="w-10 h-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Kéo và thả hoặc{' '}
                        <span className="font-semibold text-primary">chọn tệp</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Hỗ trợ .xlsx, .xls, .csv</p>
                    </Label>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="flex items-center p-4 bg-secondary rounded-lg">
                        <File className="w-8 h-8 text-primary" />
                        <span className="ml-3 text-sm font-medium">{file.name}</span>
                        <Button variant="ghost" size="icon" className="ml-4" onClick={handleRemoveFile}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                disabled={!file || isProcessing}
                onClick={handleFileUpload}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  'Tải lên và xem trước'
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      {/* Data Preview Dialog */}
      <DataPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        data={parsedData}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
      />
    </Dialog>
  );
}
