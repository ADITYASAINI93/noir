export type RegistrationStatus = 'registered' | 'confirmed' | 'cancelled' | 'attended';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  instagram_handle?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Registration {
  id: string;
  reference_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  instagram_handle: string | null;
  registration_category?: string;
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
  privacy_acknowledged: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  reference_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  instagram_handle?: string | null;
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
