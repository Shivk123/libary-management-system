import { api } from '@/lib/api';
import type { Group } from '@/types/borrowing';

export const groupsService = {
  async getGroups(): Promise<Group[]> {
    const response = await api.get('/groups');
    return response.data;
  },

  async getUserGroups(userId: string): Promise<Group[]> {
    const response = await api.get(`/groups/user/${userId}`);
    return response.data;
  },
};