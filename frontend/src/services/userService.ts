import { api } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

let currentUserCache: User | null = null;
let currentUserPromise: Promise<User> | null = null;

export const userService = {
  clearCache() {
    currentUserCache = null;
    currentUserPromise = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  async signIn(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/users/signin', { email, password });
    const { user, token } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUserCache = user;
    
    return { user, token };
  },

  async signUp(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/users/signup', { name, email, password });
    const { user, token } = response.data;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUserCache = user;
    
    return { user, token };
  },

  async signOut(): Promise<void> {
    try {
      await api.post('/users/signout');
    } catch (error) {
      // Continue with sign out even if API call fails
    }
    this.clearCache();
  },
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    currentUserCache = null;
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    if (currentUserCache) {
      return currentUserCache;
    }

    if (currentUserPromise) {
      return currentUserPromise;
    }

    currentUserPromise = (async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken');
        
        if (!storedUser || !token) {
          throw new Error('No authenticated user');
        }
        
        const user = JSON.parse(storedUser);
        currentUserCache = user;
        return user;
      } catch (error) {
        this.clearCache();
        throw new Error('Authentication required');
      } finally {
        currentUserPromise = null;
      }
    })();

    return currentUserPromise;
  },

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('authToken') && localStorage.getItem('currentUser'));
  },
};