# Hướng dẫn sử dụng Template Upload Danh sách Dân cư

## Tổng quan
Template này giúp bạn chuẩn bị dữ liệu dân cư để upload vào hệ thống WardPro một cách nhanh chóng và chính xác.

## Các định dạng file được hỗ trợ
- **Excel**: `.xlsx`, `.xls`
- **CSV**: `.csv`

## Cấu trúc dữ liệu

### Các cột bắt buộc:
1. **Họ và tên** (text): Tên đầy đủ của cư dân
2. **Ngày sinh** (date): Định dạng DD/MM/YYYY (ví dụ: 15/03/1985)
3. **Địa chỉ** (text): Địa chỉ đầy đủ của cư dân
4. **Số điện thoại** (text): Số điện thoại liên lạc
5. **Email** (text): Địa chỉ email (có thể để trống)
6. **Quan hệ** (text): Chỉ chấp nhận 2 giá trị:
   - `Chủ hộ`
   - `Thành viên`
7. **Loại cư trú** (text): Chỉ chấp nhận 2 giá trị:
   - `Thường trú`
   - `Tạm trú`
8. **Ngày tham gia** (date): Định dạng DD/MM/YYYY (ví dụ: 01/01/2020)
9. **Avatar URL** (text): Link ảnh đại diện (có thể để trống)

## Quy tắc nhập liệu

### 1. Định dạng ngày tháng
- Sử dụng định dạng: `DD/MM/YYYY`
- Ví dụ: `15/03/1985`, `01/01/2020`

### 2. Quan hệ
- Chỉ sử dụng: `Chủ hộ` hoặc `Thành viên`
- Không sử dụng các từ khác như: "Chủ gia đình", "Member", v.v.

### 3. Loại cư trú
- Chỉ sử dụng: `Thường trú` hoặc `Tạm trú`
- Không sử dụng các từ khác như: "Permanent", "Temporary", v.v.

### 4. Email
- Phải đúng định dạng email hợp lệ
- Có thể để trống nếu không có

### 5. Số điện thoại
- Chỉ sử dụng số
- Có thể có dấu cách hoặc dấu gạch ngang
- Ví dụ: `0901234567`, `090-123-4567`

## Ví dụ dữ liệu mẫu

| Họ và tên | Ngày sinh | Địa chỉ | Số điện thoại | Email | Quan hệ | Loại cư trú | Ngày tham gia | Avatar URL |
|-----------|-----------|---------|---------------|-------|---------|-------------|---------------|------------|
| Nguyễn Văn An | 15/03/1985 | 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM | 0901234567 | nguyenvanan@email.com | Chủ hộ | Thường trú | 01/01/2020 | |
| Trần Thị Bình | 22/07/1990 | 456 Đường DEF, Phường UVW, Quận 2, TP.HCM | 0907654321 | tranthibinh@email.com | Thành viên | Thường trú | 01/01/2020 | |

## Lưu ý quan trọng

### ✅ Nên làm:
- Kiểm tra kỹ dữ liệu trước khi upload
- Sử dụng đúng định dạng ngày tháng
- Đảm bảo các giá trị quan hệ và loại cư trú chính xác
- Lưu file với encoding UTF-8 (cho file CSV)

### ❌ Không nên:
- Thay đổi tên các cột
- Sử dụng định dạng ngày tháng khác
- Sử dụng các giá trị không được hỗ trợ cho quan hệ và loại cư trú
- Để trống các trường bắt buộc (trừ Email và Avatar URL)

## Xử lý lỗi thường gặp

### Lỗi định dạng ngày tháng
- **Nguyên nhân**: Sử dụng định dạng khác DD/MM/YYYY
- **Giải pháp**: Chuyển đổi về định dạng DD/MM/YYYY

### Lỗi giá trị quan hệ/loại cư trú
- **Nguyên nhân**: Sử dụng từ khác ngoài các giá trị được hỗ trợ
- **Giải pháp**: Thay thế bằng `Chủ hộ`/`Thành viên` hoặc `Thường trú`/`Tạm trú`

### Lỗi encoding (file CSV)
- **Nguyên nhân**: File không được lưu với encoding UTF-8
- **Giải pháp**: Lưu lại file với encoding UTF-8

## Hỗ trợ
Nếu gặp vấn đề trong quá trình sử dụng, vui lòng liên hệ với bộ phận hỗ trợ kỹ thuật.
