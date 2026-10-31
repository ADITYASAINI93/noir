import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../types/settings';
import { fetchSiteSettings, updateSiteSettings } from '../services/siteSettingsService';

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  isFallback: boolean;
  missingTable: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; savedToCloud: boolean; error?: string }>;
  reloadSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [missingTable, setMissingTable] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSiteSettings();
      setSettings(res.settings);
      setIsFallback(res.isFallback);
      setMissingTable(res.missingTable);
      if (res.error) {
        setError(res.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load site settings';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleUpdateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const res = await updateSiteSettings(newSettings);
      setSettings(res.settings);
      if (res.error) {
        setError(res.error);
        return { success: true, savedToCloud: false, error: res.error };
      }
      return { success: true, savedToCloud: res.savedToCloud };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings';
      setError(msg);
      return { success: false, savedToCloud: false, error: msg };
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        isFallback,
        missingTable,
        error,
        updateSettings: handleUpdateSettings,
        reloadSettings: loadSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
