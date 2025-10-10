import { api } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

let currentUserCache: User | null = null;
let currentUserPromise: Promise<User> | null = null;

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // For demo purposes - in a real app this would come from authentication
  async getCurrentUser(): Promise<User> {
    // Return cached user if available
    if (currentUserCache) {
      return currentUserCache;
    }

    // Return existing promise if one is already in progress
    if (currentUserPromise) {
      return currentUserPromise;
    }

    // Create new promise and cache it
    currentUserPromise = (async () => {
      try {
        const users = await this.getUsers();
        const johnDoe = users.find(user => user.email === 'john@example.com');
        const user = johnDoe || users[0];
        currentUserCache = user;
        return user;
      } catch (error) {
        // Fallback for offline/error scenarios
        const fallbackUser = {
          id: 'temp-user-id',
          name: 'John Doe',
          email: 'john@example.com'
        };
        currentUserCache = fallbackUser;
        return fallbackUser;
      } finally {
        currentUserPromise = null;
      }
    })();

    return currentUserPromise;
  },
};