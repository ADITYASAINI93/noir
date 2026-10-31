export type RegistrationStatus = 'registered' | 'confirmed' | 'cancelled' | 'attended';
export type Gender = 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  instagram_handle?: string | null;
  gender?: Gender | string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Registration {
  id: string;
  reference_id: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  instagram_handle: string | null;
  gender?: Gender | string | null;
  registration_category?: string;
  event_name?: string | null;
  event_date?: string | null;
  venue?: string | null;
  registration_status: RegistrationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistrationSubmission {
  full_name: string;
  email: string;
  phone?: string;
  instagram_handle?: string;
  gender?: Gender | string;
  event_name?: string;
  event_date?: string;
  venue?: string;
  user_id?: string;
  privacy_acknowledged: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  reference_id: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  instagram_handle?: string | null;
  gender?: Gender | string | null;
  registration_category?: string;
  event_name?: string | null;
  event_date?: string | null;
  venue?: string | null;
  registration_status?: RegistrationStatus;
  created_at: string;
  message?: string;
}

export interface DashboardStats {
  total: number;
  today: number;
  registered: number;
  confirmed: number;
  attended: number;
  cancelled: number;
}

export interface RegistrationFilters {
  searchQuery: string;
  status: 'all' | RegistrationStatus;
  sortBy: 'newest' | 'oldest';
  page: number;
  pageSize: number;
}
