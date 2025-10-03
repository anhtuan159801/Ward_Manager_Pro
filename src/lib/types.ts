export type Resident = {
  id: string;
  name: string;
  dob: string; // Date of Birth
  address: string;
  relationship: 'Chủ hộ' | 'Thành viên';
  phone: string;
  email: string;
  residenceType: 'Thường trú' | 'Tạm trú';
  joinedDate: string;
  avatarUrl: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  qrCodeUrl: string;
};

export type Feedback = {
  id: string;
  author: string;
  timestamp: string;
  content: string;
};

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
};
