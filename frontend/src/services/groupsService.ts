import { api } from '@/lib/api';
import type { Group } from '@/types/borrowing';

let userGroupsCache: { [userId: string]: Group[] } = {};
let userGroupsPromises: { [userId: string]: Promise<Group[]> } = {};

export const groupsService = {
  async getGroups(): Promise<Group[]> {
    const response = await api.get('/groups');
    return response.data;
  },

  async getUserGroups(userId: string): Promise<Group[]> {
    if (userGroupsCache[userId]) {
      return userGroupsCache[userId];
    }

    if (userGroupsPromises[userId]) {
      return userGroupsPromises[userId];
    }

    userGroupsPromises[userId] = (async () => {
      try {
        const response = await api.get(`/groups/user/${userId}`);
        userGroupsCache[userId] = response.data;
        return response.data;
      } finally {
        delete userGroupsPromises[userId];
      }
    })();

    return userGroupsPromises[userId];
  },

  async createGroup(groupData: { name: string; description: string; createdBy: string; members?: string[] }): Promise<Group> {
    const response = await api.post('/groups', groupData);
    userGroupsCache = {};
    return response.data;
  },

  async addMemberToGroup(groupId: string, userId: string): Promise<void> {
    await api.post(`/groups/${groupId}/members`, { userId });
    userGroupsCache = {};
  },
};