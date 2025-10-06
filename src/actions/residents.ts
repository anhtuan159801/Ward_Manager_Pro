'use server';

import { supabase } from '@/lib/supabaseClient';
import type { Resident } from '@/lib/types';

export async function saveResidents(residents: Omit<Resident, 'id'>[]): Promise<{
  success: boolean;
  message: string;
  savedCount?: number;
  errors?: string[];
}> {
  try {
    // Validate data before saving
    const validationErrors: string[] = [];
    
    residents.forEach((resident, index) => {
      if (!resident.name?.trim()) {
        validationErrors.push(`Dòng ${index + 1}: Họ và tên không được để trống`);
      }
      if (!resident.dob?.trim()) {
        validationErrors.push(`Dòng ${index + 1}: Ngày sinh không được để trống`);
      }
      if (!resident.address?.trim()) {
        validationErrors.push(`Dòng ${index + 1}: Địa chỉ không được để trống`);
      }
      if (!resident.phone?.trim()) {
        validationErrors.push(`Dòng ${index + 1}: Số điện thoại không được để trống`);
      }
      if (!resident.relationship || !['Chủ hộ', 'Thành viên'].includes(resident.relationship)) {
        validationErrors.push(`Dòng ${index + 1}: Quan hệ phải là "Chủ hộ" hoặc "Thành viên"`);
      }
      if (!resident.residenceType || !['Thường trú', 'Tạm trú'].includes(resident.residenceType)) {
        validationErrors.push(`Dòng ${index + 1}: Loại cư trú phải là "Thường trú" hoặc "Tạm trú"`);
      }
      if (!resident.joinedDate?.trim()) {
        validationErrors.push(`Dòng ${index + 1}: Ngày tham gia không được để trống`);
      }
    });

    if (validationErrors.length > 0) {
      return {
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: validationErrors
      };
    }

    // Convert date strings to proper format for database and filter out optional fields
    const formattedResidents = residents.map((resident, index) => ({
      id: `ID${String(index + 1).padStart(5, '0')}`, // Generate ID00001, ID00002, etc.
      name: resident.name,
      dob: convertDateFormat(resident.dob),
      address: resident.address,
      phone: resident.phone,
      email: resident.email || null,
      relationship: resident.relationship,
      residence_type: resident.residenceType,
      joined_date: convertDateFormat(resident.joinedDate), // Use snake_case for database
      // Only include avatarUrl if it's not empty and not a placeholder
      ...(resident.avatarUrl && resident.avatarUrl !== 'greet.com' && resident.avatarUrl.trim() !== '' 
        ? { avatar_url: resident.avatarUrl } 
        : {})
    }));

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('residents')
      .insert(formattedResidents)
      .select();

    if (error) {
      console.error('Error saving residents:', error);
      return {
        success: false,
        message: `Lỗi lưu dữ liệu: ${error.message}`,
        errors: [error.message]
      };
    }

    return {
      success: true,
      message: `Đã lưu thành công ${data.length} cư dân`,
      savedCount: data.length
    };

  } catch (error) {
    console.error('Unexpected error saving residents:', error);
    return {
      success: false,
      message: `Lỗi không xác định: ${error instanceof Error ? error.message : 'Lỗi hệ thống'}`,
      errors: [error instanceof Error ? error.message : 'Lỗi hệ thống']
    };
  }
}

export async function deleteAllResidents(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase
      .from('residents')
      .delete()
      .neq('id', ''); // Delete all records

    if (error) {
      console.error('Error deleting all residents:', error);
      return {
        success: false,
        message: `Lỗi xóa dữ liệu: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Đã xóa toàn bộ dân cư thành công'
    };

  } catch (error) {
    console.error('Unexpected error deleting all residents:', error);
    return {
      success: false,
      message: `Lỗi không xác định: ${error instanceof Error ? error.message : 'Lỗi hệ thống'}`
    };
  }
}

function convertDateFormat(dateString: string): string {
  // Convert from DD/MM/YYYY to YYYY-MM-DD for database
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateString; // Return as is if format is unexpected
}
