import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NoirEvent } from '../types/event';

const LOCAL_EVENTS_KEY = 'noir_admin_events_v2';

function getLocalEvents(): NoirEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

function saveLocalEvents(events: NoirEvent[]): void {
  try {
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events locally:', err);
  }
}

function notifyEventsUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('noir_events_updated'));
  }
}

/**
 * Fetch all published events for public visitors
 */
export async function fetchPublishedEvents(): Promise<NoirEvent[]> {
  const localPublished = getLocalEvents().filter((e) => e.status === 'published');

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: true });

      if (error) {
        console.warn('[NOIR] Error querying public.events from Supabase:', error.message);
        return localPublished;
      }

      const dbEvents = (data || []) as NoirEvent[];

      // Merge database events and local events, deduplicating by ID
      const map = new Map<string, NoirEvent>();
      for (const e of localPublished) {
        map.set(e.id, e);
      }
      for (const e of dbEvents) {
        map.set(e.id, e);
      }

      const merged = Array.from(map.values());
      return merged.sort(
        (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
    } catch (err: unknown) {
      console.warn('[NOIR] Database error fetching events:', err);
      return localPublished;
    }
  }

  return localPublished;
}

/**
 * Fetch all events (including drafts and archives) for administrators
 */
export async function fetchAllEventsAdmin(): Promise<{ events: NoirEvent[]; missingTable?: boolean; error?: string }> {
  const localEvents = getLocalEvents();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
          console.warn('[NOIR Admin] public.events table does not exist in schema cache.');
          return {
            events: localEvents,
            missingTable: true,
            error: "Table 'public.events' does not exist in database. Please run migration 'supabase/migrations/08_create_events_and_enquiries.sql' in your Supabase SQL Editor.",
          };
        }
        throw new Error(error.message);
      }

      const dbEvents = (data || []) as NoirEvent[];
      // Merge local and DB events to ensure complete visibility
      const map = new Map<string, NoirEvent>();
      for (const e of localEvents) {
        map.set(e.id, e);
      }
      for (const e of dbEvents) {
        map.set(e.id, e);
      }

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
      );
      return { events: merged };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database error loading events';
      console.error('[NOIR Admin] Error fetching all events:', msg);
      return {
        events: localEvents,
        error: msg,
      };
    }
  }

  return { events: localEvents };
}

/**
 * Create a new event (Admin only)
 */
export async function createEvent(
  eventData: Omit<NoirEvent, 'id' | 'created_at' | 'updated_at'>
): Promise<NoirEvent> {
  const cleanTitle = eventData.title.trim();
  if (!cleanTitle) {
    throw new Error('Event title is required.');
  }

  const generatedSlug = (eventData.slug?.trim() || cleanTitle.toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const payload = {
    title: cleanTitle,
    slug: generatedSlug,
    description: eventData.description?.trim() || '',
    venue: eventData.venue.trim(),
    location: eventData.location?.trim() || 'Chandigarh, India',
    event_date: eventData.event_date,
    end_time: eventData.end_time || null,
    genre: eventData.genre?.trim() || 'Melodic Techno',
    artist: eventData.artist?.trim() || '',
    cover_charge: eventData.cover_charge?.trim() || null,
    poster_url: eventData.poster_url?.trim() || '',
    is_featured: Boolean(eventData.is_featured),
    status: eventData.status || 'published',
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        // Fallback to local storage when table not yet created
        const localEvent: NoirEvent = {
          ...payload,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ev-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const all = getLocalEvents();
        all.unshift(localEvent);
        saveLocalEvents(all);
        throw new Error(
          "Table 'public.events' does not exist in Supabase. Event saved locally. Please execute migration 'supabase/migrations/08_create_events_and_enquiries.sql' in your Supabase SQL Editor."
        );
      }
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error('Event was created, but no record was returned from database.');
    }

    const created = data as NoirEvent;
    const all = getLocalEvents();
    const existingIndex = all.findIndex((e) => e.id === created.id);
    if (existingIndex !== -1) {
      all[existingIndex] = created;
    } else {
      all.unshift(created);
    }
    saveLocalEvents(all);
    notifyEventsUpdated();
    return created;
  }

  // Local storage fallback for offline / preview
  const localEvent: NoirEvent = {
    ...payload,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ev-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const all = getLocalEvents();
  all.unshift(localEvent);
  saveLocalEvents(all);
  notifyEventsUpdated();
  return localEvent;
}

/**
 * Update an existing event (Admin only)
 */
export async function updateEvent(
  id: string,
  updates: Partial<NoirEvent>
): Promise<NoirEvent> {
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) updatePayload.title = updates.title.trim();
  if (updates.slug !== undefined) updatePayload.slug = updates.slug.trim();
  if (updates.description !== undefined) updatePayload.description = updates.description.trim();
  if (updates.venue !== undefined) updatePayload.venue = updates.venue.trim();
  if (updates.location !== undefined) updatePayload.location = updates.location.trim();
  if (updates.event_date !== undefined) updatePayload.event_date = updates.event_date;
  if (updates.end_time !== undefined) updatePayload.end_time = updates.end_time || null;
  if (updates.genre !== undefined) updatePayload.genre = updates.genre.trim();
  if (updates.artist !== undefined) updatePayload.artist = updates.artist.trim();
  if (updates.cover_charge !== undefined) updatePayload.cover_charge = updates.cover_charge?.trim() || null;
  if (updates.poster_url !== undefined) updatePayload.poster_url = updates.poster_url.trim();
  if (updates.is_featured !== undefined) updatePayload.is_featured = Boolean(updates.is_featured);
  if (updates.status !== undefined) updatePayload.status = updates.status;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('events')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        const all = getLocalEvents();
        const idx = all.findIndex((e) => e.id === id);
        if (idx !== -1) {
          all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
          saveLocalEvents(all);
          notifyEventsUpdated();
          return all[idx];
        }
        throw new Error("Table 'public.events' does not exist in Supabase.");
      }
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error('Event not found or failed to update in database.');
    }

    const updated = data as NoirEvent;
    const all = getLocalEvents();
    const idx = all.findIndex((e) => e.id === id);
    if (idx !== -1) {
      all[idx] = updated;
    } else {
      all.unshift(updated);
    }
    saveLocalEvents(all);
    notifyEventsUpdated();
    return updated;
  }

  const all = getLocalEvents();
  const idx = all.findIndex((e) => e.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
    saveLocalEvents(all);
    notifyEventsUpdated();
    return all[idx];
  }
  throw new Error('Event not found in local storage.');
}

/**
 * Delete an event (Admin only)
 */
export async function deleteEvent(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        const all = getLocalEvents();
        const filtered = all.filter((e) => e.id !== id);
        saveLocalEvents(filtered);
        notifyEventsUpdated();
        return;
      }
      throw new Error(`Database error: ${error.message}`);
    }
  }

  const all = getLocalEvents();
  const filtered = all.filter((e) => e.id !== id);
  saveLocalEvents(filtered);
  notifyEventsUpdated();
}
