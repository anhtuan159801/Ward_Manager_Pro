# Templates cho Upload Dân cư

Thư mục này chứa các file template mẫu để upload danh sách dân cư vào hệ thống WardPro.

## Các file có sẵn

### 1. Template Excel
- **File**: `danh-sach-dan-cu-template.xlsx`
- **Định dạng**: Excel (.xlsx)
- **Mô tả**: File template Excel với dữ liệu mẫu và định dạng chuẩn

### 2. Template CSV
- **File**: `danh-sach-dan-cu-template.csv`
- **Định dạng**: CSV (.csv)
- **Mô tả**: File template CSV với dữ liệu mẫu và định dạng chuẩn

### 3. Hướng dẫn sử dụng
- **File**: `HUONG-DAN-SU-DUNG-TEMPLATE.md`
- **Mô tả**: Hướng dẫn chi tiết cách sử dụng template

## Cách sử dụng

1. **Tải template**: Sử dụng nút "Tải template mẫu" trong giao diện upload
2. **Điền dữ liệu**: Mở file template và điền thông tin dân cư theo cấu trúc có sẵn
3. **Kiểm tra dữ liệu**: Đảm bảo dữ liệu đúng định dạng và không có lỗi
4. **Upload**: Tải file đã điền lên hệ thống

## Cấu trúc dữ liệu

Template bao gồm các cột sau:

| Cột | Mô tả | Bắt buộc | Định dạng |
|-----|-------|----------|-----------|
| Họ và tên | Tên đầy đủ của cư dân | ✅ | Text |
| Ngày sinh | Ngày sinh của cư dân | ✅ | DD/MM/YYYY |
| Địa chỉ | Địa chỉ đầy đủ | ✅ | Text |
| Số điện thoại | Số điện thoại liên lạc | ✅ | Số |
| Email | Địa chỉ email | ❌ | Email hợp lệ |
| Quan hệ | Quan hệ trong gia đình | ✅ | Chủ hộ / Thành viên |
| Loại cư trú | Loại cư trú | ✅ | Thường trú / Tạm trú |
| Ngày tham gia | Ngày tham gia vào khu phố | ✅ | DD/MM/YYYY |
| Avatar URL | Link ảnh đại diện | ❌ | URL hợp lệ |

## Lưu ý quan trọng

- **Định dạng ngày tháng**: Sử dụng DD/MM/YYYY (ví dụ: 15/03/1985)
- **Quan hệ**: Chỉ sử dụng "Chủ hộ" hoặc "Thành viên"
- **Loại cư trú**: Chỉ sử dụng "Thường trú" hoặc "Tạm trú"
- **File CSV**: Lưu với encoding UTF-8
- **Không thay đổi tên cột**: Giữ nguyên tên các cột trong template

## Hỗ trợ

Nếu gặp vấn đề trong quá trình sử dụng, vui lòng:
1. Kiểm tra lại hướng dẫn sử dụng
2. Liên hệ với bộ phận hỗ trợ kỹ thuật
3. Sử dụng nút "Hướng dẫn" trong giao diện upload để xem hướng dẫn chi tiết
