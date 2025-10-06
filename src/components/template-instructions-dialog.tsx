'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateInstructionsDialogProps {
  children?: React.ReactNode;
}

export function TemplateInstructionsDialog({ children }: TemplateInstructionsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <HelpCircle className="w-3 h-3 mr-1" />
            Hướng dẫn
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Hướng dẫn sử dụng Template Upload Dân cư
          </DialogTitle>
          <DialogDescription>
            Hướng dẫn chi tiết cách sử dụng template để upload danh sách dân cư
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Supported Formats */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Định dạng file được hỗ trợ</h3>
            <div className="flex gap-2">
              <Badge variant="secondary">Excel (.xlsx)</Badge>
              <Badge variant="secondary">Excel (.xls)</Badge>
              <Badge variant="secondary">CSV (.csv)</Badge>
            </div>
          </div>

          {/* Data Structure */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Cấu trúc dữ liệu</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Cột</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Mô tả</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Bắt buộc</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Định dạng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Họ và tên</td>
                    <td className="border border-gray-300 px-3 py-2">Tên đầy đủ của cư dân</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">Text</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Ngày sinh</td>
                    <td className="border border-gray-300 px-3 py-2">Ngày sinh của cư dân</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">DD/MM/YYYY</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Địa chỉ</td>
                    <td className="border border-gray-300 px-3 py-2">Địa chỉ đầy đủ</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">Text</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Số điện thoại</td>
                    <td className="border border-gray-300 px-3 py-2">Số điện thoại liên lạc</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">Số</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Email</td>
                    <td className="border border-gray-300 px-3 py-2">Địa chỉ email</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span className="text-gray-400">-</span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">Email hợp lệ</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Quan hệ</td>
                    <td className="border border-gray-300 px-3 py-2">Quan hệ trong gia đình</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">Chủ hộ / Thành viên</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Loại cư trú</td>
                    <td className="border border-gray-300 px-3 py-2">Loại cư trú</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">Thường trú / Tạm trú</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Ngày tham gia</td>
                    <td className="border border-gray-300 px-3 py-2">Ngày tham gia vào khu phố</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">DD/MM/YYYY</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Avatar URL</td>
                    <td className="border border-gray-300 px-3 py-2">Link ảnh đại diện</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span className="text-gray-400">-</span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">URL hợp lệ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Example Data */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ví dụ dữ liệu mẫu</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`Họ và tên,Ngày sinh,Địa chỉ,Số điện thoại,Email,Quan hệ,Loại cư trú,Ngày tham gia,Avatar URL
Nguyễn Văn An,15/03/1985,123 Đường ABC, Phường XYZ, Quận 1, TP.HCM,0901234567,nguyenvanan@email.com,Chủ hộ,Thường trú,01/01/2020,
Trần Thị Bình,22/07/1990,456 Đường DEF, Phường UVW, Quận 2, TP.HCM,0907654321,tranthibinh@email.com,Thành viên,Thường trú,01/01/2020,`}
              </pre>
            </div>
          </div>

          {/* Important Notes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Lưu ý quan trọng</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-700">Nên làm:</p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Kiểm tra kỹ dữ liệu trước khi upload</li>
                    <li>• Sử dụng đúng định dạng ngày tháng DD/MM/YYYY</li>
                    <li>• Đảm bảo các giá trị quan hệ và loại cư trú chính xác</li>
                    <li>• Lưu file CSV với encoding UTF-8</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-700">Không nên:</p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Thay đổi tên các cột</li>
                    <li>• Sử dụng định dạng ngày tháng khác</li>
                    <li>• Sử dụng các giá trị không được hỗ trợ</li>
                    <li>• Để trống các trường bắt buộc</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Download Templates */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tải template mẫu</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/templates/danh-sach-dan-cu-template.xlsx';
                  link.download = 'danh-sach-dan-cu-template.xlsx';
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Excel Template
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/templates/danh-sach-dan-cu-template.csv';
                  link.download = 'danh-sach-dan-cu-template.csv';
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV Template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
