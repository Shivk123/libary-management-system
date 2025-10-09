import { api } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  // For demo purposes - in a real app this would come from authentication
  getCurrentUser(): User {
    return {
      id: 'cmgjuhie90003wjhb2pzsuv3j',
      name: 'John Doe',
      email: 'john@example.com'
    };
  },
};