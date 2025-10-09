import { api } from '@/lib/api';
import type { FineSettings } from '@/types/fineSettings';

export const fineSettingsService = {
  async getFineSettings(): Promise<FineSettings> {
    const response = await api.get('/fine-settings');
    return response.data;
  },

  async updateFineSettings(settings: FineSettings): Promise<FineSettings> {
    const response = await api.put('/fine-settings', settings);
    return response.data;
  },
};