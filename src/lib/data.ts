import type { Resident, Event, Feedback, User } from './types';

export const mockUser: User = {
  name: 'Tổ trưởng A',
  email: 'totruong.a@example.com',
  avatarUrl: 'https://picsum.photos/seed/user/40/40'
};

export const mockResidents: Resident[] = [
  { id: 'RES001', name: 'Nguyễn Văn An', dob: '1985-05-20', address: '123 Đường ABC, Phường 1', relationship: 'Chủ hộ', phone: '0901234567', email: 'an.nguyen@email.com', residenceType: 'Thường trú', joinedDate: '2022-01-15', avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'RES002', name: 'Trần Thị Bình', dob: '1990-11-15', address: '456 Đường XYZ, Phường 2', relationship: 'Chủ hộ', phone: '0912345678', email: 'binh.tran@email.com', residenceType: 'Tạm trú', joinedDate: '2021-11-20', avatarUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: 'RES003', name: 'Lê Văn Cường', dob: '2001-02-28', address: '789 Đường LMN, Phường 1', relationship: 'Thành viên', phone: '0987654321', email: 'cuong.le@email.com', residenceType: 'Thường trú', joinedDate: '2023-03-10', avatarUrl: 'https://picsum.photos/seed/3/40/40' },
  { id: 'RES004', name: 'Phạm Thị Dung', dob: '1978-09-10', address: '101 Đường PQR, Phường 3', relationship: 'Chủ hộ', phone: '0934567890', email: 'dung.pham@email.com', residenceType: 'Thường trú', joinedDate: '2020-07-22', avatarUrl: 'https://picsum.photos/seed/4/40/40' },
  { id: 'RES005', name: 'Hoàng Văn Em', dob: '1995-12-01', address: '212 Đường STU, Phường 2', relationship: 'Thành viên', phone: '0945678901', email: 'em.hoang@email.com', residenceType: 'Tạm trú', joinedDate: '2022-08-30', avatarUrl: 'https://picsum.photos/seed/5/40/40' },
];

export const mockEvents: Event[] = [
  { id: 'EVT001', title: 'Họp tổ dân phố Quý 3', date: '2024-09-15', description: 'Thảo luận về an ninh và vệ sinh khu phố.', qrCodeUrl: '1' },
  { id: 'EVT002', title: 'Tổ chức Trung Thu cho thiếu nhi', date: '2024-09-14', description: 'Gây quỹ và tổ chức vui chơi cho các cháu.', qrCodeUrl: '2' },
  { id: 'EVT003', title: 'Ra quân tổng vệ sinh', date: '2024-08-25', description: 'Dọn dẹp vệ sinh các tuyến đường và khu vực chung.', qrCodeUrl: '3' },
];

export const mockFeedbacks: Feedback[] = [
  { id: 'FB001', author: 'Nguyễn Văn An', timestamp: '2024-08-01 10:30', content: 'Đề nghị sửa chữa đèn đường ở hẻm 123, đã bị hỏng hơn 1 tuần nay.' },
  { id: 'FB002', author: 'Trần Thị Bình', timestamp: '2024-08-02 14:00', content: 'Rác thải sinh hoạt bị ùn ứ ở cuối đường XYZ, cần có biện pháp xử lý sớm.' },
  { id: 'FB003', author: 'Ẩn danh', timestamp: '2024-08-03 09:00', content: 'Tình trạng tụ tập gây mất trật tự vào ban đêm cần được giải quyết.' },
];
