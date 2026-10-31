import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../types/settings';

const LOCAL_STORAGE_KEY = 'noir_site_settings_cache_v1';

/**
 * Retrieve cached settings from localStorage, or return defaults.
 */
function getCachedSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_SITE_SETTINGS;
}

/**
 * Save settings to localStorage cache.
 */
function setCachedSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage quota errors
  }
}

interface RawDbSettingsRow {
  id: string;
  brand_name?: string;
  brand_tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  operating_region?: string;
  city_state?: string;
  instagram_handle?: string;
  instagram_url?: string;
  operating_hours?: string;
  admission_policy?: string;
  updated_at?: string;
}

function mapRowToSettings(row: RawDbSettingsRow): SiteSettings {
  return {
    brandName: row.brand_name || DEFAULT_SITE_SETTINGS.brandName,
    brandTagline: row.brand_tagline || DEFAULT_SITE_SETTINGS.brandTagline,
    contactEmail: row.contact_email || DEFAULT_SITE_SETTINGS.contactEmail,
    contactPhone: row.contact_phone || DEFAULT_SITE_SETTINGS.contactPhone,
    operatingRegion: row.operating_region || DEFAULT_SITE_SETTINGS.operatingRegion,
    cityState: row.city_state || DEFAULT_SITE_SETTINGS.cityState,
    instagramHandle: row.instagram_handle || DEFAULT_SITE_SETTINGS.instagramHandle,
    instagramUrl: row.instagram_url || DEFAULT_SITE_SETTINGS.instagramUrl,
    operatingHours: row.operating_hours || DEFAULT_SITE_SETTINGS.operatingHours,
    admissionPolicy: row.admission_policy || DEFAULT_SITE_SETTINGS.admissionPolicy,
    updatedAt: row.updated_at,
  };
}

export interface FetchSettingsResponse {
  settings: SiteSettings;
  isFallback: boolean;
  missingTable: boolean;
  error?: string;
}

/**
 * Fetch shared site settings from Supabase, falling back gracefully to local cache or defaults.
 */
export async function fetchSiteSettings(): Promise<FetchSettingsResponse> {
  const cached = getCachedSettings();

  if (!isSupabaseConfigured || !supabase) {
    return {
      settings: cached,
      isFallback: true,
      missingTable: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle();

    if (error) {
      // PGRST205 indicates the table does not exist in schema cache
      const isMissing = error.code === 'PGRST205' || error.message.includes('site_settings');
      return {
        settings: cached,
        isFallback: true,
        missingTable: isMissing,
        error: isMissing ? undefined : error.message,
      };
    }

    if (data) {
      const mapped = mapRowToSettings(data);
      setCachedSettings(mapped);
      return {
        settings: mapped,
        isFallback: false,
        missingTable: false,
      };
    }

    // Row doesn't exist yet, return cached / default
    return {
      settings: cached,
      isFallback: true,
      missingTable: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown network error';
    return {
      settings: cached,
      isFallback: true,
      missingTable: false,
      error: msg,
    };
  }
}

/**
 * Update site settings in Supabase and update local cache.
 */
export async function updateSiteSettings(
  updated: Partial<SiteSettings>
): Promise<{ settings: SiteSettings; savedToCloud: boolean; error?: string }> {
  const current = getCachedSettings();
  const merged: SiteSettings = {
    ...current,
    ...updated,
    updatedAt: new Date().toISOString(),
  };

  // Always update local cache immediately so client updates instantly
  setCachedSettings(merged);

  if (!isSupabaseConfigured || !supabase) {
    return {
      settings: merged,
      savedToCloud: false,
    };
  }

  try {
    const payload = {
      id: 'general',
      brand_name: merged.brandName,
      brand_tagline: merged.brandTagline,
      contact_email: merged.contactEmail,
      contact_phone: merged.contactPhone,
      operating_region: merged.operatingRegion,
      city_state: merged.cityState,
      instagram_handle: merged.instagramHandle,
      instagram_url: merged.instagramUrl,
      operating_hours: merged.operatingHours,
      admission_policy: merged.admissionPolicy,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return {
        settings: merged,
        savedToCloud: false,
        error: error.message,
      };
    }

    return {
      settings: merged,
      savedToCloud: true,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update remote settings';
    return {
      settings: merged,
      savedToCloud: false,
      error: msg,
    };
  }
}
