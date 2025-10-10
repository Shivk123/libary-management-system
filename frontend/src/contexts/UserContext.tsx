import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User } from '@/lib/schemas';
import { userService } from '@/services/userService';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isSignedOut: boolean;
}

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SIGN_OUT' };

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
  isSignedOut: false,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isSignedOut: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
      };
    case 'SIGN_OUT':
      return { user: null, loading: false, error: null, isSignedOut: true };
    default:
      return state;
  }
}

interface UserContextType extends UserState {
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const loadUser = async () => {
    if (state.isSignedOut) return;
    
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

  const signOut = () => {
    userService.clearCache();
    dispatch({ type: 'SIGN_OUT' });
  };

  useEffect(() => {
    if (!state.isSignedOut) {
      loadUser();
    }
  }, [state.isSignedOut]);

  const contextValue: UserContextType = {
    ...state,
    updateUser,
    refreshUser,
    signOut,
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