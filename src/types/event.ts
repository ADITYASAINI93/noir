export type EventStatus = 'draft' | 'published' | 'archived';

export interface NoirEvent {
  id: string;
  title: string;
  slug?: string;
  description: string;
  venue: string;
  location: string;
  event_date: string; // ISO string
  end_time?: string | null;
  genre: string;
  artist: string;
  cover_charge?: string | null;
  poster_url: string;
  is_featured: boolean;
  status: EventStatus;
  created_at: string;
  updated_at?: string;
}

export type EnquiryStatus = 'pending' | 'in_progress' | 'resolved';

export interface ContactEnquiry {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}
