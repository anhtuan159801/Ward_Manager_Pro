import type { Resident, Event, Feedback, User } from './types';
import { supabase} from './supabaseClient';

// Fetch user data from Supabase
export async function getUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1).single();
    
    if (error) {
      // Check if it's a "no rows" error (PGRST116)
      if (error.code === 'PGRST116') {
        console.warn('No user found in the database.');
        return null;
      }
      
      // Log other errors with more detail
      console.error('Error fetching user:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return null;
    }
    
    return data as User;
  } catch (err) {
    console.error('Unexpected error fetching user:', err);
    return null;
  }
}

// Fetch residents from Supabase
export async function getResidents(): Promise<Resident[]> {
  try {
    const { data, error } = await supabase.from('residents').select('*');
    if (error) {
      console.error('Error fetching residents:', error);
      return [];
    }
    
    // Map database fields to Resident type
    const residents: Resident[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      dob: formatDateFromDatabase(row.dob), // Convert YYYY-MM-DD to DD/MM/YYYY
      address: row.address,
      phone: row.phone,
      email: row.email || '',
      relationship: row.relationship,
      residenceType: row.residence_type, // Map snake_case to camelCase
      joinedDate: formatDateFromDatabase(row.joined_date), // Convert YYYY-MM-DD to DD/MM/YYYY
      avatarUrl: row.avatar_url || ''
    }));
    
    return residents;
  } catch (err) {
    console.error('Unexpected error fetching residents:', err);
    return [];
  }
}

// Helper function to convert database date (YYYY-MM-DD) to display format (DD/MM/YYYY)
function formatDateFromDatabase(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original if conversion fails
  }
}

// Fetch events from Supabase
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from('events').select('*');
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data as Event[];
}

// Fetch feedbacks from Supabase
export async function getFeedbacks(): Promise<Feedback[]> {
  const { data, error } = await supabase.from('feedbacks').select('*');
  if (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }
  return data as Feedback[];
}
