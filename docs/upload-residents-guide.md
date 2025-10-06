# Hướng dẫn Upload Danh sách Dân cư

## Tổng quan
Chức năng upload danh sách dân cư cho phép bạn tải lên nhiều cư dân cùng lúc thông qua file Excel hoặc CSV, giúp tiết kiệm thời gian và giảm thiểu lỗi nhập liệu.

## Cách sử dụng

### 1. Truy cập chức năng upload
1. Đăng nhập vào hệ thống WardPro
2. Vào trang **Cư dân** (`/dashboard/residents`)
3. Click nút **"Thêm Cư dân"**
4. Chọn tab **"Tải lên từ tệp"**

### 2. Tải template mẫu
1. Click nút **"Excel (.xlsx)"** hoặc **"CSV (.csv)"** để tải template
2. Click nút **"Hướng dẫn"** để xem chi tiết cấu trúc dữ liệu
3. Mở file template đã tải về

### 3. Điền dữ liệu
1. Điền thông tin dân cư vào các cột tương ứng
2. Đảm bảo tuân thủ định dạng dữ liệu:
   - **Ngày tháng**: DD/MM/YYYY (ví dụ: 15/03/1985)
   - **Quan hệ**: Chỉ sử dụng "Chủ hộ" hoặc "Thành viên"
   - **Loại cư trú**: Chỉ sử dụng "Thường trú" hoặc "Tạm trú"
   - **Email**: Định dạng email hợp lệ (có thể để trống)
   - **Avatar URL**: URL hợp lệ (có thể để trống)

### 4. Upload và xem trước
1. Lưu file đã điền dữ liệu
2. Quay lại giao diện upload
3. Click **"Chọn tệp"** và chọn file đã điền
4. Click **"Tải lên và xem trước"**
5. Hệ thống sẽ xử lý file và hiển thị preview

### 5. Kiểm tra và lưu dữ liệu
1. Xem trước dữ liệu trong bảng
2. Kiểm tra các lỗi validation (nếu có)
3. Click **"Lưu dữ liệu"** để lưu vào hệ thống
4. Hệ thống sẽ thông báo kết quả lưu

## Cấu trúc dữ liệu

### Các cột bắt buộc:
- **Họ và tên**: Tên đầy đủ của cư dân
- **Ngày sinh**: Định dạng DD/MM/YYYY
- **Địa chỉ**: Địa chỉ đầy đủ
- **Số điện thoại**: Số điện thoại liên lạc
- **Quan hệ**: "Chủ hộ" hoặc "Thành viên"
- **Loại cư trú**: "Thường trú" hoặc "Tạm trú"
- **Ngày tham gia**: Định dạng DD/MM/YYYY

### Các cột tùy chọn:
- **Email**: Địa chỉ email (có thể để trống)
- **Avatar URL**: Link ảnh đại diện (có thể để trống)

## Validation và xử lý lỗi

### Các loại validation:
1. **Validation định dạng**: Kiểm tra định dạng ngày tháng, email
2. **Validation giá trị**: Kiểm tra giá trị quan hệ, loại cư trú
3. **Validation bắt buộc**: Kiểm tra các trường không được để trống

### Xử lý lỗi:
- **Lỗi đọc file**: Kiểm tra định dạng file và cấu trúc
- **Lỗi validation**: Sửa dữ liệu theo gợi ý
- **Lỗi lưu dữ liệu**: Kiểm tra kết nối và quyền truy cập

## Tính năng nổi bật

### 1. Preview dữ liệu
- Hiển thị dữ liệu trong bảng dễ đọc
- Đánh dấu các dòng có lỗi
- Thống kê số lượng dữ liệu hợp lệ/lỗi

### 2. Validation thông minh
- Kiểm tra định dạng dữ liệu tự động
- Gợi ý sửa lỗi chi tiết
- Ngăn chặn lưu dữ liệu không hợp lệ

### 3. Hỗ trợ đa định dạng
- Excel (.xlsx, .xls)
- CSV (.csv)
- Tự động nhận diện định dạng file

### 4. Giao diện thân thiện
- Drag & drop file
- Progress indicator
- Toast notifications
- Responsive design

## Lưu ý quan trọng

### ✅ Nên làm:
- Sử dụng template mẫu có sẵn
- Kiểm tra dữ liệu trước khi upload
- Lưu file CSV với encoding UTF-8
- Backup dữ liệu trước khi upload hàng loạt

### ❌ Không nên:
- Thay đổi tên các cột trong template
- Sử dụng định dạng ngày tháng khác
- Upload file quá lớn (>10MB)
- Để trống các trường bắt buộc

## Troubleshooting

### Lỗi thường gặp:

1. **"File không có dữ liệu"**
   - Kiểm tra file có dữ liệu không
   - Đảm bảo có header row

2. **"Định dạng ngày tháng không đúng"**
   - Sử dụng định dạng DD/MM/YYYY
   - Kiểm tra không có ký tự đặc biệt

3. **"Quan hệ không hợp lệ"**
   - Chỉ sử dụng "Chủ hộ" hoặc "Thành viên"
   - Không có khoảng trắng thừa

4. **"Lỗi lưu dữ liệu"**
   - Kiểm tra kết nối internet
   - Liên hệ admin nếu vấn đề tiếp tục

## Hỗ trợ

Nếu gặp vấn đề trong quá trình sử dụng:
1. Kiểm tra hướng dẫn này
2. Sử dụng nút "Hướng dẫn" trong giao diện
3. Liên hệ bộ phận hỗ trợ kỹ thuật
4. Báo cáo lỗi với thông tin chi tiết
