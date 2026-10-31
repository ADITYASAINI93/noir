import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContactEnquiry, EnquiryStatus } from '../types/event';

const LOCAL_ENQUIRIES_KEY = 'noir_contact_enquiries';

function getLocalEnquiries(): ContactEnquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_ENQUIRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const initialMock: ContactEnquiry[] = [
    {
      id: 'enq-01',
      full_name: 'Rohit Verma',
      email: 'rohit.v@example.com',
      subject: 'Table Reservation & VIP Enquiries',
      message: 'Looking to book a private VIP table for a party of 8 at the Sector 26 showcase this upcoming Saturday. Please share bottle service menu and availability.',
      status: 'pending',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'enq-02',
      full_name: 'Simran Sandhu',
      email: 'simran.sandhu@example.com',
      subject: 'Artist Booking / DJ Performance Submission',
      message: 'Hello NOIR curation team, I am an electronic music producer based in Chandigarh. Would love to submit my latest mix for upcoming club nights.',
      status: 'in_progress',
      admin_notes: 'Reviewed soundcloud demo. Forwarded to resident curation.',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  ];

  try {
    localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(initialMock));
  } catch {
    // ignore
  }

  return initialMock;
}

function saveLocalEnquiries(enquiries: ContactEnquiry[]): void {
  try {
    localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(enquiries));
  } catch (err) {
    console.error('Failed to save enquiries locally:', err);
  }
}

/**
 * Submit a new contact enquiry (Public)
 */
export async function submitContactEnquiry(data: {
  full_name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactEnquiry> {
  const newEnquiry: ContactEnquiry = {
    id: `enq-${Date.now()}`,
    full_name: data.full_name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data: created, error } = await supabase
        .from('contact_enquiries')
        .insert([
          {
            full_name: newEnquiry.full_name,
            email: newEnquiry.email,
            subject: newEnquiry.subject,
            message: newEnquiry.message,
            status: 'pending',
          },
        ])
        .select('*')
        .single();

      if (!error && created) {
        return created as ContactEnquiry;
      }
    } catch (err) {
      console.warn('Notice saving enquiry to database, persisting locally:', err);
    }
  }

  const all = getLocalEnquiries();
  all.unshift(newEnquiry);
  saveLocalEnquiries(all);
  return newEnquiry;
}

/**
 * Fetch all contact enquiries (Admin only)
 */
export async function fetchAllEnquiriesAdmin(): Promise<ContactEnquiry[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('contact_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as ContactEnquiry[];
      }
    } catch (err) {
      console.warn('Notice loading enquiries from database:', err);
    }
  }

  return getLocalEnquiries();
}

/**
 * Update enquiry status and administrative notes (Admin only)
 */
export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  admin_notes?: string
): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      const payload: { status: EnquiryStatus; admin_notes?: string; updated_at: string } = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (admin_notes !== undefined) {
        payload.admin_notes = admin_notes;
      }
      const { error } = await supabase.from('contact_enquiries').update(payload).eq('id', id);
      if (!error) return;
    } catch (err) {
      console.warn('Database enquiry update notice:', err);
    }
  }

  const all = getLocalEnquiries();
  const idx = all.findIndex((e) => e.id === id);
  if (idx !== -1) {
    all[idx].status = status;
    if (admin_notes !== undefined) all[idx].admin_notes = admin_notes;
    all[idx].updated_at = new Date().toISOString();
    saveLocalEnquiries(all);
  }
}

/**
 * Delete enquiry (Admin only)
 */
export async function deleteEnquiry(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('contact_enquiries').delete().eq('id', id);
      if (!error) return;
    } catch (err) {
      console.warn('Database enquiry delete notice:', err);
    }
  }

  const all = getLocalEnquiries();
  const filtered = all.filter((e) => e.id !== id);
  saveLocalEnquiries(filtered);
}
