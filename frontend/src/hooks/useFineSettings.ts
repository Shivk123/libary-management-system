import { useState, useEffect } from 'react';
import { fineSettingsService } from '@/services/fineSettingsService';
import type { FineSettings } from '@/types/fineSettings';

export function useFineSettings() {
  const [settings, setSettings] = useState<FineSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await fineSettingsService.getFineSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError('Failed to load fine settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: FineSettings) => {
    try {
      const updated = await fineSettingsService.updateFineSettings(newSettings);
      setSettings(updated);
      return updated;
    } catch (err) {
      setError('Failed to update fine settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings,
  };
}