import { useState, useEffect } from 'react';
import { groupsService } from '@/services/groupsService';
import type { Group } from '@/types/borrowing';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await groupsService.getGroups();
        setGroups(data);
        setError(null);
      } catch (err) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return { groups, loading, error };
}