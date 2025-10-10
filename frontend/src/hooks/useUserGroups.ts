import { useState, useEffect } from 'react';
import { groupsService } from '@/services/groupsService';
import { userService } from '@/services/userService';
import type { Group } from '@/types/borrowing';

export function useUserGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const currentUser = await userService.getCurrentUser();
        const data = await groupsService.getUserGroups(currentUser.id);
        setGroups(data);
        setError(null);
      } catch (err) {
        setError('Failed to load user groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return { groups, loading, error };
}