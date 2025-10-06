import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { Resident } from './types';

export interface ParseResult {
  success: boolean;
  data: Resident[];
  errors: string[];
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { 
      type: 'array',
      cellDates: true, // This will try to parse dates automatically
      dateNF: 'dd/mm/yyyy' // Specify the date format we expect
    });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with raw values to preserve original data types
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      raw: true // Keep raw values to handle dates properly
    });
    
    if (jsonData.length < 2) {
      return {
        success: false,
        data: [],
        errors: ['File không có dữ liệu hoặc thiếu header']
      };
    }

    // Get headers (first row)
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1) as any[][];

    // Map headers to our expected format
    const headerMap = createHeaderMap(headers);
    
    const residents: Resident[] = [];
    const errors: string[] = [];

    dataRows.forEach((row, index) => {
      if (row.every(cell => !cell || cell.toString().trim() === '')) {
        return; // Skip empty rows
      }

      try {
        const resident = mapRowToResident(row, headerMap, index + 2); // +2 because we skip header and 0-indexed
        residents.push(resident);
      } catch (error) {
        errors.push(`Dòng ${index + 2}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
      }
    });

    return {
      success: errors.length === 0,
      data: residents,
      errors
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`Lỗi đọc file Excel: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`]
    };
  }
}

export async function parseCsvFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            resolve({
              success: false,
              data: [],
              errors: results.errors.map(err => `Dòng ${err.row}: ${err.message}`)
            });
            return;
          }

          const data = results.data as any[];
          const residents: Resident[] = [];
          const errors: string[] = [];

          // Map headers
          const headerMap = createHeaderMap(Object.keys(data[0] || {}));

          data.forEach((row, index) => {
            try {
              const resident = mapRowToResident(Object.values(row), headerMap, index + 1);
              residents.push(resident);
            } catch (error) {
              errors.push(`Dòng ${index + 1}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
            }
          });

          resolve({
            success: errors.length === 0,
            data: residents,
            errors
          });
        } catch (error) {
          resolve({
            success: false,
            data: [],
            errors: [`Lỗi xử lý file CSV: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`]
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [`Lỗi đọc file CSV: ${error.message}`]
        });
      }
    });
  });
}

function createHeaderMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  
  headers.forEach((header, index) => {
    const normalizedHeader = header?.toString().toLowerCase().trim();
    
    // Map various possible header names to our expected format
    if (normalizedHeader?.includes('họ') && normalizedHeader?.includes('tên')) {
      map.name = index;
    } else if (normalizedHeader?.includes('ngày') && normalizedHeader?.includes('sinh')) {
      map.dob = index;
    } else if (normalizedHeader?.includes('địa') && normalizedHeader?.includes('chỉ')) {
      map.address = index;
    } else if (normalizedHeader?.includes('điện') && normalizedHeader?.includes('thoại')) {
      map.phone = index;
    } else if (normalizedHeader?.includes('email')) {
      map.email = index;
    } else if (normalizedHeader?.includes('quan') && normalizedHeader?.includes('hệ')) {
      map.relationship = index;
    } else if (normalizedHeader?.includes('loại') && normalizedHeader?.includes('cư')) {
      map.residenceType = index;
    } else if (normalizedHeader?.includes('ngày') && normalizedHeader?.includes('tham')) {
      map.joinedDate = index;
    } else if (normalizedHeader?.includes('avatar')) {
      map.avatarUrl = index;
    }
  });

  return map;
}

function mapRowToResident(row: any[], headerMap: Record<string, number>, rowNumber: number): Resident {
  const getValue = (key: string): string => {
    const index = headerMap[key];
    if (index === undefined || index >= row.length) {
      throw new Error(`Thiếu cột "${key}"`);
    }
    return row[index]?.toString().trim() || '';
  };

  const getDateValue = (key: string): string => {
    const index = headerMap[key];
    if (index === undefined || index >= row.length) {
      throw new Error(`Thiếu cột "${key}"`);
    }
    const value = row[index];
    
    // If it's already a string in DD/MM/YYYY format, return as is
    if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return value;
    }
    
    // If it's a number (Excel serial date), convert it
    if (typeof value === 'number') {
      return convertExcelSerialToDate(value);
    }
    
    // If it's a Date object, format it
    if (value instanceof Date) {
      return formatDateToDDMMYYYY(value);
    }
    
    // For any other case, convert to string and try to parse
    const stringValue = value?.toString().trim() || '';
    if (stringValue) {
      // Try to parse as date if it looks like a date
      const parsedDate = new Date(stringValue);
      if (!isNaN(parsedDate.getTime())) {
        return formatDateToDDMMYYYY(parsedDate);
      }
      return stringValue;
    }
    
    return '';
  };

  const name = getValue('name');
  const dob = getDateValue('dob');
  const address = getValue('address');
  const phone = getValue('phone');
  const email = getValue('email');
  const relationship = normalizeRelationship(getValue('relationship'));
  const residenceType = normalizeResidenceType(getValue('residenceType'));
  const joinedDate = getDateValue('joinedDate');
  const avatarUrl = getValue('avatarUrl');

  // Validate required fields
  if (!name) throw new Error('Họ và tên không được để trống');
  if (!dob) throw new Error('Ngày sinh không được để trống');
  if (!address) throw new Error('Địa chỉ không được để trống');
  if (!phone) throw new Error('Số điện thoại không được để trống');
  if (!relationship) throw new Error('Quan hệ không được để trống');
  if (!residenceType) throw new Error('Loại cư trú không được để trống');
  if (!joinedDate) throw new Error('Ngày tham gia không được để trống');

  return {
    id: '', // Will be generated by database
    name,
    dob,
    address,
    phone,
    email: email || '',
    relationship: relationship as 'Chủ hộ' | 'Thành viên',
    residenceType: residenceType as 'Thường trú' | 'Tạm trú',
    joinedDate,
    avatarUrl: avatarUrl || ''
  };
}

// Helper function to convert Excel serial date to DD/MM/YYYY format
function convertExcelSerialToDate(serial: number): string {
  // Excel serial date starts from 1900-01-01, but Excel incorrectly treats 1900 as a leap year
  // So we need to adjust for this
  const excelEpoch = new Date(1900, 0, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
  // Adjust for Excel's leap year bug (1900 is not a leap year in reality)
  const adjustedSerial = serial > 59 ? serial - 1 : serial;
  
  const date = new Date(excelEpoch.getTime() + (adjustedSerial - 1) * millisecondsPerDay);
  return formatDateToDDMMYYYY(date);
}

// Helper function to format Date object to DD/MM/YYYY string
function formatDateToDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper function to normalize relationship values
function normalizeRelationship(relationship: string): string {
  const normalized = relationship.toLowerCase().trim();
  if (normalized.includes('chủ') && normalized.includes('hộ')) {
    return 'Chủ hộ';
  } else if (normalized.includes('thành') && normalized.includes('viên')) {
    return 'Thành viên';
  }
  return relationship; // Return original if no match
}

// Helper function to normalize residence type values
function normalizeResidenceType(residenceType: string): string {
  const normalized = residenceType.toLowerCase().trim();
  if (normalized.includes('thường') && normalized.includes('trú')) {
    return 'Thường trú';
  } else if (normalized.includes('tạm') && normalized.includes('trú')) {
    return 'Tạm trú';
  }
  return residenceType; // Return original if no match
}
