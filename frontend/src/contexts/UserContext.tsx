import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User } from '@/lib/schemas';
import { userService } from '@/services/userService';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
      };
    default:
      return state;
  }
}

interface UserContextType extends UserState {
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const loadUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await userService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!state.user) throw new Error('No user to update');
    
    const updatedUser = await userService.updateUser(state.user.id, userData);
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const refreshUser = async () => {
    await loadUser();
  };

  useEffect(() => {
    loadUser();
  }, []);

  const contextValue: UserContextType = {
    ...state,
    updateUser,
    refreshUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}