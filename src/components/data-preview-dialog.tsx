'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle, Upload } from 'lucide-react';
import type { Resident } from '@/lib/types';

interface DataPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Resident[];
  onConfirm: () => void;
  isLoading?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function DataPreviewDialog({ 
  open, 
  onOpenChange, 
  data, 
  onConfirm, 
  isLoading = false 
}: DataPreviewDialogProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      try {
        const results = data.map(validateResidentData);
        setValidationResults(results);
      } catch (error) {
        console.error('Error validating resident data:', error);
        setValidationResults([]);
      }
    } else {
      setValidationResults([]);
    }
  }, [data]);

  const validCount = validationResults.filter(r => r && r.isValid).length;
  const invalidCount = validationResults.filter(r => r && !r.isValid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Xem trước dữ liệu dân cư
          </DialogTitle>
          <DialogDescription>
            Kiểm tra và xác nhận dữ liệu trước khi lưu vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">Hợp lệ: {validCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="font-medium">Lỗi: {invalidCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Tổng: {data.length}</span>
            </div>
          </div>

          {/* Data Table */}
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Quan hệ</TableHead>
                  <TableHead>Loại cư trú</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((resident, index) => {
                  const validation = validationResults[index];
                  const isValid = validation?.isValid ?? false;
                  return (
                    <TableRow key={index} className={isValid ? '' : 'bg-red-50'}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{resident.name}</TableCell>
                      <TableCell>{resident.dob}</TableCell>
                      <TableCell className="max-w-48 truncate">{resident.address}</TableCell>
                      <TableCell>{resident.phone}</TableCell>
                      <TableCell>{resident.email || '-'}</TableCell>
                      <TableCell>{resident.relationship}</TableCell>
                      <TableCell>{resident.residenceType}</TableCell>
                      <TableCell>{resident.joinedDate}</TableCell>
                      <TableCell>
                        {isValid ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Hợp lệ
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Lỗi
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Error Details */}
          {invalidCount > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-700">Chi tiết lỗi:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {validationResults.map((result, index) => (
                  result && !result.isValid ? (
                    <div key={index} className="text-sm text-red-600 p-2 bg-red-50 rounded">
                      <strong>Dòng {index + 1}:</strong> {result.errors.join(', ')}
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={invalidCount > 0 || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Lưu dữ liệu ({validCount} dòng)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Validation function
function validateResidentData(resident: Resident): ValidationResult {
  try {
    const errors: string[] = [];

    // Check if resident is valid
    if (!resident || typeof resident !== 'object') {
      return {
        isValid: false,
        errors: ['Dữ liệu cư dân không hợp lệ']
      };
    }

    // Required fields
    if (!resident.name?.trim()) errors.push('Họ và tên không được để trống');
    if (!resident.dob?.trim()) errors.push('Ngày sinh không được để trống');
    if (!resident.address?.trim()) errors.push('Địa chỉ không được để trống');
    if (!resident.phone?.trim()) errors.push('Số điện thoại không được để trống');
    if (!resident.relationship?.trim()) errors.push('Quan hệ không được để trống');
    if (!resident.residenceType?.trim()) errors.push('Loại cư trú không được để trống');
    if (!resident.joinedDate?.trim()) errors.push('Ngày tham gia không được để trống');

    // Date format validation
    if (resident.dob && !isValidDate(resident.dob)) {
      errors.push('Ngày sinh không đúng định dạng DD/MM/YYYY');
    }
    if (resident.joinedDate && !isValidDate(resident.joinedDate)) {
      errors.push('Ngày tham gia không đúng định dạng DD/MM/YYYY');
    }

    // Relationship validation
    if (resident.relationship && !['Chủ hộ', 'Thành viên'].includes(resident.relationship)) {
      errors.push('Quan hệ phải là "Chủ hộ" hoặc "Thành viên"');
    }

    // Residence type validation
    if (resident.residenceType && !['Thường trú', 'Tạm trú'].includes(resident.residenceType)) {
      errors.push('Loại cư trú phải là "Thường trú" hoặc "Tạm trú"');
    }

    // Email validation
    if (resident.email && !isValidEmail(resident.email)) {
      errors.push('Email không đúng định dạng');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error('Error in validateResidentData:', error);
    return {
      isValid: false,
      errors: ['Lỗi xử lý dữ liệu cư dân']
    };
  }
}

function isValidDate(dateString: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  if (!match) return false;

  const [, day, month, year] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.getDate() === parseInt(day) &&
         date.getMonth() === parseInt(month) - 1 &&
         date.getFullYear() === parseInt(year);
}

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
